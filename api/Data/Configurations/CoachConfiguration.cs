using CoachApi.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoachApi.Data.Configurations
{
    public class CoachConfiguration : IEntityTypeConfiguration<Coach>
    {
        public void Configure(EntityTypeBuilder<Coach> builder)
        {
            builder.HasKey(x => new { x.UserId, x.CoachingGroupId });

            builder.HasOne(x => x.User)
                .WithMany()
                .HasForeignKey(x => x.UserId);

            builder.HasOne(x => x.Group)
                .WithMany(g => g.Coaches)
                .HasForeignKey(x => x.CoachingGroupId);
        }
    }
}
