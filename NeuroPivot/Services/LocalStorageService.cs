using Microsoft.JSInterop;
using System.Text.Json;

namespace NeuroPivot.Services;

public class LocalStorageService
{
    private readonly IJSRuntime _jsRuntime;
    private static readonly JsonSerializerOptions JsonOptions = new()
    {
        PropertyNameCaseInsensitive = true,
        IncludeFields = true
    };

    public LocalStorageService(IJSRuntime jsRuntime)
    {
        _jsRuntime = jsRuntime;
    }

    public async ValueTask SetItemAsync<T>(string key, T value)
    {
        try
        {
            var json = JsonSerializer.Serialize(value, JsonOptions);
            await _jsRuntime.InvokeVoidAsync("localStorage.setItem", key, json);
        }
        catch
        {
            // Fail silently or handle server-side pre-rendering exceptions
        }
    }

    public async ValueTask<T?> GetItemAsync<T>(string key)
    {
        try
        {
            var json = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", key);
            if (string.IsNullOrEmpty(json))
                return default;
            return JsonSerializer.Deserialize<T>(json, JsonOptions);
        }
        catch
        {
            return default;
        }
    }

    public async ValueTask RemoveItemAsync(string key)
    {
        try
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", key);
        }
        catch
        {
        }
    }
}
