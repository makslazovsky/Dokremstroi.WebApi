using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dokremstroi.Data.Migrations
{
    /// <inheritdoc />
    public partial class init1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserOrderServices",
                table: "UserOrderServices");

            migrationBuilder.DropIndex(
                name: "IX_UserOrderServices_UserOrderId",
                table: "UserOrderServices");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserOrderServices",
                table: "UserOrderServices",
                columns: new[] { "UserOrderId", "ServiceId" });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropPrimaryKey(
                name: "PK_UserOrderServices",
                table: "UserOrderServices");

            migrationBuilder.AddPrimaryKey(
                name: "PK_UserOrderServices",
                table: "UserOrderServices",
                column: "Id");

            migrationBuilder.CreateIndex(
                name: "IX_UserOrderServices_UserOrderId",
                table: "UserOrderServices",
                column: "UserOrderId");
        }
    }
}
