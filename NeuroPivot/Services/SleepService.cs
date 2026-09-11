using System;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace NeuroPivot.Services;

public class SleepQuestionnaireModel
{
    public string IdealBedTime { get; set; } = "21:00"; // 9:00 PM default
    public string IdealWakeTime { get; set; } = "06:00"; // 6:00 AM default
    public string WellRestedFeeling { get; set; } = "groggy";
}

public class SleepService : IDisposable
{
    private readonly LocalStorageService _localStorage;
    private readonly IJSRuntime _jsRuntime;
    private readonly AppState _appState;
    private readonly AccountService _accountService;

    public event Action? OnChange;

    public SleepQuestionnaireModel Model { get; private set; } = new();
    public bool QuestionnaireCompleted { get; private set; } = false;

    public string CalculatedElectronicsCutoff { get; private set; } = "20:00"; // 8:00 PM default
    public string CalculatedWakeupTime { get; private set; } = "06:00"; // 6:00 AM default

    public bool CutoffAlertEnabled { get; set; } = true;
    public bool WakeAlertEnabled { get; set; } = true;

    public string WakeAlarmSound { get; set; } = "gentle_chime";
    public string CutoffAlertSound { get; set; } = "soft_pulse";

    public string? CustomWakeAlarmDataUrl { get; private set; }
    public string? CustomWakeAlarmFileName { get; private set; }
    public string? CustomCutoffAlertDataUrl { get; private set; }
    public string? CustomCutoffAlertFileName { get; private set; }

    // In-App Alert Modal state
    public bool IsAlertModalOpen { get; private set; } = false;
    public string ActiveAlertTitle { get; private set; } = "";
    public string ActiveAlertMessage { get; private set; } = "";
    public string ActiveAlertIcon { get; private set; } = "🔔";
    public string ActiveAlertTimeDisplay { get; private set; } = "06:00 AM";
    public string ActiveAlertType { get; private set; } = "wake"; // "wake" or "cutoff"

    // Snooze state
    public bool IsSnoozed { get; private set; } = false;
    public int SnoozeRemainingSeconds { get; private set; } = 0;

    public string? LastCutoffAlertDate { get; private set; }
    public string? LastWakeAlarmDate { get; private set; }

    private System.Threading.CancellationTokenSource? _alarmLoopCts;
    private System.Threading.CancellationTokenSource? _snoozeCts;
    private bool _disposed;

    public bool ShouldAllowSleepAlerts =>
        !_disposed &&
        _appState.IsLoggedIn &&
        _accountService.ActiveAccount != null &&
        !_appState.Username.Equals("Guest User", StringComparison.OrdinalIgnoreCase) &&
        QuestionnaireCompleted &&
        _appState.CurrentGoal.Equals("sleep", StringComparison.OrdinalIgnoreCase) &&
        _appState.ActiveView != "landing" &&
        _appState.ActiveView != "authentication" &&
        _appState.ActiveView != "authentification" &&
        _appState.ActiveView != "welcome_transition";

    public SleepService(LocalStorageService localStorage, IJSRuntime jsRuntime, AppState appState, AccountService accountService)
    {
        _localStorage = localStorage;
        _jsRuntime = jsRuntime;
        _appState = appState;
        _accountService = accountService;

        _appState.OnUserLoaded += LoadUserAccount;
        _appState.OnUserLoggedOut += Reset;
        _appState.OnChange += OnAppStateChanged;
        _appState.OnTick += HandleTick;

        if (_accountService.ActiveAccount != null)
        {
            LoadUserAccount(_accountService.ActiveAccount);
        }
    }

    private void OnAppStateChanged()
    {
        if (!ShouldAllowSleepAlerts)
        {
            if (IsAlertModalOpen || IsSnoozed || _alarmLoopCts != null || _snoozeCts != null)
            {
                TurnOffAlert();
            }
        }
    }

