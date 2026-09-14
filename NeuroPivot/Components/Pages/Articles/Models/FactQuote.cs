namespace NeuroPivot.Components.Pages.Articles.Models;

public class QuoteReferenceItem
{
    public string Label { get; set; } = "";
    public string Url { get; set; } = "";
}

public class ReferenceLink : QuoteReferenceItem
{
}

public class FactQuote
{
    public string Goal { get; set; } = "habits";
    public string Headline { get; set; } = "";
    public string Body { get; set; } = "";
    public string Reference { get; set; } = "";
    public string? ReferenceUrl { get; set; } = null;
    public List<QuoteReferenceItem>? AdditionalReferences { get; set; } = null;
}
