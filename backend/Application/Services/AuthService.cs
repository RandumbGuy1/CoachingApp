using CoachApi.Application.Contracts.Requests;
using CoachApi.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;
using CoachApi.Application.Contracts.Dtos;

namespace CoachApi.Application.Services;

public class AuthService(AppDbContext _db)
{    
    public async Task<UserDto> SaveUserAsync(SaveUserRequest request, Guid userId)
    {
        var user = await _db.Users.FirstOrDefaultAsync(user => user.Id == userId) 
            ?? throw new InvalidOperationException("User not found");
            
        if (!string.IsNullOrEmpty(request.Username))
        {
            if (await _db.Users.AnyAsync(u => u.Username == request.Username))
                throw new InvalidOperationException("Username already taken");

            user.Username = request.Username;
        }

        if (request.Tier.HasValue)
            user.Tier = request.Tier.Value;

        await _db.SaveChangesAsync();

        return new UserDto
        {
            Id = user.Id,
            Username = user.Username,
            Email = user.Email,
            Tier = user.Tier,
        };
    }
}