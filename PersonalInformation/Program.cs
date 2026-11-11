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

// Lets the contact form read the visitor's IP address for rate limiting
builder.Services.AddHttpContextAccessor();

builder.Services.AddHttpClient("Resend", client =>
{
    client.BaseAddress = new Uri("https://api.resend.com/");
});

builder.Services.AddHttpClient("Groq", client =>
{
    // We are NOT setting a BaseAddress here. We will use the full URL in the request.
    client.Timeout = TimeSpan.FromSeconds(20);
});
var app = builder.Build();

// Security headers. This runs first so every response gets them,
// including the WebOptimizer bundles and static files.
app.Use(async (ctx, next) =>
{
    var h = ctx.Response.Headers;
    h["X-Content-Type-Options"] = "nosniff";
    h["X-Frame-Options"] = "DENY";
    h["Referrer-Policy"] = "strict-origin-when-cross-origin";
    h["Permissions-Policy"] = "camera=(), microphone=(), geolocation=()";

    // CSP is skipped while developing because it blocks Visual Studio's Browser Link and Hot Reload.
    if (!app.Environment.IsDevelopment())
    {
        h["Content-Security-Policy"] =
            "default-src 'self'; " +
            "script-src 'self' 'unsafe-inline'; " +
            "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; " +
            "font-src https://fonts.gstatic.com; " +
            "img-src 'self' data: https:; " +
            "connect-src 'self' wss: https:; " +
            "frame-ancestors 'none'; base-uri 'self'; form-action 'self'";
    }

    await next();
});

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
    app.UseHsts();   // already here, so I did not add a second one
}
app.UseStatusCodePagesWithReExecute("/not-found", createScopeForStatusCodePages: true);
app.UseHttpsRedirection();

app.UseAntiforgery();

app.MapStaticAssets();
app.MapRazorComponents<App>()
    .AddInteractiveServerRenderMode();

app.Run();