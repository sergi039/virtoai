using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddFieldServiceTableInRuleEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<int>(
                name: "service_table_id",
                table: "sql_generation_rule",
                type: "integer",
                nullable: true);

            migrationBuilder.CreateIndex(
                name: "IX_sql_generation_rule_service_table_id",
                table: "sql_generation_rule",
                column: "service_table_id");

            migrationBuilder.AddForeignKey(
                name: "FK_sql_generation_rule_service_table_service_table_id",
                table: "sql_generation_rule",
                column: "service_table_id",
                principalTable: "service_table",
                principalColumn: "id",
                onDelete: ReferentialAction.Cascade);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_sql_generation_rule_service_table_service_table_id",
                table: "sql_generation_rule");

            migrationBuilder.DropIndex(
                name: "IX_sql_generation_rule_service_table_id",
                table: "sql_generation_rule");

            migrationBuilder.DropColumn(
                name: "service_table_id",
                table: "sql_generation_rule");
        }
    }
}
