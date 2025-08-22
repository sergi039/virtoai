using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class DeleteAndRenameField : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "service_redirect_rules");

            migrationBuilder.DropPrimaryKey(
                name: "PK_hidden_table_field",
                table: "hidden_table_field");

            migrationBuilder.RenameTable(
                name: "hidden_table_field",
                newName: "service_table_field");

            migrationBuilder.RenameColumn(
                name: "table_name",
                table: "service_table_field",
                newName: "display_name");

            migrationBuilder.AddColumn<bool>(
                name: "is_hidden",
                table: "service_table_field",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<int>(
                name: "service_table_id",
                table: "service_table_field",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "url_template",
                table: "service_table_field",
                type: "text",
                nullable: true);

            migrationBuilder.AddPrimaryKey(
                name: "PK_service_table_field",
                table: "service_table_field",
                column: "id");

            migrationBuilder.CreateIndex(
                name: "IX_service_table_field_service_table_id",
                table: "service_table_field",
                column: "service_table_id");

            migrationBuilder.AddForeignKey(
                name: "FK_service_table_field_service_table_service_table_id",
                table: "service_table_field",
                column: "service_table_id",
                principalTable: "service_table",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_service_table_field_service_table_service_table_id",
                table: "service_table_field");

            migrationBuilder.DropPrimaryKey(
                name: "PK_service_table_field",
                table: "service_table_field");

            migrationBuilder.DropIndex(
                name: "IX_service_table_field_service_table_id",
                table: "service_table_field");

            migrationBuilder.DropColumn(
                name: "is_hidden",
                table: "service_table_field");

            migrationBuilder.DropColumn(
                name: "service_table_id",
                table: "service_table_field");

            migrationBuilder.DropColumn(
                name: "url_template",
                table: "service_table_field");

            migrationBuilder.RenameTable(
                name: "service_table_field",
                newName: "hidden_table_field");

            migrationBuilder.RenameColumn(
                name: "display_name",
                table: "hidden_table_field",
                newName: "table_name");

            migrationBuilder.AddPrimaryKey(
                name: "PK_hidden_table_field",
                table: "hidden_table_field",
                column: "id");

            migrationBuilder.CreateTable(
                name: "service_redirect_rules",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    service_table_id = table.Column<int>(type: "integer", nullable: false),
                    field_name = table.Column<string>(type: "varchar(100)", nullable: false),
                    url_template = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_redirect_rules", x => x.id);
                    table.ForeignKey(
                        name: "FK_service_redirect_rules_service_table_service_table_id",
                        column: x => x.service_table_id,
                        principalTable: "service_table",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_service_redirect_rules_service_table_id",
                table: "service_redirect_rules",
                column: "service_table_id");
        }
    }
}
