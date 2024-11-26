using Dokremstroi.Data.Models;
using Dokremstroi.Data.Repositories;
using Dokremstroi.Services.Managers;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using System.Text;

var builder = WebApplication.CreateBuilder(args);

// Конфигурация JWT
var jwtKey = builder.Configuration["Jwt:Key"];
var jwtIssuer = builder.Configuration["Jwt:Issuer"];
var jwtAudience = builder.Configuration["Jwt:Audience"];

builder.Services.AddAuthentication(options =>
{
    options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
    options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
})
.AddJwtBearer(options =>
{
    options.TokenValidationParameters = new TokenValidationParameters
    {
        ValidateIssuer = true,
        ValidateAudience = true,
        ValidateLifetime = true,
        ValidateIssuerSigningKey = true,
        ValidIssuer = jwtIssuer,
        ValidAudience = jwtAudience,
        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
    };
});

// Add services to the container.
builder.Services.AddScoped<IRepository<Service>, ServiceRepository>();
builder.Services.AddScoped<IRepository<CompletedOrder>, CompletedOrderRepository>();
builder.Services.AddScoped<IRepository<UserOrder>, UserOrderRepository>();
builder.Services.AddScoped<IRepository<Review>, ReviewRepository>();
builder.Services.AddScoped<IRepository<ContactInfo>, ContactInfoRepository>();
builder.Services.AddScoped<IRepository<User>, UserRepository>();

builder.Services.AddScoped<IManager<Service>, ServiceManager>();
builder.Services.AddScoped<IManager<CompletedOrder>, CompletedOrderManager>();
builder.Services.AddScoped<IManager<UserOrder>, UserOrderManager>();
builder.Services.AddScoped<IManager<Review>, ReviewManager>();
builder.Services.AddScoped<IManager<ContactInfo>, ContactInfoManager>();
builder.Services.AddScoped<IManager<User>, UserManager>();
builder.Services.AddScoped<IUserManager, UserManager>();

// Добавляем CORS
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowAngularApp", policy =>
    {
        policy.WithOrigins("https://localhost:4200") // Разрешить ваш Angular-приложение
              .AllowAnyMethod() // Разрешить все HTTP-методы (GET, POST, PUT, DELETE и т.д.)
              .AllowAnyHeader(); // Разрешить любые заголовки
    });
});

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddDbContext<DokremstroiContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("DefaultConnection")));

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

// Применяем CORS
app.UseCors("AllowAngularApp");

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("/index.html");

app.Run();