    public void LoadUserAccount(UserAccount account)
    {
        if (account == null) return;
        Model.IdealBedTime = !string.IsNullOrWhiteSpace(account.IdealBedTime) ? account.IdealBedTime : "21:00";
        Model.IdealWakeTime = !string.IsNullOrWhiteSpace(account.IdealWakeTime) ? account.IdealWakeTime : "06:00";
        CalculatedElectronicsCutoff = !string.IsNullOrWhiteSpace(account.CalculatedElectronicsCutoff) ? account.CalculatedElectronicsCutoff : "20:00";
        CalculatedWakeupTime = !string.IsNullOrWhiteSpace(account.CalculatedWakeupTime) ? account.CalculatedWakeupTime : "06:00";
        CutoffAlertEnabled = account.CutoffAlertEnabled;
        WakeAlertEnabled = account.WakeAlertEnabled;
        WakeAlarmSound = !string.IsNullOrWhiteSpace(account.WakeAlarmSound) ? account.WakeAlarmSound : "gentle_chime";
        CutoffAlertSound = !string.IsNullOrWhiteSpace(account.CutoffAlertSound) ? account.CutoffAlertSound : "soft_pulse";
        CustomWakeAlarmDataUrl = account.CustomWakeAlarmDataUrl;
        CustomWakeAlarmFileName = account.CustomWakeAlarmFileName;
        CustomCutoffAlertDataUrl = account.CustomCutoffAlertDataUrl;
        CustomCutoffAlertFileName = account.CustomCutoffAlertFileName;
        LastCutoffAlertDate = account.LastCutoffAlertDate;
        LastWakeAlarmDate = account.LastWakeAlarmDate;
        QuestionnaireCompleted = true;
        NotifyStateChanged();
    }

    public void SaveQuestionnaire(SleepQuestionnaireModel model)
    {
        Model = model;
        QuestionnaireCompleted = true;
        CalculateAlerts();
        _ = SaveSleepSettingsAsync();
        NotifyStateChanged();
    }

    public async Task SetCutoffAlertAsync(bool enabled)
    {
        CutoffAlertEnabled = enabled;
        if (enabled)
        {
            try
            {
                await _jsRuntime.InvokeVoidAsync("nobsNotification.requestPermission");
            }
            catch { }
        }
        await SaveSleepSettingsAsync();
        NotifyStateChanged();
    }

    public void SetCutoffAlert(bool enabled) => _ = SetCutoffAlertAsync(enabled);

    public async Task SetWakeAlertAsync(bool enabled)
    {
        WakeAlertEnabled = enabled;
        if (enabled)
        {
            try
            {
                await _jsRuntime.InvokeVoidAsync("nobsNotification.requestPermission");
            }
            catch { }
        }
        await SaveSleepSettingsAsync();
        NotifyStateChanged();
    }

    public void SetWakeAlert(bool enabled) => _ = SetWakeAlertAsync(enabled);

    public async Task SetWakeAlarmSoundAsync(string sound)
    {
        WakeAlarmSound = sound;
        await SaveSleepSettingsAsync();
        NotifyStateChanged();
    }

    public void SetWakeAlarmSound(string sound) => _ = SetWakeAlarmSoundAsync(sound);

    public async Task SetCutoffAlertSoundAsync(string sound)
    {
        CutoffAlertSound = sound;
        await SaveSleepSettingsAsync();
        NotifyStateChanged();
    }

    public void SetCutoffAlertSound(string sound) => _ = SetCutoffAlertSoundAsync(sound);

    public async Task SetCustomCutoffAlertAudioAsync(string dataUrl, string fileName)
    {
        CustomCutoffAlertDataUrl = dataUrl;
        CustomCutoffAlertFileName = fileName;
        CutoffAlertSound = "custom";
        await SaveSleepSettingsAsync();
        NotifyStateChanged();
    }

    public async Task SetCustomWakeAlarmAudioAsync(string dataUrl, string fileName)
    {
        CustomWakeAlarmDataUrl = dataUrl;
        CustomWakeAlarmFileName = fileName;
        WakeAlarmSound = "custom";
        await SaveSleepSettingsAsync();
        NotifyStateChanged();
    }

    public async Task PlaySoundPreviewAsync(string sound, bool isWakeAlarm)
    {
        try
        {
            if (isWakeAlarm)
            {
                await _jsRuntime.InvokeVoidAsync("nobsAudio.playWakeAlarm", sound, _appState.SoundVolume, CustomWakeAlarmDataUrl);
            }
            else
            {
                await _jsRuntime.InvokeVoidAsync("nobsAudio.playCutoffAlert", sound, _appState.SoundVolume, CustomCutoffAlertDataUrl);
            }
        }
        catch { }
    }

