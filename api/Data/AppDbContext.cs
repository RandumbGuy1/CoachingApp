using Microsoft.EntityFrameworkCore;
using CoachApi.Entities;
using CoachApi.Data.Configurations;

namespace CoachApi.Data
{
    public class AppDbContext(DbContextOptions<AppDbContext> options) : DbContext(options)
    {
        public DbSet<User> Users => Set<User>();
        public DbSet<RefreshToken> RefreshTokens => Set<RefreshToken>();
        public DbSet<CoachingGroup> CoachingGroups => Set<CoachingGroup>();
        public DbSet<GroupMembership> Memberships => Set<GroupMembership>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new ProfileConfiguration());
            modelBuilder.ApplyConfiguration(new MembershipConfiguration());
        }
    }
}
