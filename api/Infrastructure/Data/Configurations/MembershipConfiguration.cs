using CoachApi.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace CoachApi.Infrastructure.Data.Configurations
{
    public class MembershipConfiguration : IEntityTypeConfiguration<GroupMembership>
    {
        public void Configure(EntityTypeBuilder<GroupMembership> builder)
        {
            builder.Property(x => x.Role)
                .HasConversion<string>()
                .IsRequired();

            builder.HasKey(x => new { x.UserId, x.CoachingGroupId });

            builder.HasOne(x => x.User)
                .WithMany(u => u.Memberships)
                .HasForeignKey(x => x.UserId);

            builder.HasOne(x => x.Group)
                .WithMany(g => g.Members)
                .HasForeignKey(x => x.CoachingGroupId);
        }
    }
}
