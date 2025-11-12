using ContosoUniversity.Data;
using ContosoUniversity.Middleware;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Models;
using System.Reflection;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddRazorPages();

builder.Services.AddDbContext<SchoolContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SchoolContext")));

builder.Services.AddDatabaseDeveloperPageExceptionFilter();

// Add API Controllers
builder.Services.AddControllers();

// Configure CORS - T006
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowReactApp", policy =>
    {
        policy.WithOrigins("http://localhost:5173", "http://localhost:3000")
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials()
              .WithExposedHeaders("ETag");
    });
});

// Configure Swagger/OpenAPI - T007
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo
    {
        Title = "Contoso University API",
        Version = "v1",
        Description = "REST API for Contoso University student management system",
        Contact = new OpenApiContact
        {
            Name = "Contoso University Support",
            Email = "support@contoso.edu"
        }
    });

    // Enable XML comments for better API documentation - T007
    var xmlFile = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
    var xmlPath = Path.Combine(AppContext.BaseDirectory, xmlFile);
    if (File.Exists(xmlPath))
    {
        options.IncludeXmlComments(xmlPath);
    }
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}
else
{
    app.UseDeveloperExceptionPage();
    app.UseMigrationsEndPoint();
}

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<SchoolContext>();

    context.Database.Migrate();

    DbInitializer.Initialize(context);
}

app.UseHttpsRedirection();
app.UseStaticFiles();

// Register error handling middleware - T016
app.UseMiddleware<ErrorHandlingMiddleware>();

app.UseRouting();

// Enable CORS - must be after UseRouting, before UseAuthorization - T006
app.UseCors("AllowReactApp");

app.UseAuthorization();

// Enable Swagger UI - T007
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI(options =>
    {
        options.SwaggerEndpoint("/swagger/v1/swagger.json", "Contoso University API v1");
        options.RoutePrefix = "swagger";
    });
}

// Map API controllers
app.MapControllers();

app.MapRazorPages();

app.Run();
