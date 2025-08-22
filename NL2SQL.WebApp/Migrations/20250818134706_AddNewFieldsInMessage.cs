using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsInMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "previous_message_id",
                table: "message",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "text_query",
                table: "message",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "type",
                table: "message",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "previous_message_id",
                table: "message");

            migrationBuilder.DropColumn(
                name: "text_query",
                table: "message");

            migrationBuilder.DropColumn(
                name: "type",
                table: "message");
        }
    }
}
