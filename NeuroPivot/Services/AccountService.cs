using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations.Schema;
using System.IO;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using NeuroPivot.Data;

namespace NeuroPivot.Services;

public class UserAccount
{
    public string Username { get; set; } = "";
    
    [NotMapped]
    public string Password { get; set; } = "";
    public string PasswordHash { get; set; } = "";
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    // Habits & 21-Day Challenge Data
    public List<HabitItem> Habits { get; set; } = new();
    public int CurrentActiveDay { get; set; } = 1;
    public bool IsDayLocked { get; set; } = false;
    public bool ChallengeComplete { get; set; } = false;
    public DateTime ChallengeStartDate { get; set; } = DateTime.UtcNow.Date;
    public DateTime LastActiveDate { get; set; } = DateTime.UtcNow.Date;
    public int ConsecutiveStreak { get; set; } = 0;
    public int HighestStreak { get; set; } = 0;
    public DateTime? LastStreakQualifyDate { get; set; } = null;
    public int AcknowledgedStreakMilestone { get; set; } = 0;
    public int PendingLostStreak { get; set; } = 0;

    // Habits Goal Specific: Motivation, Logs, Relapses & Urges
    public string InitialHabitMotivation { get; set; } = "";
    public List<DailyMoodEntry> DailyMoodLogs { get; set; } = new();
    public List<RelapseEntry> RelapseLogs { get; set; } = new();
    public int UrgesSurfedCount { get; set; } = 0;
    public List<int> FavoriteArchiveDays { get; set; } = new();

    [NotMapped]
    public List<AnchorCardItem> AnchorCards { get; set; } = new();

    // Goals & Diagnostics (Personalization Telemetry)
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

public class DailyMoodEntry
{
    public DateTime Date { get; set; } = DateTime.Today;
    public string MoodTag { get; set; } = "good"; // sharp (high energy), good, low_energy, poor
    public string Note { get; set; } = "";
    public string GratitudeNote { get; set; } = "";
    public int HabitsCompletedOnDay { get; set; } = 0;
    public int TotalHabitsCount { get; set; } = 6;
}

public class RelapseEntry
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public DateTime Timestamp { get; set; } = DateTime.Now;
    public int ChallengeDay { get; set; } = 1;
    public string TriggerCategory { get; set; } = ""; // Social Cue, Boredom / Emptiness, Late Night Fatigue, Acute Stress Spike, Digital Stimulus / Device
    public string HaltState { get; set; } = ""; // Hungry, Angry, Lonely, Tired, None
    public string FrictionFailure { get; set; } = ""; // Environmental barrier that failed
    public string CalibrationAction { get; set; } = ""; // Solution / rule adjustment
}

public class AnchorCardItem
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public string Title { get; set; } = "";
    public string Note { get; set; } = "";
    public string ImageUrl { get; set; } = "";
    public string Category { get; set; } = "self"; // self, loved_ones, future
}

public class AuthResult
{
    public bool Success { get; set; }
    public string? ErrorMessage { get; set; }
    public UserAccount? Account { get; set; }
}

public class AccountService
{
    private readonly IDbContextFactory<NeuroPivotDbContext> _dbContextFactory;
    private readonly IPasswordHasherService _passwordHasher;
    private static bool _initialized = false;
    private static readonly object _initLock = new();

    public UserAccount? ActiveAccount { get; private set; }

    public AccountService(
        IDbContextFactory<NeuroPivotDbContext> dbContextFactory,
        IPasswordHasherService passwordHasher)
    {
        _dbContextFactory = dbContextFactory;
        _passwordHasher = passwordHasher;

        EnsureInitialized();
    }

