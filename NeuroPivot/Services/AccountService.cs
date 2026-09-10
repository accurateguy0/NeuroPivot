using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading;
using System.Threading.Tasks;

namespace NeuroPivot.Services;

public class UserAccount
{
    public string Username { get; set; } = "";
    public string Password { get; set; } = "";
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Habits & 21-Day Challenge Data
    public List<HabitItem> Habits { get; set; } = new();
    public int CurrentActiveDay { get; set; } = 1;
    public bool IsDayLocked { get; set; } = false;
    public bool ChallengeComplete { get; set; } = false;
    public DateTime ChallengeStartDate { get; set; } = DateTime.Today;
    public DateTime LastActiveDate { get; set; } = DateTime.Today;
    public int ConsecutiveStreak { get; set; } = 0;
    public DateTime? LastStreakQualifyDate { get; set; } = null;
    public int AcknowledgedStreakMilestone { get; set; } = 0;

    // Goals & Diagnostics
    public string CurrentGoal { get; set; } = "habits";
    public string AddictionLevel { get; set; } = "average";
    public int AddictionScore { get; set; } = 0;

    // User Preferences & Session
    public bool IsDarkMode { get; set; } = true;
    public int SoundVolume { get; set; } = 80;
    public bool SleepNotificationsEnabled { get; set; } = true;
    public int WebsiteTimeSeconds { get; set; } = 0;
    public string Role { get; set; } = "Science Optimizer";
    public string? AvatarUrl { get; set; } = null;

    // Sleep & Alarm Settings
    public string IdealBedTime { get; set; } = "21:00";
    public string IdealWakeTime { get; set; } = "06:00";
    public string CalculatedElectronicsCutoff { get; set; } = "20:00";
    public string CalculatedWakeupTime { get; set; } = "06:00";
    public bool CutoffAlertEnabled { get; set; } = true;
    public bool WakeAlertEnabled { get; set; } = true;
    public string WakeAlarmSound { get; set; } = "gentle_chime";
    public string CutoffAlertSound { get; set; } = "soft_pulse";
    public string? CustomWakeAlarmDataUrl { get; set; }
    public string? CustomWakeAlarmFileName { get; set; }
    public string? CustomCutoffAlertDataUrl { get; set; }
    public string? CustomCutoffAlertFileName { get; set; }
    public string? LastCutoffAlertDate { get; set; }
    public string? LastWakeAlarmDate { get; set; }
}

public class AuthResult
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public UserAccount? Account { get; set; }
}

