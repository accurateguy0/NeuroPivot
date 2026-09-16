using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using NeuroPivot.Components;

// Enable Npgsql legacy timestamp behavior for PostgreSQL/Supabase compatibility
// NeuroPivot Application Entrypoint - Standalone Full-Screen Cognitive Bridge Scene (Scene 2.5)
AppContext.SetSwitch("Npgsql.EnableLegacyTimestampBehavior", true);
AppContext.SetSwitch("Npgsql.DisableDateTimeInfinityConversions", true);

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents()
    .AddHubOptions(options =>
    {
        options.MaximumReceiveMessageSize = 10 * 1024 * 1024; // 10MB
    });

builder.Services.Configure<Microsoft.AspNetCore.SignalR.HubOptions>(options =>
{
    options.MaximumReceiveMessageSize = 10 * 1024 * 1024; // 10MB
});

// Configure database provider (PostgreSQL for cloud / Supabase, SQLite for local fallback)
var postgresConn = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? Environment.GetEnvironmentVariable("DATABASE_URL")
    ?? Environment.GetEnvironmentVariable("POSTGRES_CONNECTION");

if (!string.IsNullOrWhiteSpace(postgresConn))
{
    var formattedConn = FormatPostgresConnectionString(postgresConn);
    try
    {
        var b = new Npgsql.NpgsqlConnectionStringBuilder(formattedConn);
        Console.WriteLine($"[Database] Configured PostgreSQL: Host={b.Host}, Port={b.Port}, Database={b.Database}, Username={b.Username}");
    }
    catch (Exception ex)
    {
        Console.WriteLine($"[Database] Warning parsing connection string: {ex.Message}");
    }

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
    var safeName = Path.GetFileName(fileName);
    var filePath = Path.Combine(env.WebRootPath, "sounds", safeName);
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

    // Strip leading "DATABASE_URL=" if user accidentally pasted it into the value field
    if (trimmed.StartsWith("DATABASE_URL=", StringComparison.OrdinalIgnoreCase))
    {
        trimmed = trimmed.Substring("DATABASE_URL=".Length).Trim();
    }

    // Strip "psql " or "psql" prefix if copied from CLI tab
    if (trimmed.StartsWith("psql ", StringComparison.OrdinalIgnoreCase))
    {
        trimmed = trimmed.Substring(5).Trim();
    }

    // Strip surrounding quotes
    if ((trimmed.StartsWith("\"") && trimmed.EndsWith("\"")) ||
        (trimmed.StartsWith("'") && trimmed.EndsWith("'")))
    {
        trimmed = trimmed.Substring(1, trimmed.Length - 2).Trim();
    }

    // Check if it's a postgres:// or postgresql:// URI
    if (trimmed.StartsWith("postgres://", StringComparison.OrdinalIgnoreCase) ||
        trimmed.StartsWith("postgresql://", StringComparison.OrdinalIgnoreCase))
    {
        try
        {
            int schemeEnd = trimmed.IndexOf("://");
            string afterScheme = trimmed.Substring(schemeEnd + 3);

            int lastAt = afterScheme.LastIndexOf('@');
            if (lastAt > 0)
            {
                string userInfo = afterScheme.Substring(0, lastAt);
                string hostAndDb = afterScheme.Substring(lastAt + 1);

                string username = "postgres";
                string password = "";
                int colon = userInfo.IndexOf(':');
                if (colon >= 0)
                {
                    username = userInfo.Substring(0, colon);
                    password = userInfo.Substring(colon + 1);
                }
                else
                {
                    username = userInfo;
                }

                // Strip literal brackets around password if present
                if (password.StartsWith("[") && password.EndsWith("]"))
                {
                    password = password.Substring(1, password.Length - 2);
                }

                string hostAndPort = hostAndDb;
                string database = "postgres";
                int slash = hostAndDb.IndexOf('/');
                if (slash >= 0)
                {
                    hostAndPort = hostAndDb.Substring(0, slash);
                    database = hostAndDb.Substring(slash + 1);
                    int queryIdx = database.IndexOf('?');
                    if (queryIdx >= 0)
                    {
                        database = database.Substring(0, queryIdx);
                    }
                }

                string host = hostAndPort;
                int port = 5432;
                int portColon = hostAndPort.IndexOf(':');
                if (portColon >= 0)
                {
                    host = hostAndPort.Substring(0, portColon);
                    if (int.TryParse(hostAndPort.Substring(portColon + 1), out int p))
                    {
                        port = p;
                    }
                }

                var builder = new Npgsql.NpgsqlConnectionStringBuilder
                {
                    Host = host,
                    Port = port,
                    Database = string.IsNullOrEmpty(database) ? "postgres" : database,
                    Username = Uri.UnescapeDataString(username),
                    Password = Uri.UnescapeDataString(password),
                    SslMode = Npgsql.SslMode.Require
                };

                return builder.ConnectionString;
            }
        }
        catch
        {
            // Fall through
        }
    }

    // Standard ADO.NET format: Host=...;Database=...
    try
    {
        var builder = new Npgsql.NpgsqlConnectionStringBuilder(trimmed);
        if (!trimmed.Contains("SSL Mode", StringComparison.OrdinalIgnoreCase))
        {
            builder.SslMode = Npgsql.SslMode.Require;
        }
        return builder.ConnectionString;
    }
    catch
    {
        return trimmed;
    }
}
