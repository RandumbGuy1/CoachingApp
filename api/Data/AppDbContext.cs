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
        public DbSet<Coach> Coaches => Set<Coach>();
        public DbSet<Client> Clients => Set<Client>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.ApplyConfiguration(new CoachConfiguration());
            modelBuilder.ApplyConfiguration(new ClientConfiguration());
        }
    }
}
