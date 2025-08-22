using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class AddNewChatUserEntity : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "user_id",
                table: "chat",
                newName: "user_owner_id");

            migrationBuilder.CreateTable(
                name: "chat_user",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    joined_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    chat_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chat_user", x => x.id);
                    table.ForeignKey(
                        name: "FK_chat_user_chat_chat_id",
                        column: x => x.chat_id,
                        principalTable: "chat",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_chat_user_chat_id",
                table: "chat_user",
                column: "chat_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "chat_user");

            migrationBuilder.RenameColumn(
                name: "user_owner_id",
                table: "chat",
                newName: "user_id");
        }
    }
}
