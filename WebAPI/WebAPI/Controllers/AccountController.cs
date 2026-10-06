using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using WebAPI.Data.Entities;
using WebAPI.Interfaces;
using WebAPI.Models.Account;

namespace WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AccountController(UserManager<UserEntity> userManager,
    IJwtTokenService jwtTokenService
    ) : ControllerBase
{
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginModel model)
    {
        var user = await userManager.FindByEmailAsync(model.Email);

        if (user != null || await userManager.CheckPasswordAsync(user, model.Password))
        {
            var token = await jwtTokenService.CreateTokenAsync(user);
            return Ok(new {Token = token});
        }
        return Unauthorized(new { message = "Невірний email або пароль" });

        
    }
}