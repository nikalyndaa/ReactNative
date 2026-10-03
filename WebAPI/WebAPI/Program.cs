using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using WebAPI.Data.Entities;

var builder = WebApplication.CreateBuilder(args);

builder.Services.AddControllers();

builder.Services.AddDbContext<ApplicationContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

builder.Services.AddIdentity<UserEntity, RoleEntity>(options =>
{
    options.Password.RequireDigit = true;
    options.Password.RequireLowercase = false;
    options.Password.RequireUppercase = false;
    options.Password.RequireNonAlphanumeric = false;
})
.AddEntityFrameworkStores<ApplicationContext>()
.AddDefaultTokenProviders();

builder.Services.AddCors(opt => opt.AddDefaultPolicy(p =>
    p.AllowAnyOrigin().AllowAnyHeader().AllowAnyMethod()));

builder.Services.AddSwaggerGen();

var app = builder.Build();

app.UseSwagger();
app.UseSwaggerUI();

app.UseCors();
app.UseAuthorization();
app.MapControllers();

using (var scope = app.Services.CreateScope())
{
    var services = scope.ServiceProvider;

    var context = services.GetRequiredService<ApplicationContext>();
    await context.Database.MigrateAsync();

    var userManager = services.GetRequiredService<UserManager<UserEntity>>();
    var adminEmail = "admin@gmail.com";

    if (await userManager.FindByEmailAsync(adminEmail) == null)
    {
        var newAdmin = new UserEntity
        {
            UserName = adminEmail,
            Email = adminEmail,
            EmailConfirmed = true,
            FirstName = "Admin",
            LastName = "System"
        };
        var createResult = await userManager.CreateAsync(newAdmin, "123456");

        if (createResult.Succeeded)
            Console.WriteLine("Тестовий адміністратор успішно створений!");
        else
            Console.WriteLine("Помилка: " + string.Join("; ", createResult.Errors.Select(e => e.Description)));
    }
}

app.Run();