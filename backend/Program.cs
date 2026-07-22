using System.Text.Json.Serialization;
using CoachApi.API.Auth;
using CoachApi.Application.Services;
using CoachApi.Infrastructure.Data;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Protocols;
using Microsoft.IdentityModel.Tokens;
using WorkOS;

var builder = WebApplication.CreateBuilder(args);

// Configuration
var workOsApiKey = builder.Configuration["WorkOS:ApiKey"]
    ?? throw new InvalidOperationException("WorkOS API key not configured");

var workOsClientId = builder.Configuration["WorkOS:ClientId"]
    ?? throw new InvalidOperationException("WorkOS client ID not configured");

var connectionString = builder.Configuration.GetConnectionString("DefaultConnection")
    ?? throw new InvalidOperationException("Database connection string not configured");

// WorkOS SDK client, used both for JIT user provisioning and available for any future WorkOS API calls
builder.Services.AddSingleton(new WorkOSClient(new WorkOSOptions
{
    ApiKey = workOsApiKey,
    ClientId = workOsClientId
}));

// Authentication & Authorization
var jwksConfigManager = new ConfigurationManager<JsonWebKeySet>(
    $"https://api.workos.com/sso/jwks/{workOsClientId}",
    new WorkOsJsonWebKeySetRetriever(),
    new HttpDocumentRetriever());

builder.Services
    .AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.MapInboundClaims = false; 
        
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidIssuer = $"https://api.workos.com/user_management/{workOsClientId}",
            ValidateAudience = false, //Authkit tokens dont have an audience claim
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            IssuerSigningKeyResolver = (token, securityToken, kid, parameters) =>
                jwksConfigManager.GetConfigurationAsync().GetAwaiter().GetResult().GetSigningKeys(),
        };

        options.Events = new JwtBearerEvents
        {
            OnTokenValidated = context =>
            {
                var tokenClientId = context.Principal?.FindFirst("client_id")?.Value;
                if (tokenClientId != workOsClientId) context.Fail("Token was not issued for this application.");

                return Task.CompletedTask;
            }
        };
    });

builder.Services.AddAuthorization();
builder.Services.AddScoped<IClaimsTransformation, WorkOsClaimsTransformation>();

// Database
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseSqlServer(connectionString, sqlOptions => sqlOptions.EnableRetryOnFailure()));

// Application Services
builder.Services.AddScoped<AuthService>();
builder.Services.AddScoped<GroupService>();
builder.Services.AddScoped<UserService>();
builder.Services.AddScoped<MembershipService>();

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.ReferenceHandler =
            ReferenceHandler.IgnoreCycles;

        options.JsonSerializerOptions.Converters.Add(
            new JsonStringEnumConverter());
    });

// CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngular", policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

// OpenAPI
builder.Services.AddOpenApi();

var app = builder.Build();

//Apply migrations automatically on startup
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
    db.Database.Migrate();
}

// Middleware
app.UseCors("AllowAngular");
app.Use(async (context, next) =>
{
    context.Response.Headers.Append(
        "Content-Security-Policy",
        "script-src 'self' 'unsafe-eval';"
    );

    await next();
});

app.UseAuthentication();
app.UseAuthorization();

// Dev only features
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

//Endpoints
app.MapControllers();

app.UseStaticFiles();

app.Run();