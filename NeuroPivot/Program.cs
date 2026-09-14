using Microsoft.AspNetCore.StaticFiles;
using Microsoft.EntityFrameworkCore;
using NeuroPivot.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

var dbFolder = Path.Combine(builder.Environment.ContentRootPath, "App_Data");
if (!Directory.Exists(dbFolder))
{
    Directory.CreateDirectory(dbFolder);
}
var dbPath = Path.Combine(dbFolder, "neuropivot.db");

builder.Services.AddDbContextFactory<NeuroPivot.Data.NeuroPivotDbContext>(options =>
    options.UseSqlite($"Data Source={dbPath}"));

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
