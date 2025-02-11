using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dokremstroi.Data.Migrations
{
    /// <inheritdoc />
    public partial class ChangeReview : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_Services_ServiceId",
                table: "Reviews");

            migrationBuilder.RenameColumn(
                name: "ServiceId",
                table: "Reviews",
                newName: "UserOrderId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_ServiceId",
                table: "Reviews",
                newName: "IX_Reviews_UserOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_UserOrders_UserOrderId",
                table: "Reviews",
                column: "UserOrderId",
                principalTable: "UserOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_UserOrders_UserOrderId",
                table: "Reviews");

            migrationBuilder.RenameColumn(
                name: "UserOrderId",
                table: "Reviews",
                newName: "ServiceId");

            migrationBuilder.RenameIndex(
                name: "IX_Reviews_UserOrderId",
                table: "Reviews",
                newName: "IX_Reviews_ServiceId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_Services_ServiceId",
                table: "Reviews",
                column: "ServiceId",
                principalTable: "Services",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
