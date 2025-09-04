using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldsInPipedriveEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "lost_deals_count",
                table: "pipedrive_organization",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "owner_name",
                table: "pipedrive_organization",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "people_count",
                table: "pipedrive_organization",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "won_deals_count",
                table: "pipedrive_organization",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "active",
                table: "pipedrive_deal",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "formatted_weighted_value",
                table: "pipedrive_deal",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "products_count",
                table: "pipedrive_deal",
                type: "integer",
                nullable: true);

            migrationBuilder.AddColumn<bool>(
                name: "done",
                table: "pipedrive_activity",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "location",
                table: "pipedrive_activity",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "lost_deals_count",
                table: "pipedrive_organization");

            migrationBuilder.DropColumn(
                name: "owner_name",
                table: "pipedrive_organization");

            migrationBuilder.DropColumn(
                name: "people_count",
                table: "pipedrive_organization");

            migrationBuilder.DropColumn(
                name: "won_deals_count",
                table: "pipedrive_organization");

            migrationBuilder.DropColumn(
                name: "active",
                table: "pipedrive_deal");

            migrationBuilder.DropColumn(
                name: "formatted_weighted_value",
                table: "pipedrive_deal");

            migrationBuilder.DropColumn(
                name: "products_count",
                table: "pipedrive_deal");

            migrationBuilder.DropColumn(
                name: "done",
                table: "pipedrive_activity");

            migrationBuilder.DropColumn(
                name: "location",
                table: "pipedrive_activity");
        }
    }
}
