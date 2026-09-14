using System;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace NeuroPivot.Services;

public class AppState : IDisposable
{
    private readonly LocalStorageService? _localStorage;
    private readonly IJSRuntime? _jsRuntime;
    private readonly AccountService? _accountService;
    private bool _disposed;

    public event Action? OnChange;
    public event Action? OnTick;
    public event Action<UserAccount>? OnUserLoaded;
    public event Action? OnUserLoggedOut;

    public bool IsLoggedIn { get; private set; } = false;
    public string Username { get; private set; } = "HighPerformer";
    public string ActiveView { get; private set; } = "landing"; // landing, welcome_transition, focus_select, sleep_questionnaire, list, recommended, profile, about
    public string WelcomeMessageType { get; private set; } = "new"; // new ("Welcome to 'no bs'"), returning ("Welcome back")
    
    // User Settings (Dark Mode is default)
    public bool IsDarkMode { get; private set; } = true;
    public bool SleepNotificationsEnabled { get; private set; } = true;
    public int SoundVolume { get; private set; } = 80; // 0 to 100

    // User Goal & Addiction Protocol Assessment
    public string CurrentGoal { get; private set; } = "habits"; // habits, sleep, eating
    public string AddictionLevel { get; private set; } = "average"; // average, concerning, addicted
    public int AddictionScore { get; private set; } = 0;

    // Habits Goal Specific: Motivation, Logs, Relapses & Urges
    public string InitialHabitMotivation { get; private set; } = "";
    public List<DailyMoodEntry> DailyMoodLogs { get; private set; } = new();
    public List<RelapseEntry> RelapseLogs { get; private set; } = new();
    public int UrgesSurfedCount { get; private set; } = 0;
    public List<int> FavoriteArchiveDays { get; private set; } = new();

    // User Profile
    public string UserRole { get; private set; } = "Science Optimizer";
    public string? AvatarUrl { get; private set; } = null;

    // Profile Sub-section (dashboard, you, stats, settings, suggestions)
    public string ActiveProfileSection { get; private set; } = "dashboard";
    public int SelectedArchiveDay { get; private set; } = 1;

    // Session Timer
    public int WebsiteTimeSeconds { get; private set; } = 0;
    private System.Threading.Timer? _timer;

    public AppState(LocalStorageService localStorage, IJSRuntime jsRuntime, AccountService accountService)
    {
        _localStorage = localStorage;
        _jsRuntime = jsRuntime;
        _accountService = accountService;
        _timer = new System.Threading.Timer(_ =>
        {
            if (_disposed) return;
            WebsiteTimeSeconds++;
            if (_accountService?.ActiveAccount != null)
            {
                _accountService.ActiveAccount.WebsiteTimeSeconds = WebsiteTimeSeconds;
                if (WebsiteTimeSeconds % 5 == 0)
                {
                    _ = _accountService.SaveAccountAsync(_accountService.ActiveAccount);
                }
            }
            else if (_localStorage != null && WebsiteTimeSeconds % 5 == 0)
            {
                _ = _localStorage.SetItemAsync("nobs_guest_website_time_seconds", WebsiteTimeSeconds);
            }
            try
            {
                OnTick?.Invoke();
            }
            catch
            {
                // Tick handlers must not tear down the circuit
            }
        }, null, 1000, 1000);
    }

    public void SetActiveProfileSection(string section)
    {
        if (!string.IsNullOrWhiteSpace(section))
        {
            ActiveProfileSection = section;
            NotifyStateChanged();
            _ = SaveFullSessionAsync();
        }
    }

    public void OpenProfileHub()
    {
        ActiveProfileSection = "dashboard";
        SetActiveView("profile");
    }

    public void OpenArchives()
    {
        SetActiveView("archives");
    }

    public void OpenArchiveDetail(int day)
    {
        SelectedArchiveDay = Math.Max(day, 1);
        SetActiveView("archive_detail");
    }

    public bool IsDayFavorited(int day) => FavoriteArchiveDays.Contains(day);

