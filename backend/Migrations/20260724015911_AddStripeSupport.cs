using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace CoachApi.Migrations
{
    /// <inheritdoc />
    public partial class AddStripeSupport : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserEntitlement_Users_UserId",
                table: "UserEntitlement");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserEntitlement",
                table: "UserEntitlement");

            migrationBuilder.RenameTable(
                name: "UserEntitlement",
                newName: "UserEntitlements");

            migrationBuilder.RenameIndex(
                name: "IX_UserEntitlement_UserId",
                table: "UserEntitlements",
                newName: "IX_UserEntitlements_UserId");

            migrationBuilder.AddColumn<string>(
                name: "StripeCustomerId",
                table: "Users",
                type: "nvarchar(max)",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserEntitlements",
                table: "UserEntitlements",
                column: "Id");

            migrationBuilder.CreateTable(
                name: "ProcessedStripeEvents",
                columns: table => new
                {
                    StripeEventId = table.Column<string>(type: "nvarchar(450)", nullable: false),
                    ProcessedAt = table.Column<DateTime>(type: "datetime2", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ProcessedStripeEvents", x => x.StripeEventId);
                });

            migrationBuilder.AddForeignKey(
                name: "FK_UserEntitlements_Users_UserId",
                table: "UserEntitlements",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserEntitlements_Users_UserId",
                table: "UserEntitlements");

            migrationBuilder.DropTable(
                name: "ProcessedStripeEvents");

            migrationBuilder.DropPrimaryKey(
                name: "PK_UserEntitlements",
                table: "UserEntitlements");

            migrationBuilder.DropColumn(
                name: "StripeCustomerId",
                table: "Users");

            migrationBuilder.RenameTable(
                name: "UserEntitlements",
                newName: "UserEntitlement");

            migrationBuilder.RenameIndex(
                name: "IX_UserEntitlements_UserId",
                table: "UserEntitlement",
                newName: "IX_UserEntitlement_UserId");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserEntitlement",
                table: "UserEntitlement",
                column: "Id");

            migrationBuilder.AddForeignKey(
                name: "FK_UserEntitlement_Users_UserId",
                table: "UserEntitlement",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
