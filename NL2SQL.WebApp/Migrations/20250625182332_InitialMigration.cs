using System;
using Microsoft.EntityFrameworkCore.Migrations;
using Npgsql.EntityFrameworkCore.PostgreSQL.Metadata;

#nullable disable

namespace NL2SQL.WebApp.Migrations
{
    /// <inheritdoc />
    public partial class InitialMigration : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "apollo_contact",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    contact_id = table.Column<string>(type: "text", nullable: false),
                    first_name = table.Column<string>(type: "text", nullable: false),
                    last_name = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    email = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
                    organization_name = table.Column<string>(type: "text", nullable: true),
                    organization_id = table.Column<string>(type: "text", nullable: true),
                    title = table.Column<string>(type: "text", nullable: false),
                    linkedin_url = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_apollo_contact", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "apollo_freshdesk_mapping",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    apollo_id = table.Column<string>(type: "text", nullable: false),
                    freshdesk_id = table.Column<int>(type: "integer", nullable: false),
                    match_method = table.Column<string>(type: "text", nullable: false),
                    confidence = table.Column<float>(type: "real", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_apollo_freshdesk_mapping", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "apollo_organization",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    organization_id = table.Column<string>(type: "text", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    website_url = table.Column<string>(type: "text", nullable: true),
                    industry = table.Column<string>(type: "text", nullable: true),
                    size = table.Column<string>(type: "text", nullable: true),
                    country = table.Column<string>(type: "text", nullable: true),
                    linkedin_url = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_apollo_organization", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "apollo_pipedrive_mapping",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    apollo_id = table.Column<string>(type: "text", nullable: false),
                    pipedrive_id = table.Column<int>(type: "integer", nullable: false),
                    match_method = table.Column<string>(type: "text", nullable: false),
                    confidence = table.Column<float>(type: "real", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_apollo_pipedrive_mapping", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "apollo_setting",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    tables = table.Column<string>(type: "text", nullable: false),
                    api_key = table.Column<string>(type: "text", nullable: true),
                    api_url = table.Column<string>(type: "text", nullable: true),
                    sync_duration = table.Column<int>(type: "integer", nullable: false),
                    sync_unit = table.Column<string>(type: "text", nullable: false),
                    setup = table.Column<bool>(type: "boolean", nullable: false),
                    domain = table.Column<string>(type: "text", nullable: true),
                    email_domain = table.Column<string>(type: "text", nullable: true),
                    name_user = table.Column<string>(type: "text", nullable: true),
                    limit = table.Column<int>(type: "integer", nullable: false),
                    match_freshdesk = table.Column<bool>(type: "boolean", nullable: false),
                    match_pipedrive = table.Column<bool>(type: "boolean", nullable: false),
                    last_sync_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_sync_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_apollo_setting", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "chat",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    title = table.Column<string>(type: "text", nullable: false),
                    user_id = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_chat", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "freshdesk_agent",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    agent_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
                    job_title = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_freshdesk_agent", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "freshdesk_company",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    company_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    description = table.Column<string>(type: "text", nullable: true),
                    domains = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_freshdesk_company", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "freshdesk_contact",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    contact_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    phone = table.Column<string>(type: "text", nullable: true),
                    job_title = table.Column<string>(type: "text", nullable: true),
                    company_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_freshdesk_contact", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "freshdesk_conversation",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ticket_id = table.Column<int>(type: "integer", nullable: true),
                    user_type = table.Column<string>(type: "text", nullable: true),
                    from_id = table.Column<int>(type: "integer", nullable: true),
                    body = table.Column<string>(type: "text", nullable: true),
                    @private = table.Column<bool>(name: "private", type: "boolean", nullable: false),
                    source = table.Column<string>(type: "text", nullable: true),
                    attachments = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_freshdesk_conversation", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "freshdesk_setting",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    tables = table.Column<string>(type: "text", nullable: false),
                    api_key = table.Column<string>(type: "text", nullable: true),
                    sync_duration = table.Column<int>(type: "integer", nullable: false),
                    sync_unit = table.Column<string>(type: "text", nullable: false),
                    entities = table.Column<string>(type: "text", nullable: false),
                    conversations = table.Column<bool>(type: "boolean", nullable: false),
                    since = table.Column<string>(type: "text", nullable: false),
                    until = table.Column<string>(type: "text", nullable: false),
                    batch_size = table.Column<int>(type: "integer", nullable: false),
                    insecure = table.Column<bool>(type: "boolean", nullable: false),
                    ticket_id = table.Column<int>(type: "integer", nullable: true),
                    parallel_threads = table.Column<int>(type: "integer", nullable: false),
                    last_sync_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_sync_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_freshdesk_setting", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "freshdesk_ticket",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ticket_id = table.Column<int>(type: "integer", nullable: false),
                    subject = table.Column<string>(type: "text", nullable: true),
                    description = table.Column<string>(type: "text", nullable: true),
                    status = table.Column<int>(type: "integer", nullable: false),
                    priority = table.Column<int>(type: "integer", nullable: false),
                    source = table.Column<int>(type: "integer", nullable: false),
                    type = table.Column<string>(type: "text", nullable: true),
                    requester_id = table.Column<long>(type: "bigint", nullable: true),
                    responder_id = table.Column<int>(type: "integer", nullable: true),
                    company_id = table.Column<int>(type: "integer", nullable: true),
                    group_id = table.Column<int>(type: "integer", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    due_by = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fr_due_by = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    fr_escalated = table.Column<bool>(type: "boolean", nullable: false),
                    is_escalated = table.Column<bool>(type: "boolean", nullable: false),
                    tags = table.Column<string>(type: "text", nullable: false),
                    spam = table.Column<bool>(type: "boolean", nullable: false),
                    custom_fields = table.Column<string>(type: "text", nullable: false),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_freshdesk_ticket", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ortto_activity",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ortto_id = table.Column<string>(type: "text", nullable: true),
                    person_id = table.Column<int>(type: "integer", nullable: true),
                    organization_id = table.Column<int>(type: "integer", nullable: true),
                    activity_type = table.Column<string>(type: "text", nullable: true),
                    activity_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ortto_activity", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ortto_freshdesk_mapping",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ortto_person_id = table.Column<string>(type: "text", nullable: false),
                    freshdesk_contact_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ortto_freshdesk_mapping", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ortto_organization",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ortto_id = table.Column<string>(type: "text", nullable: true),
                    name = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ortto_organization", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ortto_person",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ortto_id = table.Column<string>(type: "text", nullable: true),
                    email = table.Column<string>(type: "text", nullable: true),
                    first_name = table.Column<string>(type: "text", nullable: true),
                    last_name = table.Column<string>(type: "text", nullable: true),
                    date_created = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    date_updated = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    subscription_status = table.Column<string>(type: "text", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ortto_person", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ortto_pipedrive_mapping",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    ortto_person_id = table.Column<string>(type: "text", nullable: false),
                    pipedrive_contact_id = table.Column<int>(type: "integer", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ortto_pipedrive_mapping", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "ortto_setting",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    tables = table.Column<string>(type: "text", nullable: false),
                    api_key = table.Column<string>(type: "text", nullable: true),
                    api_url = table.Column<string>(type: "text", nullable: true),
                    sync_duration = table.Column<int>(type: "integer", nullable: false),
                    sync_unit = table.Column<string>(type: "text", nullable: false),
                    setup = table.Column<bool>(type: "boolean", nullable: false),
                    import_data = table.Column<bool>(type: "boolean", nullable: false),
                    limit = table.Column<int>(type: "integer", nullable: false),
                    match_freshdesk = table.Column<bool>(type: "boolean", nullable: false),
                    match_pipedrive = table.Column<bool>(type: "boolean", nullable: false),
                    last_sync_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_sync_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ortto_setting", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pipedrive_activity",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    activity_id = table.Column<int>(type: "integer", nullable: false),
                    type = table.Column<string>(type: "text", nullable: false),
                    subject = table.Column<string>(type: "text", nullable: false),
                    note = table.Column<string>(type: "text", nullable: true),
                    due_date = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    due_time = table.Column<string>(type: "text", nullable: true),
                    duration = table.Column<string>(type: "text", nullable: false),
                    org_id = table.Column<int>(type: "integer", nullable: true),
                    person_id = table.Column<int>(type: "integer", nullable: true),
                    deal_id = table.Column<int>(type: "integer", nullable: true),
                    add_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pipedrive_activity", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pipedrive_contact",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    contact_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    organization_id = table.Column<int>(type: "integer", nullable: true),
                    email = table.Column<string>(type: "text", nullable: false),
                    phone = table.Column<string>(type: "text", nullable: false),
                    visible_to = table.Column<string>(type: "text", nullable: true),
                    add_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pipedrive_contact", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pipedrive_deal",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    deal_id = table.Column<int>(type: "integer", nullable: false),
                    title = table.Column<string>(type: "text", nullable: false),
                    org_id = table.Column<int>(type: "integer", nullable: true),
                    person_id = table.Column<int>(type: "integer", nullable: true),
                    status = table.Column<string>(type: "text", nullable: false),
                    value = table.Column<decimal>(type: "numeric", nullable: true),
                    currency = table.Column<string>(type: "text", nullable: false),
                    add_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    close_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    pipeline_id = table.Column<int>(type: "integer", nullable: true),
                    stage_id = table.Column<int>(type: "integer", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pipedrive_deal", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pipedrive_freshdesk_contact",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    pipedrive_contact_id = table.Column<int>(type: "integer", nullable: false),
                    freshdesk_contact_id = table.Column<int>(type: "integer", nullable: false),
                    match_confidence = table.Column<float>(type: "real", nullable: false),
                    match_method = table.Column<string>(type: "text", nullable: false),
                    matched_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pipedrive_freshdesk_contact", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pipedrive_organization",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    organization_id = table.Column<int>(type: "integer", nullable: false),
                    name = table.Column<string>(type: "text", nullable: false),
                    address = table.Column<string>(type: "text", nullable: true),
                    visible_to = table.Column<string>(type: "text", nullable: true),
                    add_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    update_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    data = table.Column<string>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pipedrive_organization", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "pipedrive_setting",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    name = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    tables = table.Column<string>(type: "text", nullable: false),
                    api_key = table.Column<string>(type: "text", nullable: true),
                    api_url = table.Column<string>(type: "text", nullable: true),
                    sync_duration = table.Column<int>(type: "integer", nullable: false),
                    sync_unit = table.Column<string>(type: "text", nullable: false),
                    limit = table.Column<int>(type: "integer", nullable: false),
                    setup = table.Column<bool>(type: "boolean", nullable: false),
                    full = table.Column<bool>(type: "boolean", nullable: false),
                    match_freshdesk = table.Column<bool>(type: "boolean", nullable: false),
                    entities = table.Column<string>(type: "text", nullable: false),
                    last_sync_time = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    last_sync_count = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_pipedrive_setting", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sql_generation_rule",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    text = table.Column<string>(type: "text", nullable: false),
                    is_active = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    updated_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sql_generation_rule", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "sql_training_data",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    natural_language_query = table.Column<string>(type: "text", nullable: false),
                    generated_sql = table.Column<string>(type: "text", nullable: false),
                    context = table.Column<string>(type: "text", nullable: true),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sql_training_data", x => x.id);
                });

            migrationBuilder.CreateTable(
                name: "message",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    text = table.Column<string>(type: "text", nullable: true),
                    is_user = table.Column<bool>(type: "boolean", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    chat_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_message", x => x.id);
                    table.ForeignKey(
                        name: "FK_message_chat_chat_id",
                        column: x => x.chat_id,
                        principalTable: "chat",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "sql_message",
                columns: table => new
                {
                    id = table.Column<int>(type: "integer", nullable: false)
                        .Annotation("Npgsql:ValueGenerationStrategy", NpgsqlValueGenerationStrategy.IdentityByDefaultColumn),
                    sql = table.Column<string>(type: "text", nullable: true),
                    text = table.Column<string>(type: "text", nullable: false),
                    model = table.Column<string>(type: "text", nullable: false),
                    reaction = table.Column<string>(type: "text", nullable: false),
                    created_at = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    message_id = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_sql_message", x => x.id);
                    table.ForeignKey(
                        name: "FK_sql_message_message_message_id",
                        column: x => x.message_id,
                        principalTable: "message",
                        principalColumn: "id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_apollo_freshdesk_mapping_apollo_id_freshdesk_id",
                table: "apollo_freshdesk_mapping",
                columns: new[] { "apollo_id", "freshdesk_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_apollo_pipedrive_mapping_apollo_id_pipedrive_id",
                table: "apollo_pipedrive_mapping",
                columns: new[] { "apollo_id", "pipedrive_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_message_chat_id",
                table: "message",
                column: "chat_id");

            migrationBuilder.CreateIndex(
                name: "IX_ortto_freshdesk_mapping_ortto_person_id_freshdesk_contact_id",
                table: "ortto_freshdesk_mapping",
                columns: new[] { "ortto_person_id", "freshdesk_contact_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_ortto_pipedrive_mapping_ortto_person_id_pipedrive_contact_id",
                table: "ortto_pipedrive_mapping",
                columns: new[] { "ortto_person_id", "pipedrive_contact_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_pipedrive_freshdesk_contact_pipedrive_contact_id_freshdesk_~",
                table: "pipedrive_freshdesk_contact",
                columns: new[] { "pipedrive_contact_id", "freshdesk_contact_id" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_sql_message_message_id",
                table: "sql_message",
                column: "message_id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "apollo_contact");

            migrationBuilder.DropTable(
                name: "apollo_freshdesk_mapping");

            migrationBuilder.DropTable(
                name: "apollo_organization");

            migrationBuilder.DropTable(
                name: "apollo_pipedrive_mapping");

            migrationBuilder.DropTable(
                name: "apollo_setting");

            migrationBuilder.DropTable(
                name: "freshdesk_agent");

            migrationBuilder.DropTable(
                name: "freshdesk_company");

            migrationBuilder.DropTable(
                name: "freshdesk_contact");

            migrationBuilder.DropTable(
                name: "freshdesk_conversation");

            migrationBuilder.DropTable(
                name: "freshdesk_setting");

            migrationBuilder.DropTable(
                name: "freshdesk_ticket");

            migrationBuilder.DropTable(
                name: "ortto_activity");

            migrationBuilder.DropTable(
                name: "ortto_freshdesk_mapping");

            migrationBuilder.DropTable(
                name: "ortto_organization");

            migrationBuilder.DropTable(
                name: "ortto_person");

            migrationBuilder.DropTable(
                name: "ortto_pipedrive_mapping");

            migrationBuilder.DropTable(
                name: "ortto_setting");

            migrationBuilder.DropTable(
                name: "pipedrive_activity");

            migrationBuilder.DropTable(
                name: "pipedrive_contact");

            migrationBuilder.DropTable(
                name: "pipedrive_deal");

            migrationBuilder.DropTable(
                name: "pipedrive_freshdesk_contact");

            migrationBuilder.DropTable(
                name: "pipedrive_organization");

            migrationBuilder.DropTable(
                name: "pipedrive_setting");

            migrationBuilder.DropTable(
                name: "sql_generation_rule");

            migrationBuilder.DropTable(
                name: "sql_message");

            migrationBuilder.DropTable(
                name: "sql_training_data");

            migrationBuilder.DropTable(
                name: "message");

            migrationBuilder.DropTable(
                name: "chat");
        }
    }
}
