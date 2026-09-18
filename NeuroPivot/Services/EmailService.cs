using System;
using System.Collections.Generic;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text.Json;
using System.Threading.Tasks;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace NeuroPivot.Services;

public interface IEmailService
{
    Task<(bool Success, string Message)> SendSuggestionEmailAsync(string title, string details, string? submitterUsername = null);
}

public class EmailService : IEmailService
{
    private readonly IConfiguration _config;
    private readonly IHttpClientFactory _httpClientFactory;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration config, IHttpClientFactory httpClientFactory, ILogger<EmailService> logger)
    {
        _config = config;
        _httpClientFactory = httpClientFactory;
        _logger = logger;
    }

    public async Task<(bool Success, string Message)> SendSuggestionEmailAsync(string title, string details, string? submitterUsername = null)
    {
        var recipientEmail = _config["EmailSettings:RecipientEmail"] ?? "a9488c179efdda8c378f626668549d3f";
        var senderEmail = _config["EmailSettings:SenderEmail"] ?? "tseas151@gmail.com";
        var userDisplay = string.IsNullOrWhiteSpace(submitterUsername) ? "Anonymous" : submitterUsername;
        var subject = $"[no bs] {title.Trim()}";

        try
        {
            var client = _httpClientFactory.CreateClient();
            client.Timeout = TimeSpan.FromSeconds(15);
            client.DefaultRequestHeaders.Clear();
            client.DefaultRequestHeaders.Add("User-Agent", "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36");
            client.DefaultRequestHeaders.Referrer = new Uri("https://dawidk.it");
            client.DefaultRequestHeaders.Add("Origin", "https://dawidk.it");
            client.DefaultRequestHeaders.Accept.Add(new MediaTypeWithQualityHeaderValue("application/json"));

            var cleanTitle = !string.IsNullOrWhiteSpace(title) ? title.Trim() : "Suggestion";
            var cleanText = !string.IsNullOrWhiteSpace(details) ? details.Trim() : "";

            var payload = new Dictionary<string, string>
            {
                { "_replyto", senderEmail },
                { "_subject", cleanTitle },
                { "_template", "basic" },
                { "_captcha", "false" },
                { "_url", "https://dawidk.it" },
                { "user", userDisplay },
                { "title", cleanTitle },
                { "message", cleanText }
            };

            var endpoint = $"https://formsubmit.co/ajax/{recipientEmail.Trim()}";
            var contentData = new FormUrlEncodedContent(payload);
            var response = await client.PostAsync(endpoint, contentData);

            var responseContent = await response.Content.ReadAsStringAsync();
            _logger.LogInformation("FormSubmit API response: Status {Status}, Content: {Content}", response.StatusCode, responseContent);

            if (response.IsSuccessStatusCode)
            {
                try
                {
                    using var doc = JsonDocument.Parse(responseContent);
                    if (doc.RootElement.TryGetProperty("success", out var successProp))
                    {
                        var isOk = successProp.GetString() == "true" || (successProp.ValueKind == JsonValueKind.True);
                        var msg = doc.RootElement.TryGetProperty("message", out var msgProp) ? msgProp.GetString() : "";

                        if (isOk)
                        {
                            return (true, !string.IsNullOrWhiteSpace(msg) ? msg : "Thank you! Your suggestion has been sent directly to the team.");
                        }
                        else
                        {
                            return (false, !string.IsNullOrWhiteSpace(msg) ? msg : "FormSubmit requires email confirmation.");
                        }
                    }
                }
                catch { }

                return (true, "Thank you! Your suggestion has been sent directly to the team.");
            }

            return (false, $"FormSubmit response ({response.StatusCode}): {responseContent}");
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Failed to submit suggestion via FormSubmit: {Message}", ex.Message);
            return (false, ex.Message);
        }
    }
}
