using CoachApi.Infrastructure.Data;

namespace CoachApi.Application.Services;

public class UserService(IConfiguration config, AppDbContext context)
{
    private readonly IConfiguration _config = config;
    private readonly AppDbContext _db = context;

    
}