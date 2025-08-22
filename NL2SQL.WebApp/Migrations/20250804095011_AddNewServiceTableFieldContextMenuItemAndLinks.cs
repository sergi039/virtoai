using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewServiceTableFieldContextMenuItemAndLinks : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<bool>(
                name: "is_ai_generate_context_enabled",
                table: "service_table_field",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.CreateTable(
                name: "service_table_field_context_menu_item",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    sort_order = table.Column<int>(type: "integer", nullable: false),
                    service_table_field_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_table_field_context_menu_item", x => x.id);
                    table.ForeignKey(
                        name: "FK_service_table_field_context_menu_item_service_table_field_s~",
                        column: x => x.service_table_field_id,
                        principalTable: "service_table_field",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_service_table_field_context_menu_item_service_table_field_id",
                table: "service_table_field_context_menu_item",
                column: "service_table_field_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "service_table_field_context_menu_item");

            migrationBuilder.DropColumn(
                name: "is_ai_generate_context_enabled",
                table: "service_table_field");
        }
    }
}
