using System;
using System.Collections.Generic;
using System.Text.Json;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.ChangeTracking;
using NeuroPivot.Services;

namespace NeuroPivot.Data;

public class NeuroPivotDbContext : DbContext
{
    private static readonly JsonSerializerOptions JsonOpts = new()
    {
        PropertyNameCaseInsensitive = true,
        IncludeFields = true
    };

    public DbSet<UserAccount> Users => Set<UserAccount>();

    public NeuroPivotDbContext(DbContextOptions<NeuroPivotDbContext> options) : base(options)
    {
    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        var user = modelBuilder.Entity<UserAccount>();

        user.HasKey(u => u.Username);
        user.Property(u => u.Username).HasMaxLength(100).IsRequired();
        user.Property(u => u.PasswordHash).IsRequired();

        // Ignore cleartext password property in database
        user.Ignore(u => u.Password);

        // JSON Value Converters with ValueComparers for complex types
        var habitsComparer = new ValueComparer<List<HabitItem>>(
            (c1, c2) => JsonSerializer.Serialize(c1, JsonOpts) == JsonSerializer.Serialize(c2, JsonOpts),
            c => c == null ? 0 : JsonSerializer.Serialize(c, JsonOpts).GetHashCode(),
            c => c == null ? new List<HabitItem>() : JsonSerializer.Deserialize<List<HabitItem>>(JsonSerializer.Serialize(c, JsonOpts), JsonOpts)!
        );

        user.Property(u => u.Habits)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOpts),
                v => string.IsNullOrEmpty(v) ? new List<HabitItem>() : JsonSerializer.Deserialize<List<HabitItem>>(v, JsonOpts) ?? new List<HabitItem>()
            )
            .Metadata.SetValueComparer(habitsComparer);

        var moodComparer = new ValueComparer<List<DailyMoodEntry>>(
            (c1, c2) => JsonSerializer.Serialize(c1, JsonOpts) == JsonSerializer.Serialize(c2, JsonOpts),
            c => c == null ? 0 : JsonSerializer.Serialize(c, JsonOpts).GetHashCode(),
            c => c == null ? new List<DailyMoodEntry>() : JsonSerializer.Deserialize<List<DailyMoodEntry>>(JsonSerializer.Serialize(c, JsonOpts), JsonOpts)!
        );

        user.Property(u => u.DailyMoodLogs)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOpts),
                v => string.IsNullOrEmpty(v) ? new List<DailyMoodEntry>() : JsonSerializer.Deserialize<List<DailyMoodEntry>>(v, JsonOpts) ?? new List<DailyMoodEntry>()
            )
            .Metadata.SetValueComparer(moodComparer);

        var relapseComparer = new ValueComparer<List<RelapseEntry>>(
            (c1, c2) => JsonSerializer.Serialize(c1, JsonOpts) == JsonSerializer.Serialize(c2, JsonOpts),
            c => c == null ? 0 : JsonSerializer.Serialize(c, JsonOpts).GetHashCode(),
            c => c == null ? new List<RelapseEntry>() : JsonSerializer.Deserialize<List<RelapseEntry>>(JsonSerializer.Serialize(c, JsonOpts), JsonOpts)!
        );

        user.Property(u => u.RelapseLogs)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOpts),
                v => string.IsNullOrEmpty(v) ? new List<RelapseEntry>() : JsonSerializer.Deserialize<List<RelapseEntry>>(v, JsonOpts) ?? new List<RelapseEntry>()
            )
            .Metadata.SetValueComparer(relapseComparer);

        var favComparer = new ValueComparer<List<int>>(
            (c1, c2) => JsonSerializer.Serialize(c1, JsonOpts) == JsonSerializer.Serialize(c2, JsonOpts),
            c => c == null ? 0 : JsonSerializer.Serialize(c, JsonOpts).GetHashCode(),
            c => c == null ? new List<int>() : JsonSerializer.Deserialize<List<int>>(JsonSerializer.Serialize(c, JsonOpts), JsonOpts)!
        );

        user.Property(u => u.FavoriteArchiveDays)
            .HasConversion(
                v => JsonSerializer.Serialize(v, JsonOpts),
                v => string.IsNullOrEmpty(v) ? new List<int>() : JsonSerializer.Deserialize<List<int>>(v, JsonOpts) ?? new List<int>()
            )
            .Metadata.SetValueComparer(favComparer);
    }
}
