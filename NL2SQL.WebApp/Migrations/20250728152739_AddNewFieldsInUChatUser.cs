using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsInUChatUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "email",
                table: "chat_user",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.AddColumn<string>(
                name: "photo_url",
                table: "chat_user",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "username",
                table: "chat_user",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "email",
                table: "chat_user");

            migrationBuilder.DropColumn(
                name: "photo_url",
                table: "chat_user");

            migrationBuilder.DropColumn(
                name: "username",
                table: "chat_user");
        }
    }
}