public class AccountService
{
    private const string AccountsStorageKey = "nobs_accounts";
    private static readonly SemaphoreSlim _fileLock = new(1, 1);
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        WriteIndented = true,
        IncludeFields = true
    };

    private static readonly string ServerDataFolder = Path.Combine(AppContext.BaseDirectory, "App_Data");
    private static readonly string ServerAccountsFilePath = Path.Combine(ServerDataFolder, "accounts.json");

    private readonly LocalStorageService _localStorage;

    public UserAccount? ActiveAccount { get; private set; }

    public AccountService(LocalStorageService localStorage)
    {
        _localStorage = localStorage;
    }

    public static UserAccount CreateDefaultAdminAccount()
    {
        var h1 = new HabitItem { Name = "wake up at 6am", Description = "Wake up at 6:00 AM to align circadian cortisol pulse", Category = "Sleep" };
        h1.SetCompletedOnDay(1, true);
        h1.SetCompletedOnDay(2, true);
        h1.SetCompletedOnDay(3, true);

        var h2 = new HabitItem { Name = "exercise", Description = "Daily physical exertion and muscular recruitment", Category = "Focus" };
        h2.SetCompletedOnDay(1, true);
        h2.SetCompletedOnDay(2, true);
        h2.SetCompletedOnDay(3, true);

        var h3 = new HabitItem { Name = "walk", Description = "Outdoor panoramic optical flow and movement", Category = "Energy" };
        h3.SetCompletedOnDay(1, true);
        h3.SetCompletedOnDay(2, true);
        h3.SetCompletedOnDay(3, true);

        var h4 = new HabitItem { Name = "eat protein", Description = "High-quality morning protein to anchor amino acid pool", Category = "Nutrition" };
        h4.SetCompletedOnDay(1, true);
        h4.SetCompletedOnDay(2, true);
        h4.SetCompletedOnDay(3, true);

        var h5 = new HabitItem { Name = "meditation", Description = "10 minutes open-monitoring attentional training", Category = "Focus" };
        h5.SetCompletedOnDay(1, true);
        h5.SetCompletedOnDay(2, true);
        h5.SetCompletedOnDay(3, true);

        var h6 = new HabitItem { Name = "no electronics 1h", Description = "No screens 1 hour before sleep to protect melatonin", Category = "Sleep" };
        h6.SetCompletedOnDay(1, true);
        h6.SetCompletedOnDay(2, true);
        h6.SetCompletedOnDay(3, true);

        return new UserAccount
        {
            Username = "admin",
            Password = "admin",
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            CurrentGoal = "habits",
            CurrentActiveDay = 3,
            IsDayLocked = false,
            ChallengeComplete = false,
            ChallengeStartDate = DateTime.Today.AddDays(-2),
            LastActiveDate = DateTime.Today,
            ConsecutiveStreak = 3,
            LastStreakQualifyDate = DateTime.Today,
            AcknowledgedStreakMilestone = 0,
            Habits = new List<HabitItem> { h1, h2, h3, h4, h5, h6 },
            IsDarkMode = true,
            SoundVolume = 80,
            SleepNotificationsEnabled = true,
            IdealBedTime = "21:00",
            IdealWakeTime = "06:00",
            CalculatedElectronicsCutoff = "20:00",
            CalculatedWakeupTime = "06:00",
            CutoffAlertEnabled = true,
            WakeAlertEnabled = true,
            WakeAlarmSound = "gentle_chime",
            CutoffAlertSound = "soft_pulse",
            Role = "Science Optimizer"
        };
    }

    private async Task<List<UserAccount>> ReadServerAccountsAsync()
    {
        await _fileLock.WaitAsync();
        try
        {
            if (!Directory.Exists(ServerDataFolder))
            {
                Directory.CreateDirectory(ServerDataFolder);
            }

            if (!File.Exists(ServerAccountsFilePath))
            {
                var initial = new List<UserAccount> { CreateDefaultAdminAccount() };
                var json = JsonSerializer.Serialize(initial, JsonOptions);
                await File.WriteAllTextAsync(ServerAccountsFilePath, json);
                return initial;
            }

            var text = await File.ReadAllTextAsync(ServerAccountsFilePath);
            if (string.IsNullOrWhiteSpace(text))
            {
                var initial = new List<UserAccount> { CreateDefaultAdminAccount() };
                var json = JsonSerializer.Serialize(initial, JsonOptions);
                await File.WriteAllTextAsync(ServerAccountsFilePath, json);
                return initial;
            }

            var list = JsonSerializer.Deserialize<List<UserAccount>>(text, JsonOptions);
            if (list == null || list.Count == 0)
            {
                list = new List<UserAccount> { CreateDefaultAdminAccount() };
            }
            else if (!list.Any(a => a.Username.Equals("admin", StringComparison.OrdinalIgnoreCase)))
            {
                list.Add(CreateDefaultAdminAccount());
            }

            return list;
        }
        catch
        {
            return new List<UserAccount> { CreateDefaultAdminAccount() };
        }
        finally
        {
            _fileLock.Release();
        }
    }

    private async Task WriteServerAccountsAsync(List<UserAccount> accounts)
    {
        await _fileLock.WaitAsync();
        try
        {
            if (!Directory.Exists(ServerDataFolder))
            {
                Directory.CreateDirectory(ServerDataFolder);
            }

            var json = JsonSerializer.Serialize(accounts, JsonOptions);
            await File.WriteAllTextAsync(ServerAccountsFilePath, json);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Server storage error: {ex.Message}");
        }
        finally
        {
            _fileLock.Release();
        }
    }

    public async Task<List<UserAccount>> GetAllAccountsAsync()
    {
        // 1. Read Master Accounts from Server Disk
        var serverAccounts = await ReadServerAccountsAsync();

        // 2. Read from Browser LocalStorage (Cache)
        List<UserAccount>? clientAccounts = null;
        try
        {
            clientAccounts = await _localStorage.GetItemAsync<List<UserAccount>>(AccountsStorageKey);
        }
        catch { }

        // 3. Hybrid Sync & Merge
        var merged = new Dictionary<string, UserAccount>(StringComparer.OrdinalIgnoreCase);

        // Put server accounts in dictionary first
        foreach (var sa in serverAccounts)
        {
            if (!string.IsNullOrWhiteSpace(sa.Username))
                merged[sa.Username] = sa;
        }

        // Merge any client accounts
        if (clientAccounts != null && clientAccounts.Count > 0)
        {
            foreach (var ca in clientAccounts)
            {
                if (string.IsNullOrWhiteSpace(ca.Username)) continue;
                if (!merged.TryGetValue(ca.Username, out var existing))
                {
                    merged[ca.Username] = ca;
                }
                else
                {
                    // If client account has higher active day or more recent activity, prefer client state
                    if (ca.CurrentActiveDay > existing.CurrentActiveDay || ca.LastActiveDate > existing.LastActiveDate)
                    {
                        merged[ca.Username] = ca;
                    }
                }
            }
        }

        if (!merged.ContainsKey("admin"))
        {
            merged["admin"] = CreateDefaultAdminAccount();
        }
        else if (merged.TryGetValue("admin", out var adminAcct) && adminAcct.ConsecutiveStreak == 21)
        {
            adminAcct.ConsecutiveStreak = 7;
            adminAcct.AcknowledgedStreakMilestone = 7;
        }

        var result = merged.Values.ToList();

        // 4. Save synced result to both Server Disk and Browser Cache
        await WriteServerAccountsAsync(result);
        try
        {
            await _localStorage.SetItemAsync(AccountsStorageKey, result);
        }
        catch { }

        return result;
    }

    public async Task<UserAccount?> GetAccountByUsernameAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username)) return null;
        var accounts = await GetAllAccountsAsync();
        return accounts.FirstOrDefault(a => a.Username.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase));
    }

    public async Task<AuthResult> SignUpAsync(string username, string password)
    {
        username = username?.Trim() ?? "";
        password = password ?? "";

        if (string.IsNullOrWhiteSpace(username))
        {
            return new AuthResult { Success = false, ErrorMessage = "Please enter a username." };
        }

        if (string.IsNullOrWhiteSpace(password))
        {
            return new AuthResult { Success = false, ErrorMessage = "Please enter a password." };
        }

        if (username.Equals("Guest User", StringComparison.OrdinalIgnoreCase) || username.Equals("Guest", StringComparison.OrdinalIgnoreCase))
        {
            return new AuthResult { Success = false, ErrorMessage = "This username is reserved. Please choose another username." };
        }

        var accounts = await GetAllAccountsAsync();
        var existing = accounts.FirstOrDefault(a => a.Username.Equals(username, StringComparison.OrdinalIgnoreCase));
        if (existing != null)
        {
            return new AuthResult { Success = false, ErrorMessage = "An account with this username already exists. Please sign in." };
        }

        var newAccount = new UserAccount
        {
            Username = username,
            Password = password,
            CreatedAt = DateTime.UtcNow,
            CurrentGoal = "habits",
            CurrentActiveDay = 1,
            IsDayLocked = false,
            ChallengeComplete = false,
            ChallengeStartDate = DateTime.Today,
            LastActiveDate = DateTime.Today,
            Habits = new List<HabitItem>(),
            IsDarkMode = true,
            SoundVolume = 80,
            SleepNotificationsEnabled = true,
            WebsiteTimeSeconds = 0
        };

        accounts.Add(newAccount);
        await WriteServerAccountsAsync(accounts);
        await _localStorage.SetItemAsync(AccountsStorageKey, accounts);
        ActiveAccount = newAccount;

        return new AuthResult { Success = true, Account = newAccount };
    }

    public async Task<AuthResult> SignInAsync(string username, string password)
    {
        username = username?.Trim() ?? "";
        password = password ?? "";

        if (string.IsNullOrWhiteSpace(username))
        {
            return new AuthResult { Success = false, ErrorMessage = "Please enter your username." };
        }

        if (string.IsNullOrWhiteSpace(password))
        {
            return new AuthResult { Success = false, ErrorMessage = "Please enter your password." };
        }

        var accounts = await GetAllAccountsAsync();
        var account = accounts.FirstOrDefault(a => a.Username.Equals(username, StringComparison.OrdinalIgnoreCase));

        if (account == null)
        {
            return new AuthResult { Success = false, ErrorMessage = "Account does not exist. Please check your username or sign up." };
        }

        if (account.Password != password)
        {
            return new AuthResult { Success = false, ErrorMessage = "Incorrect password. Please try again." };
        }

        ActiveAccount = account;
        return new AuthResult { Success = true, Account = account };
    }

    public void SetActiveAccount(UserAccount? account)
    {
        ActiveAccount = account;
    }

    public async Task SaveAccountAsync(UserAccount account)
    {
        if (account == null || string.IsNullOrWhiteSpace(account.Username)) return;

        var accounts = await GetAllAccountsAsync();
        var index = accounts.FindIndex(a => a.Username.Equals(account.Username, StringComparison.OrdinalIgnoreCase));
        if (index >= 0)
        {
            accounts[index] = account;
        }
        else
        {
            accounts.Add(account);
        }

        await WriteServerAccountsAsync(accounts);
        await _localStorage.SetItemAsync(AccountsStorageKey, accounts);

        if (ActiveAccount != null && ActiveAccount.Username.Equals(account.Username, StringComparison.OrdinalIgnoreCase))
        {
            ActiveAccount = account;
        }
    }

    public async Task<bool> UpdatePasswordAsync(string username, string newPassword)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(newPassword)) return false;

        var accounts = await GetAllAccountsAsync();
        var account = accounts.FirstOrDefault(a => a.Username.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase));
        if (account == null) return false;

        account.Password = newPassword;
        await WriteServerAccountsAsync(accounts);
        await _localStorage.SetItemAsync(AccountsStorageKey, accounts);
        if (ActiveAccount != null && ActiveAccount.Username.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            ActiveAccount.Password = newPassword;
        }
        return true;
    }

    public async Task<bool> UpdateUsernameAsync(string oldUsername, string newUsername)
    {
        if (string.IsNullOrWhiteSpace(oldUsername) || string.IsNullOrWhiteSpace(newUsername)) return false;
        newUsername = newUsername.Trim();
        if (oldUsername.Equals(newUsername, StringComparison.OrdinalIgnoreCase)) return true;

        if (newUsername.Equals("Guest User", StringComparison.OrdinalIgnoreCase) || newUsername.Equals("Guest", StringComparison.OrdinalIgnoreCase))
        {
            return false;
        }

        var accounts = await GetAllAccountsAsync();
        if (accounts.Any(a => a.Username.Equals(newUsername, StringComparison.OrdinalIgnoreCase)))
        {
            return false; // Taken
        }

        var account = accounts.FirstOrDefault(a => a.Username.Equals(oldUsername.Trim(), StringComparison.OrdinalIgnoreCase));
        if (account == null) return false;

        account.Username = newUsername;
        await WriteServerAccountsAsync(accounts);
        await _localStorage.SetItemAsync(AccountsStorageKey, accounts);
        if (ActiveAccount != null && ActiveAccount.Username.Equals(oldUsername.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            ActiveAccount.Username = newUsername;
        }
        return true;
    }

    public async Task<bool> DeleteAccountAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username)) return false;
        if (username.Equals("Guest User", StringComparison.OrdinalIgnoreCase) || username.Equals("Guest", StringComparison.OrdinalIgnoreCase)) return false;

        var accounts = await GetAllAccountsAsync();
        var toRemove = accounts.FirstOrDefault(a => a.Username.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase));
        if (toRemove == null) return false;

        accounts.Remove(toRemove);
        await WriteServerAccountsAsync(accounts);
        await _localStorage.SetItemAsync(AccountsStorageKey, accounts);

        if (ActiveAccount != null && ActiveAccount.Username.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            ActiveAccount = null;
        }

        return true;
    }
}
