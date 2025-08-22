using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewFieldInServiceTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "redirect_field_name",
                table: "service_table",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "redirect_url_template",
                table: "service_table",
                type: "text",
                nullable: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "redirect_field_name",
                table: "service_table");

            migrationBuilder.DropColumn(
                name: "redirect_url_template",
                table: "service_table");
        }
    }
}
