using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsInMessageForHelperChat : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "related_questions",
                table: "message",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "suggestions",
                table: "message",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "related_questions",
                table: "message");

            migrationBuilder.DropColumn(
                name: "suggestions",
                table: "message");
        }
    }
}
