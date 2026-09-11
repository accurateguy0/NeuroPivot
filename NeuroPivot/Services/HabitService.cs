using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.JSInterop;

namespace NeuroPivot.Services;

public class HabitItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Category { get; set; } = "General";
    public Dictionary<int, bool> DaysCompleted { get; set; } = new();

    public bool IsCompletedOnDay(int day) =>
        DaysCompleted.TryGetValue(day, out var v) && v;

    public void SetCompletedOnDay(int day, bool completed) =>
        DaysCompleted[day] = completed;
}

public class DailyProgress
{
    public DateTime Date { get; set; }
    public int CompletedCount { get; set; }
    public int TotalCount { get; set; } = 6;
    public bool EarnedCheckmark => CompletedCount >= 4 && CompletedCount < 6;
    public bool EarnedStar => CompletedCount >= 6;
}

public enum HabitMilestone
{
    None,
    FourHabitsCompleted,
    DayCompleted,
    ChallengeCompleted
}

public class HabitService
{
    private readonly LocalStorageService _localStorage;
    private readonly IJSRuntime _jsRuntime;
    private readonly AppState _appState;
    private readonly AccountService _accountService;

    public event Action? OnChange;

    public List<HabitItem> Habits { get; private set; } = new();
    public int CurrentActiveDay { get; private set; } = 1;
    public bool IsDayLocked { get; private set; } = false;
    public bool ChallengeComplete { get; private set; } = false;
    public DateTime ChallengeStartDate { get; private set; } = DateTime.Today;
    public DateTime LastActiveDate { get; private set; } = DateTime.Today;
    public int ConsecutiveStreak { get; private set; } = 0;
    public DateTime? LastStreakQualifyDate { get; private set; } = null;
    public int AcknowledgedStreakMilestone { get; private set; } = 0;

    public HabitService(LocalStorageService localStorage, IJSRuntime jsRuntime, AppState appState, AccountService accountService)
    {
        _localStorage = localStorage;
        _jsRuntime = jsRuntime;
        _appState = appState;
        _accountService = accountService;

        _appState.OnUserLoaded += LoadUserAccount;
        _appState.OnUserLoggedOut += ClearHabits;

        if (_accountService.ActiveAccount != null)
        {
            LoadUserAccount(_accountService.ActiveAccount);
        }
        else
        {
            InitializeGoalHabit(_appState.CurrentGoal);
        }
    }

    public void LoadUserAccount(UserAccount account)
    {
        if (account == null) return;
        Habits = account.Habits != null ? new List<HabitItem>(account.Habits) : new List<HabitItem>();
        CurrentActiveDay = account.CurrentActiveDay > 0 ? account.CurrentActiveDay : 1;
        IsDayLocked = account.IsDayLocked;
        ChallengeComplete = account.ChallengeComplete;
        ChallengeStartDate = account.ChallengeStartDate != default ? account.ChallengeStartDate : DateTime.Today;
        LastActiveDate = account.LastActiveDate != default ? account.LastActiveDate : DateTime.Today;
        ConsecutiveStreak = account.ConsecutiveStreak;
        LastStreakQualifyDate = account.LastStreakQualifyDate;
        AcknowledgedStreakMilestone = account.AcknowledgedStreakMilestone;

        if (account.Username != null && account.Username.Equals("admin", StringComparison.OrdinalIgnoreCase) && account.ConsecutiveStreak == 21)
        {
            account.ConsecutiveStreak = 7;
            account.AcknowledgedStreakMilestone = 7;
            ConsecutiveStreak = 7;
            AcknowledgedStreakMilestone = 7;
            _ = SaveHabitsToActiveAccountAsync();
        }

        CheckRealWorldDateShift();
        if (Habits.Count == 0 && !string.IsNullOrWhiteSpace(account.CurrentGoal))
        {
            InitializeGoalHabit(account.CurrentGoal);
        }
        NotifyStateChanged();
    }

    public void ClearHabits()
    {
        Habits = new List<HabitItem>();
        CurrentActiveDay = 1;
        IsDayLocked = false;
        ChallengeComplete = false;
        ChallengeStartDate = DateTime.Today;
        LastActiveDate = DateTime.Today;
        ConsecutiveStreak = 0;
        LastStreakQualifyDate = null;
        AcknowledgedStreakMilestone = 0;
        NotifyStateChanged();
    }

