using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class UpdateFieldsApolloServices : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "created_at",
                table: "apollo_organization");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "apollo_organization");

            migrationBuilder.DropColumn(
                name: "created_at",
                table: "apollo_contact");

            migrationBuilder.DropColumn(
                name: "updated_at",
                table: "apollo_contact");

            migrationBuilder.RenameColumn(
                name: "size",
                table: "apollo_organization",
                newName: "short_description");

            migrationBuilder.RenameColumn(
                name: "phone",
                table: "apollo_contact",
                newName: "photo_url");

            migrationBuilder.RenameColumn(
                name: "organization_name",
                table: "apollo_contact",
                newName: "headline");

            migrationBuilder.AddColumn<string>(
                name: "city",
                table: "apollo_organization",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "logo_url",
                table: "apollo_organization",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "city",
                table: "apollo_contact",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "email_status",
                table: "apollo_contact",
                type: "text",
                nullable: false,
                defaultValue: "");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "city",
                table: "apollo_organization");

            migrationBuilder.DropColumn(
                name: "logo_url",
                table: "apollo_organization");

            migrationBuilder.DropColumn(
                name: "city",
                table: "apollo_contact");

            migrationBuilder.DropColumn(
                name: "email_status",
                table: "apollo_contact");

            migrationBuilder.RenameColumn(
                name: "short_description",
                table: "apollo_organization",
                newName: "size");

            migrationBuilder.RenameColumn(
                name: "photo_url",
                table: "apollo_contact",
                newName: "phone");

            migrationBuilder.RenameColumn(
                name: "headline",
                table: "apollo_contact",
                newName: "organization_name");

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "apollo_organization",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "apollo_organization",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "created_at",
                table: "apollo_contact",
                type: "timestamp with time zone",
                nullable: true);

            migrationBuilder.AddColumn<DateTime>(
                name: "updated_at",
                table: "apollo_contact",
                type: "timestamp with time zone",
                nullable: true);
        }
    }
}