    private void EnsureInitialized()
    {
        if (_initialized) return;
        lock (_initLock)
        {
            if (_initialized) return;
            try
            {
                // Step 1: Check if Users table exists in an isolated context
                bool usersTableExists = false;
                try
                {
                    using var testDb = _dbContextFactory.CreateDbContext();
                    _ = testDb.Users.Take(1).ToList();
                    usersTableExists = true;
                }
                catch
                {
                    usersTableExists = false;
                }

                if (!usersTableExists)
                {
                    try
                    {
                        using var createDb = _dbContextFactory.CreateDbContext();
                        var creator = Microsoft.EntityFrameworkCore.Infrastructure.AccessorExtensions.GetService<Microsoft.EntityFrameworkCore.Storage.IDatabaseCreator>(createDb.Database)
                            as Microsoft.EntityFrameworkCore.Storage.IRelationalDatabaseCreator;
                        creator?.CreateTables();
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine($"[AccountService Init] Notice on CreateTables: {ex.Message}");
                        try
                        {
                            using var fallbackDb = _dbContextFactory.CreateDbContext();
                            fallbackDb.Database.EnsureCreated();
                        }
                        catch { }
                    }
                }

                // Step 2: Migrate legacy accounts in a clean context if present
                using (var migDb = _dbContextFactory.CreateDbContext())
                {
                    MigrateLegacyAccountsIfPresent(migDb);
                }

                // Step 3: Ensure default admin account exists in a fresh, clean context
                using (var adminDb = _dbContextFactory.CreateDbContext())
                {
                    var admin = adminDb.Users.FirstOrDefault(u => u.Username.ToLower() == "admin");
                    if (admin == null)
                    {
                        var defaultAdmin = CreateDefaultAdminAccount();
                        defaultAdmin.PasswordHash = _passwordHasher.HashPassword("admin");
                        adminDb.Users.Add(defaultAdmin);
                        adminDb.SaveChanges();
                        Console.WriteLine("[AccountService Init] Default admin account successfully seeded.");
                    }
                }

                _initialized = true;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"[AccountService Init] Error: {ex.Message}");
            }
        }
    }

    private void MigrateLegacyAccountsIfPresent(NeuroPivotDbContext db)
    {
        try
        {
            string serverDataFolder = Path.Combine(AppContext.BaseDirectory, "App_Data");
            string legacyPath = Path.Combine(serverDataFolder, "accounts.json");
            if (File.Exists(legacyPath))
            {
                var text = File.ReadAllText(legacyPath);
                if (!string.IsNullOrWhiteSpace(text))
                {
                    var list = JsonSerializer.Deserialize<List<UserAccount>>(text, new JsonSerializerOptions
                    {
                        PropertyNameCaseInsensitive = true
                    });

                    if (list != null && list.Count > 0)
                    {
                        foreach (var acc in list)
                        {
                            if (string.IsNullOrWhiteSpace(acc.Username)) continue;
                            if (!db.Users.Any(u => u.Username.ToLower() == acc.Username.ToLower()))
                            {
                                // Hash password if not already hashed
                                string pwdToHash = !string.IsNullOrEmpty(acc.Password) ? acc.Password : "admin";
                                acc.PasswordHash = _passwordHasher.HashPassword(pwdToHash);
                                db.Users.Add(acc);
                            }
                        }
                        db.SaveChanges();
                    }
                }
                // Safely archive legacy file so plaintext credentials are not left on disk
                string backupPath = Path.Combine(serverDataFolder, "accounts.json.migrated");
                File.Move(legacyPath, backupPath, overwrite: true);
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[Migration Notice] {ex.Message}");
        }
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
            CreatedAt = DateTime.UtcNow.AddDays(-2),
            CurrentGoal = "habits",
            CurrentActiveDay = 3,
            IsDayLocked = false,
            ChallengeComplete = false,
            ChallengeStartDate = DateTime.UtcNow.Date.AddDays(-2),
            LastActiveDate = DateTime.UtcNow.Date,
            ConsecutiveStreak = 3,
            HighestStreak = 3,
            LastStreakQualifyDate = DateTime.UtcNow.Date,
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

    public async Task<UserAccount?> GetAccountByUsernameAsync(string username)
    {
        if (string.IsNullOrWhiteSpace(username)) return null;

        using var db = await _dbContextFactory.CreateDbContextAsync();
        var normalized = username.Trim().ToLower();
        return await db.Users.AsNoTracking().FirstOrDefaultAsync(a => a.Username.ToLower() == normalized);
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

        if (password.Length < 6)
        {
            return new AuthResult { Success = false, ErrorMessage = "Password must be at least 6 characters long." };
        }

        if (username.Equals("Guest User", StringComparison.OrdinalIgnoreCase) || username.Equals("Guest", StringComparison.OrdinalIgnoreCase))
        {
            return new AuthResult { Success = false, ErrorMessage = "This username is reserved. Please choose another username." };
        }

        try
        {
            using var db = await _dbContextFactory.CreateDbContextAsync();
            var normalized = username.ToLower();
            bool exists = await db.Users.AnyAsync(a => a.Username.ToLower() == normalized);
            if (exists)
            {
                return new AuthResult { Success = false, ErrorMessage = "An account with this username already exists. Please sign in." };
            }

            var newAccount = new UserAccount
            {
                Username = username,
                PasswordHash = _passwordHasher.HashPassword(password),
                CreatedAt = DateTime.UtcNow,
                CurrentGoal = "habits",
                CurrentActiveDay = 1,
                IsDayLocked = false,
                ChallengeComplete = false,
                ChallengeStartDate = DateTime.UtcNow.Date,
                LastActiveDate = DateTime.UtcNow.Date,
                Habits = new List<HabitItem>(),
                IsDarkMode = true,
                SoundVolume = 80,
                SleepNotificationsEnabled = true,
                WebsiteTimeSeconds = 0
            };

            db.Users.Add(newAccount);
            await db.SaveChangesAsync();

            ActiveAccount = newAccount;
            return new AuthResult { Success = true, Account = newAccount };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SignUp Error] {ex.Message}");
            return new AuthResult { Success = false, ErrorMessage = $"Unable to create account: {ex.Message}" };
        }
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

        try
        {
            using var db = await _dbContextFactory.CreateDbContextAsync();
            var normalized = username.ToLower();
            var account = await db.Users.FirstOrDefaultAsync(a => a.Username.ToLower() == normalized);

            if (account == null)
            {
                return new AuthResult { Success = false, ErrorMessage = "Account does not exist. Please check your username or sign up." };
            }

            // Verify with cryptographic password hasher
            bool isValid = _passwordHasher.VerifyPassword(account.PasswordHash, password);
            if (!isValid)
            {
                // Legacy plaintext fallback check during migration
                if (string.IsNullOrEmpty(account.PasswordHash) && account.Password == password)
                {
                    account.PasswordHash = _passwordHasher.HashPassword(password);
                    await db.SaveChangesAsync();
                    isValid = true;
                }
            }

            if (!isValid)
            {
                return new AuthResult { Success = false, ErrorMessage = "Incorrect password. Please try again." };
            }

            ActiveAccount = account;
            return new AuthResult { Success = true, Account = account };
        }
        catch (Exception ex)
        {
            Console.WriteLine($"[SignIn Error] {ex.Message}");
            return new AuthResult { Success = false, ErrorMessage = $"Database sign-in error: {ex.Message}" };
        }
    }

    public void SetActiveAccount(UserAccount? account)
    {
        ActiveAccount = account;
    }

    public async Task SaveAccountAsync(UserAccount account)
    {
        if (account == null || string.IsNullOrWhiteSpace(account.Username)) return;

        using var db = await _dbContextFactory.CreateDbContextAsync();
        var existing = await db.Users.FirstOrDefaultAsync(a => a.Username.ToLower() == account.Username.ToLower());
        if (existing != null)
        {
            db.Entry(existing).CurrentValues.SetValues(account);
            // Ensure complex navigation/collection properties update properly
            existing.Habits = account.Habits ?? new();
            existing.DailyMoodLogs = account.DailyMoodLogs ?? new();
            existing.RelapseLogs = account.RelapseLogs ?? new();
            existing.FavoriteArchiveDays = account.FavoriteArchiveDays ?? new();
            await db.SaveChangesAsync();
        }
        else
        {
            db.Users.Add(account);
            await db.SaveChangesAsync();
        }

        if (ActiveAccount != null && ActiveAccount.Username.Equals(account.Username, StringComparison.OrdinalIgnoreCase))
        {
            ActiveAccount = account;
        }
    }

    public async Task<bool> UpdatePasswordAsync(string username, string newPassword)
    {
        if (string.IsNullOrWhiteSpace(username) || string.IsNullOrWhiteSpace(newPassword)) return false;
        if (newPassword.Length < 6) return false;

        using var db = await _dbContextFactory.CreateDbContextAsync();
        var account = await db.Users.FirstOrDefaultAsync(a => a.Username.ToLower() == username.Trim().ToLower());
        if (account == null) return false;

        account.PasswordHash = _passwordHasher.HashPassword(newPassword);
        await db.SaveChangesAsync();

        if (ActiveAccount != null && ActiveAccount.Username.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            ActiveAccount.PasswordHash = account.PasswordHash;
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

        using var db = await _dbContextFactory.CreateDbContextAsync();
        bool isTaken = await db.Users.AnyAsync(a => a.Username.ToLower() == newUsername.ToLower());
        if (isTaken) return false;

        var account = await db.Users.FirstOrDefaultAsync(a => a.Username.ToLower() == oldUsername.Trim().ToLower());
        if (account == null) return false;

        // Since Username is primary key in SQLite, remove and re-insert or update
        db.Users.Remove(account);
        await db.SaveChangesAsync();

        account.Username = newUsername;
        db.Users.Add(account);
        await db.SaveChangesAsync();

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

        using var db = await _dbContextFactory.CreateDbContextAsync();
        var account = await db.Users.FirstOrDefaultAsync(a => a.Username.ToLower() == username.Trim().ToLower());
        if (account == null) return false;

        db.Users.Remove(account);
        await db.SaveChangesAsync();

        if (ActiveAccount != null && ActiveAccount.Username.Equals(username.Trim(), StringComparison.OrdinalIgnoreCase))
        {
            ActiveAccount = null;
        }

        return true;
    }
}
