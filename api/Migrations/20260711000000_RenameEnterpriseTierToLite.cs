using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoachApi.Migrations
{
    /// <inheritdoc />
    public partial class RenameEnterpriseTierToLite : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Users SET Tier = 'Lite' WHERE Tier = 'Enterprise'");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("UPDATE Users SET Tier = 'Enterprise' WHERE Tier = 'Lite'");
        }
    }
}
