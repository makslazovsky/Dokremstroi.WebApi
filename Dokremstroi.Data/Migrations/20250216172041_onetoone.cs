using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace Dokremstroi.Data.Migrations
{
    /// <inheritdoc />
    public partial class onetoone : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Reviews_UserOrders_UserOrderId",
                table: "Reviews");

            migrationBuilder.DropIndex(
                name: "IX_Reviews_UserOrderId",
                table: "Reviews");

            migrationBuilder.AddColumn<int>(
                name: "ReviewId",
                table: "UserOrders",
                type: "int",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_UserOrders_ReviewId",
                table: "UserOrders",
                column: "ReviewId",
                unique: true,
                filter: "[ReviewId] IS NOT NULL");

            migrationBuilder.AddForeignKey(
                name: "FK_UserOrders_Reviews_ReviewId",
                table: "UserOrders",
                column: "ReviewId",
                principalTable: "Reviews",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_UserOrders_Reviews_ReviewId",
                table: "UserOrders");

            migrationBuilder.DropIndex(
                name: "IX_UserOrders_ReviewId",
                table: "UserOrders");

            migrationBuilder.DropColumn(
                name: "ReviewId",
                table: "UserOrders");

            migrationBuilder.CreateIndex(
                name: "IX_Reviews_UserOrderId",
                table: "Reviews",
                column: "UserOrderId");

            migrationBuilder.AddForeignKey(
                name: "FK_Reviews_UserOrders_UserOrderId",
                table: "Reviews",
                column: "UserOrderId",
                principalTable: "UserOrders",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade);
        }
    }
}
