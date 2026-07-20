using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoachApi.Migrations
{
    /// <inheritdoc />
    public partial class the_next_one : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<Guid>(
                name: "SelectedMembershipId",
                table: "Users",
                type: "uniqueidentifier",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "Id",
                table: "Memberships",
                type: "uniqueidentifier",
                nullable: false,
                defaultValue: new Guid("00000000-0000-0000-0000-000000000000"));
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "SelectedMembershipId",
                table: "Users");

            migrationBuilder.DropColumn(
                name: "Id",
                table: "Memberships");
        }
    }
}
