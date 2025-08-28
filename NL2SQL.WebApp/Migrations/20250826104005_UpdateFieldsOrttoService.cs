using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldsOrttoService : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "date_created",
                table: "ortto_person");

            migrationBuilder.DropColumn(
                name: "date_updated",
                table: "ortto_person");

            migrationBuilder.DropColumn(
                name: "subscription_status",
                table: "ortto_person");

            migrationBuilder.DropColumn(
                name: "organization_id",
                table: "ortto_activity");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<DateTime>(
                name: "date_created",
                table: "ortto_person",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "date_updated",
                table: "ortto_person",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "subscription_status",
                table: "ortto_person",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "organization_id",
                table: "ortto_activity",
                type: "text",
                nullable: true);
        }
    }
}
