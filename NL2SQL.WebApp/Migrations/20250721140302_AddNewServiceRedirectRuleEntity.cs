using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewServiceRedirectRuleEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "redirect_field_name",
                table: "service_table");

            migrationBuilder.DropColumn(
                name: "redirect_url_template",
                table: "service_table");

            migrationBuilder.CreateTable(
                name: "service_redirect_rules",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    field_name = table.Column<string>(type: "varchar(100)", nullable: false),
                    url_template = table.Column<string>(type: "text", nullable: false),
                    service_table_id = table.Column<int>(type: "integer", nullable: false)
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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "service_redirect_rules");

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
    }
}
