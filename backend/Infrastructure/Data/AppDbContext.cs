using Microsoft.EntityFrameworkCore;
using CoachApi.Domain.Entities;
using CoachApi.Infrastructure.Data.Configurations;

namespace CoachApi.Infrastructure.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
{
    public DbSet<User> Users => Set<User>();
    public DbSet<UserProfile> UserProfiles => Set<UserProfile>();
    public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
    public DbSet<CoachingGroup> CoachingGroups => Set<CoachingGroup>();
    public DbSet<FormResponse> FormResponses => Set<FormResponse>();
    public DbSet<UserStat> UserStats => Set<UserStat>();
    public DbSet<WorkoutLog> WorkoutLogs => Set<WorkoutLog>();
    public DbSet<WorkoutSet> WorkoutSets => Set<WorkoutSet>();
    public DbSet<GroupMembership> Memberships => Set<GroupMembership>();
    public DbSet<JoinRequest> PendingMemberships => Set<JoinRequest>();

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        //User tier enum
        modelBuilder.Entity<User>()
            .Property(u => u.Tier)
            .HasConversion<string>();

        modelBuilder.ApplyConfiguration(new ProfileConfiguration());
        modelBuilder.ApplyConfiguration(new MembershipConfiguration());
    }
}

