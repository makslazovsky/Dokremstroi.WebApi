using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.FileProviders;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// ������������ JWT
var jwtKey = builder.Configuration["Jwt:Key"]; // ��������� ���� �� appsettings.json
var jwtIssuer = builder.Configuration["Jwt:Issuer"];

builder.Services.AddDbContext<DokremstroiContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
}).AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtIssuer,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// ����������� ������������
builder.Services.AddScoped(typeof(IRepository<>), typeof(Repository<>));

// ����������� ����������
builder.Services.AddScoped(typeof(IManager<>), typeof(ManagerBase<>));
builder.Services.AddScoped<IUserManager, UserManager>();
builder.Services.AddScoped<ICompletedOrderManager, CompletedOrderManager>();
builder.Services.AddScoped<UserOrderServiceManager>(); // ���������
builder.Services.AddScoped<UserOrderManager>(); // ���������
//builder.Services.AddScoped<IReviewManager, ReviewManager>();

// ��������� CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("https://localhost:4200") // ��������� ��� Angular-����������
              .AllowAnyMethod() // ��������� ��� HTTP-������ (GET, POST, PUT, DELETE � �.�.)
              .AllowAnyHeader(); // ��������� ����� ���������
    });
});



builder.Services.AddControllers().AddJsonOptions(options =>
{
    options.JsonSerializerOptions.ReferenceHandler = System.Text.Json.Serialization.ReferenceHandler.IgnoreCycles;
});
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new Microsoft.OpenApi.Models.OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = Microsoft.OpenApi.Models.SecuritySchemeType.ApiKey,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = Microsoft.OpenApi.Models.ParameterLocation.Header,
        Description = "������� ����� JWT � �������: Bearer {��� �����}"
    });

    options.AddSecurityRequirement(new Microsoft.OpenApi.Models.OpenApiSecurityRequirement
    {
        {
            new Microsoft.OpenApi.Models.OpenApiSecurityScheme
            {
                Reference = new Microsoft.OpenApi.Models.OpenApiReference
                {
                    Type = Microsoft.OpenApi.Models.ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
});



builder.Services.AddAuthorization(); // ��������� ��������� �����������

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// �������� ��� ��� ������������ ������ �� ����� uploads
var uploadsPath = Path.Combine(builder.Environment.ContentRootPath, "uploads");
app.UseStaticFiles(new StaticFileOptions
{
    FileProvider = new PhysicalFileProvider(uploadsPath),
    RequestPath = "/uploads"
});


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// ��������� CORS
app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
