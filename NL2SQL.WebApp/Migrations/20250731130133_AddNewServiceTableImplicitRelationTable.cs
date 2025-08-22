using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewServiceTableImplicitRelationTable : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "service_table_implicit_relation",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    service_table_id = table.Column<int>(type: "integer", nullable: false),
                    related_service_table_id = table.Column<int>(type: "integer", nullable: false),
                    primary_table_column = table.Column<string>(type: "text", nullable: false),
                    related_table_column = table.Column<string>(type: "text", nullable: false),
                    relation_type = table.Column<string>(type: "text", nullable: false),
                    sql_generation_rule_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_service_table_implicit_relation", x => x.id);
                    table.ForeignKey(
                        name: "FK_service_table_implicit_relation_service_table_related_servi~",
                        column: x => x.related_service_table_id,
                        principalTable: "service_table",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_service_table_implicit_relation_service_table_service_table~",
                        column: x => x.service_table_id,
                        principalTable: "service_table",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_service_table_implicit_relation_sql_generation_rule_sql_gen~",
                        column: x => x.sql_generation_rule_id,
                        principalTable: "sql_generation_rule",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_service_table_implicit_relation_related_service_table_id",
                table: "service_table_implicit_relation",
                column: "related_service_table_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_table_implicit_relation_service_table_id",
                table: "service_table_implicit_relation",
                column: "service_table_id");

            migrationBuilder.CreateIndex(
                name: "IX_service_table_implicit_relation_sql_generation_rule_id",
                table: "service_table_implicit_relation",
                column: "sql_generation_rule_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "service_table_implicit_relation");
        }
    }
}
