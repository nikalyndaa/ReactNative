using Microsoft.AspNetCore.Identity;
using System.Text.Json;
using System.Text;
using WebAPI.Constants;
using WebAPI.Data.Entities;
using WebAPI.Models.Seeder;
using Microsoft.EntityFrameworkCore;

namespace WebAPI.Extensions
{
    public static class DbSeeder
    {
        public static async Task SeedData(this WebApplication webApplication)
        {
            using var scope = webApplication.Services.CreateScope();
            //Цей об'єкт буде верта посилання на конткетс, який зараєстрвоано в Progran.cs
            var context = scope.ServiceProvider.GetRequiredService<ApplicationContext>();
            var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<RoleEntity>>();
            var userManager = scope.ServiceProvider.GetRequiredService<UserManager<UserEntity>>();

            context.Database.Migrate();

            if (!context.Roles.Any())
            {
                foreach (var roleName in Roles.ListRoles())
                {
                    await roleManager.CreateAsync(new RoleEntity { Name = roleName });
                }
            }

            if (!context.Users.Any())
            {
                var curDir = Directory.GetCurrentDirectory();
                var jsonFile = Path.Combine(curDir, "Helpers", "JsonData", "Users.json");
                if (File.Exists(jsonFile))
                {
                    var jsonData = await File.ReadAllTextAsync(jsonFile, encoding: Encoding.UTF8);
                    try
                    {
                        var users = JsonSerializer.Deserialize<List<SeederUserModel>>(jsonData);
                        foreach (var user in users)
                        {
                            var entity = new UserEntity
                            {
                                FirstName = user.FirstName,
                                LastName = user.LastName,
                                Email = user.Email,
                                UserName = user.Email,
                                Image = user.Image,
                            };
                            var result = await userManager.CreateAsync(entity, user.Password);
                            if (result.Succeeded)
                            {
                                foreach (var role in user.Roles)
                                {
                                    await userManager.AddToRoleAsync(entity, role);
                                }

                            }
                        }
                    }
                    catch (Exception ex)
                    {
                        Console.WriteLine("Викникла помилка при Seed Users ", ex.Message);
                    }
                }
            }
        }
    }
}
