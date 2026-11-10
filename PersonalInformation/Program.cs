using Microsoft.AspNetCore.HttpOverrides;
using PersonalInformation.Components;
using PersonalInformation.Services;
using WebOptimizer;

var builder = WebApplication.CreateBuilder(args);

// Keep this exactly like this. Remove the WebAssembly line.
builder.Services.AddRazorComponents()
    .AddInteractiveServerComponents();

// Add WebOptimizer for bundling and minification
builder.Services.AddWebOptimizer(pipeline =>
{
    // Bundle all CSS files into one
    pipeline.AddCssBundle("/css/bundle.css",
        "wwwroot/css/tokens.css",
        "wwwroot/css/base.css",
        "wwwroot/css/animations.css",
        "wwwroot/css/components.css",
        "wwwroot/css/theme.css");

    // Bundle all JS files into one
    pipeline.AddJavaScriptBundle("/js/bundle.js",
        "wwwroot/js/site.js",
        "wwwroot/js/home.js");
});

builder.Services.AddScoped<ThemeService>();
builder.Services.AddSingleton<BlogService>();
builder.Configuration.AddUserSecrets<Program>();

builder.Services.AddHttpClient("Resend", client =>
{
    client.BaseAddress = new Uri("https://api.resend.com/");
});

builder.Services.AddHttpClient("Groq", client =>
{
    client.BaseAddress = new Uri("https://api.groq.com/openai/v1/");
    client.Timeout = TimeSpan.FromSeconds(20);
});

var app = builder.Build();

// Use WebOptimizer middleware
app.UseWebOptimizer();

var forwardedHeaderOptions = new ForwardedHeadersOptions
{
    ForwardedHeaders = ForwardedHeaders.XForwardedFor | ForwardedHeaders.XForwardedProto,
    ForwardLimit = null
};
forwardedHeaderOptions.KnownIPNetworks.Clear();
forwardedHeaderOptions.KnownProxies.Clear();
app.UseForwardedHeaders(forwardedHeaderOptions);

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error", createScopeForErrors: true);
    app.UseHsts();
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();