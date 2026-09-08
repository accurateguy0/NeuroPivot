using Microsoft.AspNetCore.StaticFiles;
using NeuroPivot.Components;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

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

app.UseStaticFiles(new StaticFileOptions
{
    ContentTypeProvider = provider
});

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();
