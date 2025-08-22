using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Models.Context
{
    public class AppDbContext : DbContext
    {
        public DbSet<ChatEntity> Chats { get; set; }
        public DbSet<MessageEntity> Messages { get; set; }
        public DbSet<SqlMessageEntity> SqlMessages { get; set; }
        public DbSet<SqlTrainingDataEntity> TrainingData { get; set; }
        public DbSet<FreshdeskAgentEntity> FreshdeskAgents { get; set; }
        public DbSet<FreshdeskContactEntity> FreshdeskContacts { get; set; }
        public DbSet<FreshdeskCompanyEntity> FreshdeskCompanies { get; set; }
        public DbSet<FreshdeskTicketEntity> FreshdeskTickets { get; set; }
        public DbSet<FreshdeskConversationEntity> FreshdeskConversations { get; set; }
        public DbSet<OrttoPersonEntity> OrttoPersons { get; set; }
        public DbSet<OrttoOrganizationEntity> OrttoOrganizations { get; set; }
        public DbSet<OrttoActivityEntity> OrttoActivities { get; set; }
        public DbSet<OrttoFreshdeskMappingEntity> OrttoFreshdeskMappings { get; set; }
        public DbSet<OrttoPipedriveMappingEntity> OrttoPipedriveMappings { get; set; }
        public DbSet<ApolloContactEntity> ApolloContacts { get; set; }
        public DbSet<ApolloOrganizationEntity> ApolloOrganizations { get; set; }
        public DbSet<ApolloFreshdeskMappingEntity> ApolloFreshdeskMappings { get; set; }
        public DbSet<PipedriveOrganizationEntity> PipedriveOrganizations { get; set; }
        public DbSet<PipedriveContactEntity> PipedriveContacts { get; set; }
        public DbSet<PipedriveDealEntity> PipedriveDeals { get; set; }
        public DbSet<PipedriveActivityEntity> PipedriveActivities { get; set; }
        public DbSet<PipedriveFreshdeskContactEntity> PipedriveFreshdeskContacts { get; set; }
        public DbSet<ApolloPipedriveMappingEntity> ApolloPipedriveMappings { get; set; }
        public DbSet<ApolloSettingEntity> ApolloSettings { get; set; }
        public DbSet<OrttoSettingEntity> OrttoSettings { get; set; }
        public DbSet<PipedriveSettingEntity> PipedriveSettings { get; set; }
        public DbSet<FreshdeskSettingEntity> FreshdeskSettings { get; set; }
        public DbSet<SqlGenerationRuleEntity> SqlGenerationRules { get; set; }
        public DbSet<ServiceRegistryEntity> ServiceRegistries { get; set; }
        public DbSet<ServiceTableEntity> ServiceTables { get; set; }
        public DbSet<ServiceTableFieldEntity> TableFields { get; set; }
        public DbSet<ChatUserEntity> ChatUsers { get; set; }
        public DbSet<ServiceTableImplicitRelationEntity> ServiceTableImplicitRelations { get; set; }
    public DbSet<ServiceTableFieldContextMenuItemEntity> ServiceTableFieldContextMenuItems { get; set; }

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<MessageEntity>()
                .HasOne(m => m.Chat)
                .WithMany(c => c.Messages)
                .HasForeignKey(m => m.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ChatUserEntity>()
                .HasOne(cu => cu.Chat)
                .WithMany(c => c.ChatUsers)
                .HasForeignKey(cu => cu.ChatId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SqlMessageEntity>()
                .HasOne(m => m.Message)
                .WithMany(c => c.SqlMessages)
                .HasForeignKey(m => m.MessageId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<PipedriveOrganizationEntity>()
                .Property(o => o.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<PipedriveContactEntity>()
                .Property(c => c.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<PipedriveDealEntity>()
                .Property(d => d.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<PipedriveActivityEntity>()
                .Property(a => a.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<ApolloContactEntity>()
                .Property(c => c.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<ApolloOrganizationEntity>()
                .Property(o => o.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<FreshdeskAgentEntity>()
                .Property(e => e.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<FreshdeskContactEntity>()
                .Property(e => e.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<FreshdeskCompanyEntity>()
                .Property(e => e.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<FreshdeskTicketEntity>()
                .Property(e => e.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<FreshdeskConversationEntity>()
                .Property(e => e.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<OrttoPersonEntity>()
                .Property(p => p.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<OrttoOrganizationEntity>()
                .Property(o => o.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<OrttoActivityEntity>()
                .Property(a => a.Data)
                .HasColumnType("TEXT");

            modelBuilder.Entity<ApolloFreshdeskMappingEntity>()
                .HasIndex(af => new { af.ApolloId, af.FreshdeskId })
                .IsUnique();

            modelBuilder.Entity<SqlMessageEntity>()
                .Property(e => e.Reaction)
                .HasConversion<string>();

            modelBuilder.Entity<ApolloPipedriveMappingEntity>()
                .HasIndex(ap => new { ap.ApolloId, ap.PipedriveId })
                .IsUnique();

            modelBuilder.Entity<PipedriveFreshdeskContactEntity>()
                .HasIndex(fc => new { fc.PipedriveContactId, fc.FreshdeskContactId })
                .IsUnique();

            modelBuilder.Entity<OrttoFreshdeskMappingEntity>()
                .HasIndex(m => new { m.OrttoPersonId, m.FreshdeskContactId })
                .IsUnique();

            modelBuilder.Entity<OrttoPipedriveMappingEntity>()
                .HasIndex(m => new { m.OrttoPersonId, m.PipedriveContactId })
                .IsUnique();

            modelBuilder.Entity<ServiceTableEntity>()
                .HasOne(t => t.ServiceRegistryEntity)
                .WithMany(s => s.ServiceTables)
                .HasForeignKey(t => t.ServiceRegistryEntityId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<SqlGenerationRuleEntity>()
                .HasOne(r => r.ServiceTable)
                .WithMany(t => t.SqlGenerationRules)
                .HasForeignKey(r => r.ServiceTableId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceTableFieldEntity>()
                .HasOne(f => f.ServiceTable)
                .WithMany(t => t.TableFields)
                .HasForeignKey(f => f.ServiceTableId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceTableImplicitRelationEntity>()
                .HasOne(r => r.ServiceTable)
                .WithMany(t => t.ImplicitRelationsAsPrimary)
                .HasForeignKey(r => r.ServiceTableId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceTableImplicitRelationEntity>()
                .HasOne(r => r.RelatedServiceTable)
                .WithMany(t => t.ImplicitRelationsAsRelated)
                .HasForeignKey(r => r.RelatedServiceTableId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceTableImplicitRelationEntity>()
                .HasOne(r => r.SqlGenerationRule)
                .WithMany(r => r.ServiceTableImplicitRelations)
                .HasForeignKey(r => r.SqlGenerationRuleId)
                .OnDelete(DeleteBehavior.Cascade);

            modelBuilder.Entity<ServiceTableFieldContextMenuItemEntity>()
                .HasOne(i => i.ServiceTableField)
                .WithMany(f => f.ContextMenuItems)
                .HasForeignKey(i => i.ServiceTableFieldId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}