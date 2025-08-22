using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldsInSqlMessage : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "error_message",
                table: "sql_message",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "is_syntax_error",
                table: "sql_message",
                type: "boolean",
                nullable: false,
                defaultValue: false);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "error_message",
                table: "sql_message");

            migrationBuilder.DropColumn(
                name: "is_syntax_error",
                table: "sql_message");
        }
    }
}