    public void ToggleFavoriteDay(int day)
    {
        if (FavoriteArchiveDays.Contains(day))
        {
            FavoriteArchiveDays.Remove(day);
        }
        else
        {
            FavoriteArchiveDays.Add(day);
        }
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void Login(string username, bool isReturning = false)
    {
        _ = LoginAsync(username, isReturning);
    }

    public async Task LoginAsync(string username, bool isReturning = false)
    {
        if (!string.IsNullOrWhiteSpace(username))
        {
            Username = username;
        }
        IsLoggedIn = true;
        WelcomeMessageType = isReturning ? "returning" : "new";
        ActiveProfileSection = "dashboard";

        if (Username.Equals("Guest User", StringComparison.OrdinalIgnoreCase) && _localStorage != null)
        {
            var guestTime = await _localStorage.GetItemAsync<int?>("nobs_guest_website_time_seconds");
            WebsiteTimeSeconds = guestTime ?? 0;
        }

        NotifyStateChanged();
        await SaveFullSessionAsync();
    }

    public void LoadUserAccount(UserAccount account)
    {
        _ = LoadUserAccountAsync(account);
    }

    public async Task LoadUserAccountAsync(UserAccount account)
    {
        if (account == null) return;
        _accountService?.SetActiveAccount(account);
        Username = account.Username;
        UserRole = !string.IsNullOrWhiteSpace(account.Role) ? account.Role : "Science Optimizer";
        AvatarUrl = account.AvatarUrl;
        WebsiteTimeSeconds = account.WebsiteTimeSeconds;
        ActiveProfileSection = "dashboard";
        if (!string.IsNullOrWhiteSpace(account.CurrentGoal)) CurrentGoal = account.CurrentGoal;
        if (!string.IsNullOrWhiteSpace(account.AddictionLevel)) AddictionLevel = account.AddictionLevel;
        AddictionScore = account.AddictionScore;
        InitialHabitMotivation = account.InitialHabitMotivation ?? "";
        DailyMoodLogs = account.DailyMoodLogs != null ? new List<DailyMoodEntry>(account.DailyMoodLogs) : new List<DailyMoodEntry>();
        RelapseLogs = account.RelapseLogs != null ? new List<RelapseEntry>(account.RelapseLogs) : new List<RelapseEntry>();
        UrgesSurfedCount = account.UrgesSurfedCount;
        FavoriteArchiveDays = account.FavoriteArchiveDays != null ? new List<int>(account.FavoriteArchiveDays) : new List<int>();
        IsDarkMode = account.IsDarkMode;
        SoundVolume = account.SoundVolume;
        SleepNotificationsEnabled = account.SleepNotificationsEnabled;
        IsLoggedIn = true;
        SyncThemeToDom();
        OnUserLoaded?.Invoke(account);
        NotifyStateChanged();
        await SaveFullSessionAsync();
    }

    public void Logout()
    {
        _ = LogoutAsync();
    }

    public async Task LogoutAsync()
    {
        if (_accountService?.ActiveAccount != null)
        {
            _accountService.ActiveAccount.WebsiteTimeSeconds = WebsiteTimeSeconds;
            await _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
        _accountService?.SetActiveAccount(null);
        IsLoggedIn = false;
        Username = "Guest User";
        ActiveView = "landing";
        ActiveProfileSection = "dashboard";
        InitialHabitMotivation = "";
        DailyMoodLogs = new List<DailyMoodEntry>();
        RelapseLogs = new List<RelapseEntry>();
        UrgesSurfedCount = 0;
        FavoriteArchiveDays = new List<int>();

        if (_localStorage != null)
        {
            var guestTime = await _localStorage.GetItemAsync<int?>("nobs_guest_website_time_seconds");
            WebsiteTimeSeconds = guestTime ?? 0;
        }
        else
        {
            WebsiteTimeSeconds = 0;
        }

        OnUserLoggedOut?.Invoke();
        SyncThemeToDom();
        NotifyStateChanged();
        await SaveFullSessionAsync();
    }

    public async Task<bool> DeleteCurrentAccountAsync()
    {
        if (_accountService == null || !IsLoggedIn || string.IsNullOrWhiteSpace(Username) || Username.Equals("Guest User", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var uname = Username;
        var success = await _accountService.DeleteAccountAsync(uname);
        if (success)
        {
            _accountService.SetActiveAccount(null);
            IsLoggedIn = false;
            Username = "Guest User";
            ActiveView = "landing";
            ActiveProfileSection = "dashboard";
            OnUserLoggedOut?.Invoke();
            SyncThemeToDom();
            NotifyStateChanged();
            await SaveFullSessionAsync();
        }
        return success;
    }

    private static readonly string[] ProtectedViews = new[]
    {
        "list", "recommended", "profile", "about", "archives", "archive_detail"
    };

    public void SetActiveView(string view, bool fromBrowser = false)
    {
        _ = SetActiveViewAsync(view, fromBrowser);
    }

    public async Task SetActiveViewAsync(string view, bool fromBrowser = false)
    {
        if (string.IsNullOrWhiteSpace(view)) return;

        // Logged-Off Security Guard: Prevent unauthenticated access to private views
        if (!IsLoggedIn && Array.Exists(ProtectedViews, v => v.Equals(view, StringComparison.OrdinalIgnoreCase)))
        {
            view = "landing";
        }

        ActiveView = view;
        NotifyStateChanged();
        await SaveFullSessionAsync();
        
        if (!fromBrowser && _jsRuntime != null)
        {
            try
            {
                await _jsRuntime.InvokeVoidAsync("nobsHistory.pushState", view);
            }
            catch
            {
                // Silently handle JS interop pre-render exceptions
            }
        }
    }

    [JSInvokable]
    public void OnBrowserNavigate(string view)
    {
        if (!string.IsNullOrWhiteSpace(view))
        {
            SetActiveView(view, fromBrowser: true);
        }
    }

    public void ToggleDarkMode()
    {
        IsDarkMode = !IsDarkMode;
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
        SyncThemeToDom();
    }

    public void SyncThemeToDom()
    {
        if (_jsRuntime != null)
        {
            try
            {
                var mode = IsDarkMode ? "dark" : "light";
                _ = _jsRuntime.InvokeVoidAsync("eval", $"document.documentElement.setAttribute('data-theme', '{mode}'); document.body.setAttribute('data-theme', '{mode}');");
            }
            catch
            {
                // Handle JS interop pre-render exceptions
            }
        }
    }

    public void SetSleepNotifications(bool enabled)
    {
        SleepNotificationsEnabled = enabled;
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void SetSoundVolume(int volume)
    {
        SoundVolume = Math.Clamp(volume, 0, 100);
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void SetUsername(string name)
    {
        if (!string.IsNullOrWhiteSpace(name))
        {
            Username = name;
            SyncActiveAccount();
            NotifyStateChanged();
            _ = SaveFullSessionAsync();
        }
    }

    public async Task<bool> UpdateUsernameAsync(string newUsername)
    {
        if (string.IsNullOrWhiteSpace(newUsername)) return false;
        newUsername = newUsername.Trim();
        if (newUsername.Equals(Username, StringComparison.OrdinalIgnoreCase)) return true;

        if (Username.Equals("Guest User", StringComparison.OrdinalIgnoreCase))
        {
            Username = newUsername;
            NotifyStateChanged();
            await SaveFullSessionAsync();
            return true;
        }

        if (_accountService != null)
        {
            var success = await _accountService.UpdateUsernameAsync(Username, newUsername);
            if (!success) return false;
        }

        Username = newUsername;
        NotifyStateChanged();
        await SaveFullSessionAsync();
        return true;
    }

    public void SetUserRole(string role)
    {
        if (!string.IsNullOrWhiteSpace(role))
        {
            UserRole = role.Trim();
            SyncActiveAccount();
            NotifyStateChanged();
            _ = SaveFullSessionAsync();
        }
    }

    public void SetAvatarUrl(string? avatarUrl)
    {
        AvatarUrl = avatarUrl;
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void SetCurrentGoal(string goal)
    {
        if (!string.IsNullOrWhiteSpace(goal))
        {
            CurrentGoal = goal.ToLower();
            SyncActiveAccount();
            NotifyStateChanged();
            _ = SaveFullSessionAsync();
        }
    }

    public void SetAddictionLevel(string level, int score)
    {
        AddictionLevel = level;
        AddictionScore = score;
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void SetInitialHabitMotivation(string motivation)
    {
        InitialHabitMotivation = motivation ?? "";
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void SetDailyMoodLogs(List<DailyMoodEntry> logs)
    {
        DailyMoodLogs = logs != null ? new List<DailyMoodEntry>(logs) : new();
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void AddDailyMoodLog(DailyMoodEntry entry)
    {
        if (entry == null) return;
        DailyMoodLogs.RemoveAll(l => l.Date.Date == entry.Date.Date);
        DailyMoodLogs.Add(entry);
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void SetRelapseLogs(List<RelapseEntry> logs)
    {
        RelapseLogs = logs != null ? new List<RelapseEntry>(logs) : new();
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void AddRelapseLog(RelapseEntry entry)
    {
        if (entry == null) return;
        RelapseLogs.Insert(0, entry);
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void SetUrgesSurfedCount(int count)
    {
        UrgesSurfedCount = Math.Max(0, count);
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    public void IncrementUrgesSurfed()
    {
        UrgesSurfedCount++;
        SyncActiveAccount();
        NotifyStateChanged();
        _ = SaveFullSessionAsync();
    }

    private void SyncActiveAccount()
    {
        if (_accountService?.ActiveAccount != null)
        {
            _accountService.ActiveAccount.CurrentGoal = CurrentGoal;
            _accountService.ActiveAccount.AddictionLevel = AddictionLevel;
            _accountService.ActiveAccount.AddictionScore = AddictionScore;
            _accountService.ActiveAccount.InitialHabitMotivation = InitialHabitMotivation;
            _accountService.ActiveAccount.DailyMoodLogs = DailyMoodLogs;
            _accountService.ActiveAccount.RelapseLogs = RelapseLogs;
            _accountService.ActiveAccount.UrgesSurfedCount = UrgesSurfedCount;
            _accountService.ActiveAccount.FavoriteArchiveDays = FavoriteArchiveDays;
            _accountService.ActiveAccount.IsDarkMode = IsDarkMode;
            _accountService.ActiveAccount.SoundVolume = SoundVolume;
            _accountService.ActiveAccount.SleepNotificationsEnabled = SleepNotificationsEnabled;
            _accountService.ActiveAccount.WebsiteTimeSeconds = WebsiteTimeSeconds;
            _accountService.ActiveAccount.Role = UserRole;
            _accountService.ActiveAccount.AvatarUrl = AvatarUrl;
            _ = _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
    }

    private async Task SaveFullSessionAsync()
    {
        if (_accountService?.ActiveAccount != null)
        {
            _accountService.ActiveAccount.WebsiteTimeSeconds = WebsiteTimeSeconds;
            _ = _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
        else if (_localStorage != null)
        {
            try
            {
                await _localStorage.SetItemAsync("nobs_guest_website_time_seconds", WebsiteTimeSeconds);
            }
            catch { }
        }

        if (_localStorage != null)
        {
            try
            {
                await _localStorage.SetItemAsync("nobs_is_logged_in", IsLoggedIn);
                await _localStorage.SetItemAsync("nobs_username", Username);
                await _localStorage.SetItemAsync("nobs_active_view", ActiveView);
                await _localStorage.SetItemAsync("nobs_current_goal", CurrentGoal);
                await _localStorage.SetItemAsync("nobs_sound_volume", SoundVolume);
                await _localStorage.SetItemAsync("nobs_is_dark_mode", IsDarkMode);
                await _localStorage.SetItemAsync("nobs_addiction_level", AddictionLevel);
                await _localStorage.SetItemAsync("nobs_addiction_score", AddictionScore);
                await _localStorage.SetItemAsync("nobs_initial_habit_motivation", InitialHabitMotivation);
                await _localStorage.SetItemAsync("nobs_daily_mood_logs", DailyMoodLogs);
                await _localStorage.SetItemAsync("nobs_relapse_logs", RelapseLogs);
                await _localStorage.SetItemAsync("nobs_urges_surfed_count", UrgesSurfedCount);
                await _localStorage.SetItemAsync("nobs_favorite_archive_days", FavoriteArchiveDays);
                await _localStorage.SetItemAsync("nobs_website_time_seconds", WebsiteTimeSeconds);
                await _localStorage.SetItemAsync("nobs_profile_section", ActiveProfileSection);
                await _localStorage.SetItemAsync("nobs_user_role", UserRole);
                if (!string.IsNullOrEmpty(AvatarUrl))
                {
                    await _localStorage.SetItemAsync("nobs_avatar_url", AvatarUrl);
                }
                else
                {
                    await _localStorage.RemoveItemAsync("nobs_avatar_url");
                }
            }
            catch
            {
                // Silently handle pre-rendering exceptions
            }
        }
    }

    public bool IsSessionLoaded { get; private set; } = false;

    public async Task LoadFromLocalStorageAsync()
    {
        if (_localStorage != null)
        {
            try
            {
                var isLoggedIn = await _localStorage.GetItemAsync<bool?>("nobs_is_logged_in");
                var username = await _localStorage.GetItemAsync<string>("nobs_username");
                var view = await _localStorage.GetItemAsync<string>("nobs_active_view");
                var goal = await _localStorage.GetItemAsync<string>("nobs_current_goal");
                var vol = await _localStorage.GetItemAsync<int?>("nobs_sound_volume");
                var dark = await _localStorage.GetItemAsync<bool?>("nobs_is_dark_mode");
                var level = await _localStorage.GetItemAsync<string>("nobs_addiction_level");
                var score = await _localStorage.GetItemAsync<int?>("nobs_addiction_score");
                var profSec = await _localStorage.GetItemAsync<string>("nobs_profile_section");
                var savedRole = await _localStorage.GetItemAsync<string>("nobs_user_role");
                var savedAvatar = await _localStorage.GetItemAsync<string>("nobs_avatar_url");

                if (isLoggedIn.HasValue) IsLoggedIn = isLoggedIn.Value;
                if (!string.IsNullOrEmpty(username)) Username = username;
                if (!string.IsNullOrEmpty(goal)) CurrentGoal = goal;
                if (vol.HasValue) SoundVolume = vol.Value;
                if (dark.HasValue) IsDarkMode = dark.Value;
                if (!string.IsNullOrEmpty(level)) AddictionLevel = level;
                if (score.HasValue) AddictionScore = score.Value;
                if (!string.IsNullOrEmpty(profSec)) ActiveProfileSection = profSec;
                if (!string.IsNullOrEmpty(savedRole)) UserRole = savedRole;
                if (!string.IsNullOrEmpty(savedAvatar)) AvatarUrl = savedAvatar;

                if (IsLoggedIn && !string.IsNullOrWhiteSpace(Username) && !Username.Equals("Guest User", StringComparison.OrdinalIgnoreCase) && _accountService != null)
                {
                    var account = await _accountService.GetAccountByUsernameAsync(Username);
                    if (account != null)
                    {
                        _accountService.SetActiveAccount(account);
                        WebsiteTimeSeconds = account.WebsiteTimeSeconds;
                        UserRole = !string.IsNullOrWhiteSpace(account.Role) ? account.Role : "Science Optimizer";
                        AvatarUrl = account.AvatarUrl;
                        if (!string.IsNullOrWhiteSpace(account.CurrentGoal)) CurrentGoal = account.CurrentGoal;
                        if (!string.IsNullOrWhiteSpace(account.AddictionLevel)) AddictionLevel = account.AddictionLevel;
                        AddictionScore = account.AddictionScore;
                        InitialHabitMotivation = account.InitialHabitMotivation ?? "";
                        DailyMoodLogs = account.DailyMoodLogs != null ? new List<DailyMoodEntry>(account.DailyMoodLogs) : new List<DailyMoodEntry>();
                        RelapseLogs = account.RelapseLogs != null ? new List<RelapseEntry>(account.RelapseLogs) : new List<RelapseEntry>();
                        UrgesSurfedCount = account.UrgesSurfedCount;
                        FavoriteArchiveDays = account.FavoriteArchiveDays != null ? new List<int>(account.FavoriteArchiveDays) : new List<int>();
                        IsDarkMode = account.IsDarkMode;
                        SoundVolume = account.SoundVolume;
                        SleepNotificationsEnabled = account.SleepNotificationsEnabled;
                        OnUserLoaded?.Invoke(account);
                    }
                }
                else
                {
                    var guestTime = await _localStorage.GetItemAsync<int?>("nobs_guest_website_time_seconds");
                    if (guestTime.HasValue)
                    {
                        WebsiteTimeSeconds = guestTime.Value;
                    }
                    var savedMotivation = await _localStorage.GetItemAsync<string>("nobs_initial_habit_motivation");
                    var savedMoodLogs = await _localStorage.GetItemAsync<List<DailyMoodEntry>>("nobs_daily_mood_logs");
                    var savedRelapseLogs = await _localStorage.GetItemAsync<List<RelapseEntry>>("nobs_relapse_logs");
                    var savedUrges = await _localStorage.GetItemAsync<int?>("nobs_urges_surfed_count");
                    var savedFavs = await _localStorage.GetItemAsync<List<int>>("nobs_favorite_archive_days");
                    if (!string.IsNullOrEmpty(savedMotivation)) InitialHabitMotivation = savedMotivation;
                    if (savedMoodLogs != null) DailyMoodLogs = savedMoodLogs;
                    if (savedRelapseLogs != null) RelapseLogs = savedRelapseLogs;
                    if (savedUrges.HasValue) UrgesSurfedCount = savedUrges.Value;
                    if (savedFavs != null) FavoriteArchiveDays = savedFavs;
                }

                // Restore active view from local storage if saved, otherwise default to landing page
                if (!string.IsNullOrEmpty(view))
                {
                    ActiveView = view;
                }
                else
                {
                    ActiveView = "landing";
                }
            }
            catch
            {
                // Silently handle pre-rendering or WebAssembly JSInterop initialization issues
            }
            finally
            {
                IsSessionLoaded = true;
                SyncThemeToDom();
                NotifyStateChanged();
            }
        }
    }

    private void NotifyStateChanged()
    {
        if (_disposed) return;
        try
        {
            OnChange?.Invoke();
        }
        catch
        {
            // A disposing component must not terminate the circuit
        }
    }

    public void Dispose()
    {
        if (_disposed) return;
        _disposed = true;
        _timer?.Dispose();
        _timer = null;
        OnChange = null;
        OnTick = null;
    }
}