    private async Task SaveHabitsToActiveAccountAsync()
    {
        if (_accountService.ActiveAccount != null)
        {
            _accountService.ActiveAccount.Habits = Habits;
            _accountService.ActiveAccount.CurrentActiveDay = CurrentActiveDay;
            _accountService.ActiveAccount.IsDayLocked = IsDayLocked;
            _accountService.ActiveAccount.ChallengeComplete = ChallengeComplete;
            _accountService.ActiveAccount.ChallengeStartDate = ChallengeStartDate;
            _accountService.ActiveAccount.LastActiveDate = LastActiveDate;
            _accountService.ActiveAccount.ConsecutiveStreak = ConsecutiveStreak;
            _accountService.ActiveAccount.LastStreakQualifyDate = LastStreakQualifyDate;
            _accountService.ActiveAccount.AcknowledgedStreakMilestone = AcknowledgedStreakMilestone;
            await _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
    }

    public void CheckRealWorldDateShift()
    {
        var today = DateTime.Today;
        if (today > LastActiveDate)
        {
            int daysPassed = (int)(today - LastActiveDate).TotalDays;
            LastActiveDate = today;

            if (LastStreakQualifyDate.HasValue && (today - LastStreakQualifyDate.Value.Date).TotalDays > 1)
            {
                ConsecutiveStreak = 0;
            }

            for (int i = 0; i < daysPassed; i++)
            {
                if (CurrentActiveDay < 21)
                {
                    CurrentActiveDay++;
                    IsDayLocked = false;
                    foreach (var h in Habits) h.SetCompletedOnDay(CurrentActiveDay, false);
                }
            }
            _ = SaveHabitsToActiveAccountAsync();
            NotifyStateChanged();
        }
    }

    public void InitializeGoalHabit(string goal)
    {
        string target = string.IsNullOrWhiteSpace(goal) ? "habits" : goal.ToLower();
        if (target == "eating")
        {
            if (!Habits.Any(h => h.Name.Equals("eat healthy", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("eat healthy", "Nutritional timing and glucose balance protocol", "Eating");
            }
        }
        else if (target == "sleep")
        {
            if (!Habits.Any(h => h.Name.Equals("sleep at the right time", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("sleep at the right time", "Circadian sleep alignment", "Sleep");
            }
        }
        else if (target == "focus")
        {
            if (!Habits.Any(h => h.Name.Equals("deep focus block", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("deep focus block", "90-minute uninterrupted ultradian deep work session", "Focus");
            }
        }
        else if (target == "stress")
        {
            if (!Habits.Any(h => h.Name.Equals("physiological sigh", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("physiological sigh", "Cyclic double-inhalation autonomic reset", "Stress");
            }
        }
        else if (target == "pain")
        {
            if (!Habits.Any(h => h.Name.Equals("mcgill big 3 core stability", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("mcgill big 3 core stability", "Curl-up, side plank & bird dog spine unloading", "Pain");
            }
        }
        else if (target == "eye")
        {
            if (!Habits.Any(h => h.Name.Equals("panoramic horizon view", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("panoramic horizon view", "20 minutes distant horizon gaze per 90m near work", "Eye");
            }
        }
        else if (target == "hearing")
        {
            if (!Habits.Any(h => h.Name.Equals("40hz auditory focus session", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("40hz auditory focus session", "Gamma entrainment cognitive work session", "Hearing");
            }
        }
        else if (target == "carl_jung")
        {
            if (!Habits.Any(h => h.Name.Equals("daily active reflection", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("daily active reflection", "60 minutes journal & dream analysis", "Carl Jung");
            }
        }
        else if (target == "emotions")
        {
            if (!Habits.Any(h => h.Name.Equals("interoceptive calibration", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("interoceptive calibration", "Visceral awareness & emotional regulation", "Emotions");
            }
        }
        else if (target == "exercise")
        {
            if (!Habits.Any(h => h.Name.Equals("resistance training block", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("resistance training block", "Henneman principle high-threshold fiber work", "Exercise");
            }
        }
        else if (target == "performance")
        {
            if (!Habits.Any(h => h.Name.Equals("palmar cooling recovery", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("palmar cooling recovery", "Glabrous skin thermal dissipation protocol", "Performance");
            }
        }
        else if (target == "brain")
        {
            if (!Habits.Any(h => h.Name.Equals("vascular & neuroprotection protocol", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("vascular & neuroprotection protocol", "Hydration, blood pressure check & aerobic cerebral perfusion", "Brain");
            }
        }
        else if (target == "hormones")
        {
            if (!Habits.Any(h => h.Name.Equals("endocrine optimization protocol", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("endocrine optimization protocol", "Sunlight, heavy resistance, sleep hygiene & toxin avoidance", "Hormones");
            }
        }
        else if (target == "skin")
        {
            if (!Habits.Any(h => h.Name.Equals("dermal protection & hydration protocol", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("dermal protection & hydration protocol", "Sunlight management, gentle cleansing, collagen & barrier support", "Skin");
            }
        }
        else if (target == "smell" || target.Contains("olfact") || target.Contains("chemosens"))
        {
            if (!Habits.Any(h => h.Name.Equals("olfactory training & nasal airflow protocol", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("olfactory training & nasal airflow protocol", "Essential oil sensory training, nasal breathing & scent discrimination", "Smell");
            }
        }
        else if (target == "taste" || target.Contains("gustat") || target.Contains("flavor"))
        {
            if (!Habits.Any(h => h.Name.Equals("gustatory training & mindful tasting protocol", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("gustatory training & mindful tasting protocol", "Mindful flavor engagement, taste bud recovery & processed food reduction", "Taste");
            }
        }
        else
        {
            if (!Habits.Any(h => h.Name.Equals("break bad habit", StringComparison.OrdinalIgnoreCase)))
            {
                AddHabit("break bad habit", "LTD synaptic pruning abstinence protocol", "Habits");
            }
        }
        
        _ = SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
    }

    public async Task<HabitMilestone> ToggleHabitDayAsync(string id, int day)
    {
        if (day != CurrentActiveDay || IsDayLocked) return HabitMilestone.None;

        var habit = Habits.FirstOrDefault(h => h.Id == id);
        if (habit == null) return HabitMilestone.None;

        // Once ticked off, you cannot uncheck it
        if (habit.IsCompletedOnDay(day)) return HabitMilestone.None;

        habit.SetCompletedOnDay(day, true);
        // Low-frequency thud for each individual habit check
        await _jsRuntime.InvokeVoidAsync("nobsAudio.playThud", _appState.SoundVolume);

        int completedToday = Habits.Count(h => h.IsCompletedOnDay(CurrentActiveDay));

        if (completedToday >= 4)
        {
            UpdateStreakOnQualify();
        }

        // 1. Milestone: 4 Habits Completed (Celebration Pop-up + Confetti)
        if (completedToday == 4)
        {
            await _jsRuntime.InvokeVoidAsync("nobsConfetti.launch");
            _ = SaveHabitsToActiveAccountAsync();
            NotifyStateChanged();
            return HabitMilestone.FourHabitsCompleted;
        }

        // 2. Milestone: All 6 Habits Completed (Day Locked)
        if (Habits.Count == 6 && completedToday == 6)
        {
            IsDayLocked = true;

            // Check 21-day challenge completion
            if (CurrentActiveDay >= 21)
            {
                ChallengeComplete = true;
                // Shimmer cascade + confetti for full challenge completion
                await _jsRuntime.InvokeVoidAsync("nobsAudio.playShimmer", _appState.SoundVolume);
                await _jsRuntime.InvokeVoidAsync("nobsConfetti.launch");
                _ = SaveHabitsToActiveAccountAsync();
                NotifyStateChanged();
                return HabitMilestone.ChallengeCompleted;
            }

            // Confetti burst on the 6th habit check completing the day
            await _jsRuntime.InvokeVoidAsync("nobsConfetti.launch");
            _ = SaveHabitsToActiveAccountAsync();
            NotifyStateChanged();
            return HabitMilestone.DayCompleted;
        }

        _ = SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
        return HabitMilestone.None;
    }

    private void UpdateStreakOnQualify()
    {
        var today = DateTime.Today;
        int tableStreak = CalculateTableStreak();
        if (LastStreakQualifyDate == null)
        {
            ConsecutiveStreak = Math.Max(1, tableStreak);
            LastStreakQualifyDate = today;
        }
        else if (LastStreakQualifyDate.Value.Date == today)
        {
            ConsecutiveStreak = Math.Max(ConsecutiveStreak, tableStreak);
        }
        else if (LastStreakQualifyDate.Value.Date == today.AddDays(-1))
        {
            ConsecutiveStreak++;
            LastStreakQualifyDate = today;
        }
        else
        {
            ConsecutiveStreak = Math.Max(1, tableStreak);
            LastStreakQualifyDate = today;
        }
    }

    private int CalculateTableStreak()
    {
        if (Habits.Count == 0 || CurrentActiveDay < 1) return 0;
        int todayCount = Habits.Count(h => h.IsCompletedOnDay(CurrentActiveDay));
        bool todayQualified = todayCount >= 4;

        int count = 0;
        int startDay = todayQualified ? CurrentActiveDay : CurrentActiveDay - 1;

        for (int d = startDay; d >= 1; d--)
        {
            int c = Habits.Count(h => h.IsCompletedOnDay(d));
            if (c >= 4)
            {
                count++;
            }
            else
            {
                break;
            }
        }
        return count;
    }

    public void AdvanceNextDay()
    {
        if (CurrentActiveDay < 21)
        {
            CurrentActiveDay++;
            IsDayLocked = false;
            foreach (var h in Habits) h.SetCompletedOnDay(CurrentActiveDay, false);
            _ = SaveHabitsToActiveAccountAsync();
            NotifyStateChanged();
        }
    }

    public void ReinforceChallenge()
    {
        // Same habits, reset all days from 1, but preserve long-term consecutive streak
        CurrentActiveDay = 1;
        IsDayLocked = false;
        ChallengeComplete = false;
        ChallengeStartDate = DateTime.Today;
        foreach (var h in Habits)
        {
            h.DaysCompleted.Clear();
            h.SetCompletedOnDay(1, false);
        }
        _ = SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
    }

    public void StartNewChallenge()
    {
        // Clear all habits and reset to Day 1
        Habits.Clear();
        CurrentActiveDay = 1;
        IsDayLocked = false;
        ChallengeComplete = false;
        ChallengeStartDate = DateTime.Today;
        ConsecutiveStreak = 0;
        LastStreakQualifyDate = null;
        _ = SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
    }

    public bool AddHabit(string name, string description = "", string category = "Custom")
    {
        if (Habits.Count >= 6) return false;
        if (Habits.Any(h => h.Name.Equals(name, StringComparison.OrdinalIgnoreCase))) return true;

        var habit = new HabitItem { Name = name, Description = description, Category = category };
        for (int d = 1; d < CurrentActiveDay; d++) habit.SetCompletedOnDay(d, true);
        habit.SetCompletedOnDay(CurrentActiveDay, false);

        Habits.Add(habit);
        _ = SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
        return true;
    }

    public void RemoveHabitAndResetProgress(string id)
    {
        Habits.RemoveAll(h => h.Id == id);
        CurrentActiveDay = 1;
        ChallengeStartDate = DateTime.Today;
        IsDayLocked = false;
        ChallengeComplete = false;
        foreach (var h in Habits) { h.DaysCompleted.Clear(); h.SetCompletedOnDay(1, false); }
        _ = SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
    }

    public bool IsDayFullyCompleted(int day)
    {
        if (Habits.Count == 0) return false;
        return Habits.All(h => h.IsCompletedOnDay(day));
    }

    public int GetCompletedTodayCount() =>
        Habits.Count(h => h.IsCompletedOnDay(CurrentActiveDay));

    public int GetTotalHabitsCount() => Habits.Count;

    public int GetHabitMeterPercentage()
    {
        return (int)Math.Round(Math.Clamp((double)Habits.Count / 6.0 * 100.0, 0.0, 100.0));
    }

    public double GetTodayProgressPercentage()
    {
        if (Habits.Count == 0) return 0;
        return Math.Round((double)GetCompletedTodayCount() / Habits.Count * 100.0);
    }

    public List<DailyProgress> GetLast7DaysHistory(int weekOffset = 0)
    {
        var list = new List<DailyProgress>();
        var today = DateTime.Today;
        int daysSinceMonday = ((int)today.DayOfWeek - 1 + 7) % 7;
        var monday = today.AddDays(-daysSinceMonday + (weekOffset * 7));

        int totalHabits = Habits.Count > 0 ? Habits.Count : 6;

        for (int i = 0; i < 7; i++)
        {
            var date = monday.AddDays(i);
            int dayOffset = (int)(date.Date - ChallengeStartDate.Date).TotalDays;
            int challengeDay = dayOffset + 1;

            int count = 0;
            if (challengeDay >= 1 && challengeDay <= 21 && challengeDay <= CurrentActiveDay)
            {
                count = Habits.Count(h => h.IsCompletedOnDay(challengeDay));
            }

            list.Add(new DailyProgress
            {
                Date = date,
                CompletedCount = count,
                TotalCount = totalHabits
            });
        }
        return list;
    }

    public int GetConsecutiveStreak()
    {
        int tableStreak = CalculateTableStreak();
        return Math.Max(ConsecutiveStreak, tableStreak);
    }

    public bool IsTodayStreakQualified()
    {
        if (Habits.Count == 0) return false;
        return Habits.Count(h => h.IsCompletedOnDay(CurrentActiveDay)) >= 4;
    }

    public int GetTotalCompletedHabitsCount()
    {
        if (Habits.Count == 0) return 0;
        int count = 0;
        foreach (var h in Habits)
        {
            count += h.DaysCompleted.Values.Count(v => v);
        }
        return count;
    }

    public int GetQualifiedDaysCount()
    {
        if (CurrentActiveDay <= 0 || Habits.Count == 0) return 0;
        int qualifiedDays = 0;
        for (int d = 1; d <= CurrentActiveDay; d++)
        {
            if (Habits.Count(h => h.IsCompletedOnDay(d)) >= 4)
            {
                qualifiedDays++;
            }
        }
        return qualifiedDays;
    }

    public int GetHabitsConsistencyPercentage()
    {
        if (CurrentActiveDay <= 0 || Habits.Count == 0) return 0;
        int qualifiedDays = GetQualifiedDaysCount();
        return (int)Math.Round((double)qualifiedDays / (double)CurrentActiveDay * 100.0);
    }

    public void LogDailyMood(string moodTag, string note)
    {
        var entry = new DailyMoodEntry
        {
            Date = DateTime.Today,
            MoodTag = moodTag,
            Note = note?.Trim() ?? "",
            HabitsCompletedOnDay = GetCompletedTodayCount(),
            TotalHabitsCount = Habits.Count > 0 ? Habits.Count : 6
        };
        _appState.AddDailyMoodLog(entry);
        _ = SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
    }

    public async Task LogRelapseAsync(string triggerCategory, string haltState, string frictionFailure, string calibrationAction)
    {
        var entry = new RelapseEntry
        {
            Timestamp = DateTime.Now,
            ChallengeDay = CurrentActiveDay,
            TriggerCategory = triggerCategory ?? "Unspecified",
            HaltState = haltState ?? "None",
            FrictionFailure = frictionFailure ?? "",
            CalibrationAction = calibrationAction ?? ""
        };

        _appState.AddRelapseLog(entry);

        // Reset the streak in stats to 0, mark today as last qualifying attempt, but keep the 21-day table day
        ConsecutiveStreak = 0;
        LastStreakQualifyDate = DateTime.Today;

        if (_accountService.ActiveAccount != null)
        {
            _accountService.ActiveAccount.ConsecutiveStreak = 0;
            _accountService.ActiveAccount.LastStreakQualifyDate = DateTime.Today;
            await _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }

        await SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
    }

    public async Task LogUrgeSurfedAsync()
    {
        _appState.IncrementUrgesSurfed();
        if (_accountService.ActiveAccount != null)
        {
            _accountService.ActiveAccount.UrgesSurfedCount = _appState.UrgesSurfedCount;
            await _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
        await SaveHabitsToActiveAccountAsync();
        NotifyStateChanged();
    }

    public (int MaxDays, string[] Labels) GetStreakScaleInfo()
    {
        int s = GetConsecutiveStreak();
        int ack = AcknowledgedStreakMilestone;

        // If user reached a milestone but hasn't acknowledged the congratulations modal yet,
        // show the achieved milestone scale (at 100% fill) so they see the completed bar
        if (s >= 1 && ack < 1 && s < 3) return (1, new[] { "0 days", "1 day" });
        if (s >= 3 && ack < 3 && s < 7) return (3, new[] { "0 days", "1 day", "2 days", "3 days" });
        if (s >= 7 && ack < 7 && s < 14) return (7, new[] { "0 days", "3 days", "5 days", "7 days" });
        if (s >= 14 && ack < 14 && s < 21) return (14, new[] { "0 days", "7 days", "10 days", "14 days" });
        if (s >= 21 && ack < 21 && s < 30) return (21, new[] { "0 days", "7 days", "14 days", "21 days" });
        if (s >= 30 && ack < 30 && s < 60) return (30, new[] { "0 days", "10 days", "20 days", "30 days" });
        if (s >= 60 && ack < 60 && s < 90) return (60, new[] { "0 days", "20 days", "40 days", "60 days" });
        if (s >= 90 && ack < 90 && s < 180) return (90, new[] { "0 days", "30 days", "60 days", "90 days" });
        if (s >= 180 && ack < 180 && s < 365) return (180, new[] { "0 days", "60 days", "120 days", "180 days" });
        if (s >= 365 && ack < 365 && s < 730) return (365, new[] { "0 days", "100 days", "200 days", "1 year" });
        if (s >= 730 && ack < 730 && s < 1825) return (730, new[] { "0", "6 mos", "1 year", "2 years" });
        if (s >= 1825 && ack < 1825 && s < 3650) return (1825, new[] { "0", "1 yr", "3 yrs", "5 years" });

        // Otherwise, the scale levels up to the next target milestone
        int effectiveStreak = Math.Max(s, ack);

        if (effectiveStreak < 1) return (1, new[] { "0 days", "1 day" });
        if (effectiveStreak < 3) return (3, new[] { "0 days", "1 day", "2 days", "3 days" });
        if (effectiveStreak < 7) return (7, new[] { "0 days", "3 days", "5 days", "7 days" });
        if (effectiveStreak < 14) return (14, new[] { "0 days", "7 days", "10 days", "14 days" });
        if (effectiveStreak < 21) return (21, new[] { "0 days", "7 days", "14 days", "21 days" });
        if (effectiveStreak < 30) return (30, new[] { "0 days", "10 days", "20 days", "30 days" });
        if (effectiveStreak < 60) return (60, new[] { "0 days", "20 days", "40 days", "60 days" });
        if (effectiveStreak < 90) return (90, new[] { "0 days", "30 days", "60 days", "90 days" });
        if (effectiveStreak < 180) return (180, new[] { "0 days", "60 days", "120 days", "180 days" });
        if (effectiveStreak < 365) return (365, new[] { "0 days", "100 days", "200 days", "1 year" });
        if (effectiveStreak < 730) return (730, new[] { "0", "6 mos", "1 year", "2 years" });
        if (effectiveStreak < 1825) return (1825, new[] { "0", "1 yr", "3 yrs", "5 years" });
        return (3650, new[] { "0", "2.5 yrs", "5 yrs", "10 years" });
    }

    public int GetStreakMeterPercentage()
    {
        int streak = GetConsecutiveStreak();
        if (streak <= 0) return 0;
        var (maxDays, _) = GetStreakScaleInfo();
        return Math.Clamp((int)Math.Round((double)streak / (double)maxDays * 100.0), 3, 100);
    }

    public static readonly int[] MilestoneTiers = new[] { 1, 3, 7, 14, 21, 30, 60, 90, 180, 365, 730, 1825, 3650 };

    public (bool HasMilestone, int MilestoneTier, string Title, string Subtitle, string Message) CheckUnacknowledgedStreakMilestone()
    {
        int streak = GetConsecutiveStreak();
        var reached = MilestoneTiers.Where(m => streak >= m && m > AcknowledgedStreakMilestone).ToList();
        if (reached.Count == 0)
        {
            return (false, 0, "", "", "");
        }

        int tier = reached.Max();
        var (title, subtitle, msg) = GetMilestoneMessage(tier);
        return (true, tier, title, subtitle, msg);
    }

    public async Task AcknowledgeStreakMilestoneAsync(int tier)
    {
        AcknowledgedStreakMilestone = Math.Max(AcknowledgedStreakMilestone, tier);
        if (_accountService.ActiveAccount != null)
        {
            _accountService.ActiveAccount.AcknowledgedStreakMilestone = AcknowledgedStreakMilestone;
            await _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
        NotifyStateChanged();
    }

    public async Task SetStreakForTestingAsync(int days, int? ackTier = null)
    {
        ConsecutiveStreak = days;
        LastStreakQualifyDate = DateTime.Today;
        if (ackTier.HasValue)
        {
            AcknowledgedStreakMilestone = ackTier.Value;
        }
        if (_accountService.ActiveAccount != null)
        {
            _accountService.ActiveAccount.ConsecutiveStreak = days;
            _accountService.ActiveAccount.LastStreakQualifyDate = DateTime.Today;
            if (ackTier.HasValue)
            {
                _accountService.ActiveAccount.AcknowledgedStreakMilestone = ackTier.Value;
            }
            await _accountService.SaveAccountAsync(_accountService.ActiveAccount);
        }
        NotifyStateChanged();
    }

    public static (string Title, string Subtitle, string Message) GetMilestoneMessage(int tier)
    {
        return tier switch
        {
            1 => (
                "🌱 Day 1 Ignition Unlocked!",
                "Day 1 Streak Milestone",
                "The journey begins! You took the crucial first step. Overcoming inertia is the hardest part of any transformation. Your commitment is set in motion."
            ),
            3 => (
                "🔥 3-Day Momentum Unlocked!",
                "3-Day Streak Scale Milestone",
                "Incredible start! You've maintained discipline for 3 consecutive days. Your neural circuits are already adapting to initiate your daily routine with significantly less cognitive friction."
            ),
            7 => (
                "⚡ 7-Day Consistency Mastered!",
                "1-Week Streak Scale Milestone",
                "One full week of discipline! You've broken the initial inertia barrier. Dopaminergic baseline regulation is anchoring these daily actions as your new natural standard."
            ),
            14 => (
                "🚀 14-Day Synaptic Reinforcement!",
                "2-Week Streak Scale Milestone",
                "Two weeks of uninterrupted execution! Synaptic pathways are strengthening daily. What once required intense willpower is rapidly becoming second nature."
            ),
            21 => (
                "🧠 21-Day Neuroplasticity Protocol!",
                "21-Day Protocol Milestone (LTP)",
                "Monumental achievement! 21 consecutive days has activated Long-Term Potentiation (LTP). You've fundamentally rewired your neurocircuitry and forged resilient neural pathways."
            ),
            30 => (
                "🌙 30-Day Transformation Seal!",
                "1-Month Mastery Milestone",
                "A full month of absolute consistency! Your brain structure has adapted to your new daily reality. You've solidified identity-level change and built unwavering momentum."
            ),
            60 => (
                "🏆 60-Day Habit Automaticity!",
                "2-Month Automaticity Milestone",
                "60 days of relentless discipline! Approaching complete automaticity as documented by neurobehavioral science. The mental friction is gone; execution is now your default state."
            ),
            90 => (
                "👑 90-Day Lifestyle Mastery!",
                "Quarterly Milestone (90 Days)",
                "A complete quarter of relentless execution! You have transformed temporary discipline into permanent lifestyle mastery. You are operating in the upper echelon of consistency."
            ),
            180 => (
                "🛡️ 180-Day Iron Discipline!",
                "Half-Year Scale Milestone",
                "Half a year of unyielding commitment. Your baseline self-regulation, health markers, and mental resilience are operating at an entirely transformed level."
            ),
            365 => (
                "🌟 365-Day Master of Identity!",
                "1-Year Legendary Milestone",
                "A full year of daily excellence! You've conquered every season, obstacle, and test of willpower. A legendary testament to long-term neuroplastic transformation."
            ),
            730 => (
                "⭐ 2-Year Unshakable Standard!",
                "2-Year Elite Milestone",
                "Two full years of unbroken discipline. Your standard of living and habits are virtually unbreakable. You embody mastery."
            ),
            1825 => (
                "💎 5-Year Legacy of Greatness!",
                "5-Year Monumental Milestone",
                "Half a decade of relentless dedication! Your daily practice has forged an extraordinary legacy of health, mental fortitude, and supreme discipline."
            ),
            3650 => (
                "🏛️ 10-Year Hall of Fame Decade!",
                "Decade of Absolute Mastery (10 Years)",
                "An entire decade of unwavering excellence! 10 years of unbroken devotion places you in a class of your own. A true master of life and discipline."
            ),
            _ => (
                $"🎖️ {tier}-Day Streak Milestone Reached!",
                $"{tier}-Day Scale Milestone",
                $"Extraordinary commitment! You've conquered the {tier}-day milestone with unbreakable consistency and dedication."
            )
        };
    }

    private void NotifyStateChanged() => OnChange?.Invoke();
}