    private void CalculateAlerts()
    {
        CalculatedWakeupTime = !string.IsNullOrWhiteSpace(Model.IdealWakeTime) ? Model.IdealWakeTime : "06:00";

        if (TimeSpan.TryParse(Model.IdealBedTime, out var bedTs))
        {
            var cutoffTs = bedTs.Subtract(TimeSpan.FromHours(1));
            if (cutoffTs < TimeSpan.Zero) cutoffTs = cutoffTs.Add(TimeSpan.FromDays(1));
            CalculatedElectronicsCutoff = $"{cutoffTs.Hours:D2}:{cutoffTs.Minutes:D2}";
        }
        else
        {
            CalculatedElectronicsCutoff = "20:00";
        }
    }

    private async Task SaveSleepSettingsAsync()
    {
        if (_accountService.ActiveAccount != null)
        {
            _accountService.ActiveAccount.IdealBedTime = Model.IdealBedTime;
            _accountService.ActiveAccount.IdealWakeTime = Model.IdealWakeTime;
            _accountService.ActiveAccount.CalculatedElectronicsCutoff = CalculatedElectronicsCutoff;
            _accountService.ActiveAccount.CalculatedWakeupTime = CalculatedWakeupTime;
            _accountService.ActiveAccount.CutoffAlertEnabled = CutoffAlertEnabled;
            _accountService.ActiveAccount.WakeAlertEnabled = WakeAlertEnabled;
            _accountService.ActiveAccount.WakeAlarmSound = WakeAlarmSound;
            _accountService.ActiveAccount.CutoffAlertSound = CutoffAlertSound;
            _accountService.ActiveAccount.CustomWakeAlarmDataUrl = CustomWakeAlarmDataUrl;
            _accountService.ActiveAccount.CustomWakeAlarmFileName = CustomWakeAlarmFileName;
            _accountService.ActiveAccount.CustomCutoffAlertDataUrl = CustomCutoffAlertDataUrl;
            _accountService.ActiveAccount.CustomCutoffAlertFileName = CustomCutoffAlertFileName;
            _accountService.ActiveAccount.LastCutoffAlertDate = LastCutoffAlertDate;
            _accountService.ActiveAccount.LastWakeAlarmDate = LastWakeAlarmDate;
            await _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
    }

    private async void HandleTick()
    {
        if (_disposed) return;

        // If sleep alerts are NOT allowed right now, kill any active alarm or snooze immediately!
        if (!ShouldAllowSleepAlerts)
        {
            if (IsAlertModalOpen || IsSnoozed || _alarmLoopCts != null || _snoozeCts != null)
            {
                TurnOffAlert();
            }
            return;
        }

        var now = DateTime.Now;
        string todayStr = now.ToString("yyyy-MM-dd");

        // 1. Check Cutoff Alert (fires at or after calculated cutoff time, e.g. 8:00 PM / 20:00)
        if (CutoffAlertEnabled && LastCutoffAlertDate != todayStr && !IsAlertModalOpen && !IsSnoozed)
        {
            if (TimeSpan.TryParse(CalculatedElectronicsCutoff, out var cutoffTs))
            {
                var curTimeOfDay = now.TimeOfDay;
                // Triggers if current time is past cutoff time (e.g. 8:00 PM - 3:59 AM)
                if (curTimeOfDay >= cutoffTs || curTimeOfDay < TimeSpan.FromHours(4))
                {
                    LastCutoffAlertDate = todayStr;
                    _ = SaveSleepSettingsAsync();
                    await TriggerCutoffAlertAsync();
                }
            }
        }

        // 2. Check Wake Alarm (fires at or after calculated wake time, e.g. 6:00 AM / 06:00)
        if (WakeAlertEnabled && LastWakeAlarmDate != todayStr && !IsAlertModalOpen && !IsSnoozed)
        {
            if (TimeSpan.TryParse(CalculatedWakeupTime, out var wakeTs))
            {
                var curTimeOfDay = now.TimeOfDay;
                if (curTimeOfDay >= wakeTs && curTimeOfDay < wakeTs.Add(TimeSpan.FromHours(4)))
                {
                    LastWakeAlarmDate = todayStr;
                    _ = SaveSleepSettingsAsync();
                    await TriggerWakeAlarmAsync();
                }
            }
        }
    }

    public string FormatTime(string? timeStr)
    {
        if (string.IsNullOrWhiteSpace(timeStr)) return "06:00 AM";
        if (DateTime.TryParseExact(timeStr, "HH:mm", System.Globalization.CultureInfo.InvariantCulture, System.Globalization.DateTimeStyles.None, out var dt))
        {
            return dt.ToString("h:mm tt");
        }
        return timeStr;
    }

    public async Task TriggerCutoffAlertAsync()
    {
        if (!ShouldAllowSleepAlerts || !CutoffAlertEnabled)
        {
            TurnOffAlert();
            return;
        }

        ActiveAlertType = "cutoff";
        ActiveAlertTitle = "Electronics Cutoff Alert";
        ActiveAlertMessage = $"It is now {FormatTime(CalculatedElectronicsCutoff)}. Turn off electronic screens to eliminate blue light exposure and initiate natural melatonin production.";
        ActiveAlertIcon = "📵";
        ActiveAlertTimeDisplay = FormatTime(CalculatedElectronicsCutoff);
        IsAlertModalOpen = true;
        NotifyStateChanged();

        try
        {
            await _jsRuntime.InvokeVoidAsync("nobsNotification.show", "📵 Electronics Cutoff", $"It's {FormatTime(CalculatedElectronicsCutoff)}. Time to turn off electronics 1h before bed.");
        }
        catch { }

        StartAlarmLoop(CutoffAlertSound, false);
    }

    public async Task TriggerWakeAlarmAsync()
    {
        if (!ShouldAllowSleepAlerts || !WakeAlertEnabled)
        {
            TurnOffAlert();
            return;
        }

        ActiveAlertType = "wake";
        ActiveAlertTitle = "Circadian Wake Alarm";
        ActiveAlertMessage = $"Good morning! It is now {FormatTime(CalculatedWakeupTime)}. Step outside or view natural sunlight within 30–60 minutes of waking to anchor your circadian rhythm.";
        ActiveAlertIcon = "☀️";
        ActiveAlertTimeDisplay = FormatTime(CalculatedWakeupTime);
        IsAlertModalOpen = true;
        NotifyStateChanged();

        try
        {
            await _jsRuntime.InvokeVoidAsync("nobsNotification.show", "☀️ Wake Up Alarm", $"It's {FormatTime(CalculatedWakeupTime)}. Time for morning light and optimal alertness.");
        }
        catch { }

        StartAlarmLoop(WakeAlarmSound, true);
    }

    private void StartAlarmLoop(string sound, bool isWake)
    {
        _alarmLoopCts?.Cancel();
        _alarmLoopCts?.Dispose();
        _alarmLoopCts = new System.Threading.CancellationTokenSource();
        var token = _alarmLoopCts.Token;

        _ = Task.Run(async () =>
        {
            var endTime = DateTime.UtcNow.AddMinutes(3); // Ring for up to 3 minutes
            while (!token.IsCancellationRequested && DateTime.UtcNow < endTime && IsAlertModalOpen && ShouldAllowSleepAlerts)
            {
                try
                {
                    if (isWake)
                    {
                        await _jsRuntime.InvokeVoidAsync("nobsAudio.playWakeAlarm", sound, _appState.SoundVolume, CustomWakeAlarmDataUrl);
                    }
                    else
                    {
                        await _jsRuntime.InvokeVoidAsync("nobsAudio.playCutoffAlert", sound, _appState.SoundVolume, CustomCutoffAlertDataUrl);
                    }
                }
                catch { }

                if (token.IsCancellationRequested || !IsAlertModalOpen || !ShouldAllowSleepAlerts)
                {
                    TurnOffAlert();
                    break;
                }

                // 1-second break after the sound finishes playing before repeating
                try
                {
                    await Task.Delay(1000, token);
                }
                catch (TaskCanceledException)
                {
                    break;
                }
            }

            // If 3 minutes elapsed without user interaction, auto-snooze for 5 minutes!
            if (!token.IsCancellationRequested && DateTime.UtcNow >= endTime && IsAlertModalOpen && ShouldAllowSleepAlerts)
            {
                SnoozeAlert(5);
            }
            else if (!ShouldAllowSleepAlerts)
            {
                TurnOffAlert();
            }
        }, token);
    }

    public void TurnOffAlert()
    {
        _alarmLoopCts?.Cancel();
        _alarmLoopCts?.Dispose();
        _alarmLoopCts = null;

        _snoozeCts?.Cancel();
        _snoozeCts?.Dispose();
        _snoozeCts = null;

        IsSnoozed = false;
        SnoozeRemainingSeconds = 0;
        IsAlertModalOpen = false;

        try
        {
            _ = _jsRuntime.InvokeVoidAsync("nobsAudio.stopAllAlarms");
        }
        catch { }

        NotifyStateChanged();
    }

    public void DismissAlert() => TurnOffAlert();

    public void SnoozeAlert(int minutes = 5)
    {
        if (!ShouldAllowSleepAlerts)
        {
            TurnOffAlert();
            return;
        }

        _alarmLoopCts?.Cancel();
        _alarmLoopCts?.Dispose();
        _alarmLoopCts = null;

        try
        {
            _ = _jsRuntime.InvokeVoidAsync("nobsAudio.stopAllAlarms");
        }
        catch { }

        IsAlertModalOpen = false;
        IsSnoozed = true;
        SnoozeRemainingSeconds = minutes * 60;
        NotifyStateChanged();

        _snoozeCts?.Cancel();
        _snoozeCts?.Dispose();
        _snoozeCts = new System.Threading.CancellationTokenSource();
        var token = _snoozeCts.Token;
        var alertType = ActiveAlertType;

        _ = Task.Run(async () =>
        {
            while (SnoozeRemainingSeconds > 0 && !token.IsCancellationRequested)
            {
                if (!ShouldAllowSleepAlerts)
                {
                    TurnOffAlert();
                    return;
                }

                try
                {
                    await Task.Delay(1000, token);
                    SnoozeRemainingSeconds--;
                    NotifyStateChanged();
                }
                catch (TaskCanceledException)
                {
                    return;
                }
            }

            if (!token.IsCancellationRequested)
            {
                IsSnoozed = false;
                if (!ShouldAllowSleepAlerts)
                {
                    TurnOffAlert();
                    return;
                }

                if (alertType == "wake")
                {
                    await TriggerWakeAlarmAsync();
                }
                else
                {
                    await TriggerCutoffAlertAsync();
                }
            }
        }, token);
    }

    public void Reset()
    {
        _alarmLoopCts?.Cancel();
        _alarmLoopCts?.Dispose();
        _alarmLoopCts = null;

        _snoozeCts?.Cancel();
        _snoozeCts?.Dispose();
        _snoozeCts = null;

        QuestionnaireCompleted = false;
        Model = new SleepQuestionnaireModel();
        CalculatedElectronicsCutoff = "20:00";
        CalculatedWakeupTime = "06:00";
        CutoffAlertEnabled = true;
        WakeAlertEnabled = true;
        WakeAlarmSound = "gentle_chime";
        CutoffAlertSound = "soft_pulse";
        CustomWakeAlarmDataUrl = null;
        CustomWakeAlarmFileName = null;
        CustomCutoffAlertDataUrl = null;
        CustomCutoffAlertFileName = null;
        LastCutoffAlertDate = null;
        LastWakeAlarmDate = null;
        IsAlertModalOpen = false;
        IsSnoozed = false;
        SnoozeRemainingSeconds = 0;
        NotifyStateChanged();
    }

    public void Dispose()
    {
        _disposed = true;
        _alarmLoopCts?.Cancel();
        _alarmLoopCts?.Dispose();
        _snoozeCts?.Cancel();
        _snoozeCts?.Dispose();
        _appState.OnUserLoaded -= LoadUserAccount;
        _appState.OnUserLoggedOut -= Reset;
        _appState.OnChange -= OnAppStateChanged;
        _appState.OnTick -= HandleTick;
    }

    private void NotifyStateChanged() => OnChange?.Invoke();
}
