using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using NeuroPivot.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Configure database provider (PostgreSQL for cloud / Supabase, SQLite for local fallback)
var postgresConn = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? Environment.GetEnvironmentVariable("POSTGRES_CONNECTION");

if (!string.IsNullOrWhiteSpace(postgresConn))
{
    var formattedConn = FormatPostgresConnectionString(postgresConn);
    builder.Services.AddDbContextFactory<NeuroPivot.Data.NeuroPivotDbContext>(options =>
        options.UseNpgsql(formattedConn));
}
else
{
    var dbFolder = Path.Combine(builder.Environment.ContentRootPath, "App_Data");
    if (!Directory.Exists(dbFolder))
    {
        Directory.CreateDirectory(dbFolder);
    }
    var dbPath = Path.Combine(dbFolder, "neuropivot.db");

    builder.Services.AddDbContextFactory<NeuroPivot.Data.NeuroPivotDbContext>(options =>
        options.UseSqlite($"Data Source={dbPath}"));
}

builder.Services.AddSingleton<NeuroPivot.Services.IPasswordHasherService, NeuroPivot.Services.PasswordHasherService>();
builder.Services.AddScoped<NeuroPivot.Services.LocalStorageService>();
builder.Services.AddScoped<NeuroPivot.Services.AccountService>();
builder.Services.AddScoped<NeuroPivot.Services.AppState>();
builder.Services.AddScoped<NeuroPivot.Services.HabitService>();
builder.Services.AddScoped<NeuroPivot.Services.SleepService>();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}

app.UseHttpsRedirection();

var provider = new FileExtensionContentTypeProvider();
provider.Mappings[".mp4"] = "video/mp4";
provider.Mappings[".m4a"] = "audio/mp4";
provider.Mappings[".mp3"] = "audio/mpeg";
provider.Mappings[".wav"] = "audio/wav";
provider.Mappings[".webm"] = "video/webm";
provider.Mappings[".ogg"] = "audio/ogg";
provider.Mappings[".aac"] = "audio/aac";

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider,
    ServeUnknownFileTypes = true
});

app.UseAntiforgery();

app.MapGet("/sounds/{fileName}", (string fileName, IWebHostEnvironment env) =>
{
    var filePath = Path.Combine(env.WebRootPath, "sounds", fileName);
    if (!File.Exists(filePath)) return Results.NotFound();

    var ext = Path.GetExtension(fileName).ToLowerInvariant();
    var contentType = ext switch
    {
        ".m4a" => "audio/mp4",
        ".mp4" => "video/mp4",
        ".mp3" => "audio/mpeg",
        ".wav" => "audio/wav",
        ".webm" => "video/webm",
        ".ogg" => "audio/ogg",
        ".aac" => "audio/aac",
        _ => "application/octet-stream"
    };

    return Results.File(filePath, contentType: contentType, enableRangeProcessing: true);
});

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();

static string FormatPostgresConnectionString(string connectionString)
{
    if (string.IsNullOrWhiteSpace(connectionString)) return connectionString;

    var trimmed = connectionString.Trim();
    if (trimmed.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
        trimmed.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        try
        {
            var uri = new Uri(trimmed);
            var userInfo = uri.UserInfo.Split(':');
            var username = userInfo.Length > 0 ? Uri.UnescapeDataString(userInfo[0]) : "";
            var password = userInfo.Length > 1 ? Uri.UnescapeDataString(userInfo[1]) : "";
            var port = uri.Port > 0 ? uri.Port : 5432;
            var database = uri.AbsolutePath.TrimStart('/');

            return $"Host={uri.Host};Port={port};Database={database};Username={username};Password={password};SSL Mode=Require;Trust Server Certificate=true;";
        }
        catch
        {
            return connectionString;
        }
    }

    if (!trimmed.Contains("SSL Mode", StringComparison.OrdinalIgnoreCase))
    {
        trimmed += ";SSL Mode=Require;Trust Server Certificate=true;";
    }

    return trimmed;
}
