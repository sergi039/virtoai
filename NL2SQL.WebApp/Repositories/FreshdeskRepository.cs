using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Models.Freshdesk.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using Npgsql;
using System.Linq.Expressions;
using System.Text.Json;

namespace NL2SQL.WebApp.Repositories
{
    public class FreshdeskRepository : IFreshdeskRepository
    {
        private readonly AppDbContext _context;
        private const int DefaultRecordsCount = 0;

        public FreshdeskRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task SetupDatabaseAsync()
        {
            await _context.Database.EnsureCreatedAsync();
        }

        public async Task<int> ImportAgentsAsync(IReadOnlyList<AgentModel> agents)
        {
            if (!agents.Any()) return DefaultRecordsCount;

            var totalAffected = 0;

            foreach (var agent in agents)
            {
                try
                {
                    var entity = MapToAgentEntity(agent);
                    await UpsertEntityAsync(_context.FreshdeskAgents, entity,
                        e => e.AgentId == entity.AgentId,
                        existing => UpdateAgentEntity(existing, entity));

                    totalAffected += await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    _context.ChangeTracker.Clear();
                }
            }

            return totalAffected;
        }

        public async Task<int> ImportContactsAsync(IReadOnlyList<ContactModel> contacts)
        {
            if (!contacts.Any()) return DefaultRecordsCount;

            var totalAffected = 0;

            foreach (var contact in contacts)
            {
                try
                {
                    var entity = MapToContactEntity(contact);
                    await UpsertEntityAsync(_context.FreshdeskContacts, entity,
                        e => e.ContactId == entity.ContactId,
                        existing => UpdateContactEntity(existing, entity));

                    totalAffected += await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    _context.ChangeTracker.Clear();
                }
            }

            return totalAffected;
        }

        public async Task<int> ImportCompaniesAsync(IReadOnlyList<CompanyModel> companies)
        {
            if (!companies.Any()) return DefaultRecordsCount;

            var totalAffected = 0;

            foreach (var company in companies)
            {
                try
                {
                    var entity = MapToCompanyEntity(company);
                    await UpsertEntityAsync(_context.FreshdeskCompanies, entity,
                        e => e.CompanyId == entity.CompanyId,
                        existing => UpdateCompanyEntity(existing, entity));

                    totalAffected += await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    _context.ChangeTracker.Clear();
                }
            }

            return totalAffected;
        }

        public async Task<int> ImportTicketsAsync(IReadOnlyList<TicketModel> tickets, DateTime? since = null, int batchSize = 100)
        {
            if (!tickets.Any()) return DefaultRecordsCount;

            var totalAffected = 0;

            for (var i = 0; i < tickets.Count; i += batchSize)
            {
                var batch = tickets.Skip(i).Take(batchSize).ToList();

                foreach (var ticket in batch)
                {
                    try
                    {
                        var entity = MapToTicketEntity(ticket);
                        await UpsertEntityAsync(_context.FreshdeskTickets, entity,
                            e => e.TicketId == entity.TicketId,
                            existing => UpdateTicketEntity(existing, entity));

                        totalAffected += await _context.SaveChangesAsync();
                    }
                    catch (DbUpdateException ex) 
                    {
                        _context.ChangeTracker.Clear();
                    }
                }
            }

            return totalAffected;
        }

        public async Task<int> ImportConversationsAsync(IReadOnlyList<ConversationModel> conversations, int? ticketId = null)
        {
            if (!conversations.Any()) return DefaultRecordsCount;

            foreach (var conversation in conversations)
            {
                var entity = MapToConversationEntity(conversation, ticketId);
                await UpsertEntityAsync(_context.FreshdeskConversations, entity,
                    e => e.Id == conversation.Id,
                    existing => UpdateConversationEntity(existing, entity));
            }

            return await _context.SaveChangesAsync();
        }

        private FreshdeskAgentEntity MapToAgentEntity(AgentModel agent)
        {
            return new FreshdeskAgentEntity
            {
                AgentId = agent.Id,
                Name = agent.Contact?.Name,
                Email = agent.Contact?.Email,
                Phone = agent.Contact?.Phone,
                JobTitle = agent.Contact?.JobTitle,
                CreatedAt = agent.CreatedAt,
                UpdatedAt = agent.UpdatedAt,
                Data = JsonSerializer.Serialize(agent)
            };
        }

        private FreshdeskContactEntity MapToContactEntity(ContactModel contact)
        {
            return new FreshdeskContactEntity
            {
                ContactId = contact.Id,
                Name = contact.Name,
                Email = contact.Email,
                Phone = contact.Phone,
                JobTitle = contact.JobTitle,
                CompanyId = contact.CompanyId,
                CreatedAt = contact.CreatedAt,
                UpdatedAt = contact.UpdatedAt,
                Data = JsonSerializer.Serialize(contact)
            };
        }

        private FreshdeskCompanyEntity MapToCompanyEntity(CompanyModel company)
        {
            return new FreshdeskCompanyEntity
            {
                CompanyId = company.Id,
                Name = company.Name,
                Description = company.Description,
                Domains = string.Join(",", company.Domains),
                CreatedAt = company.CreatedAt,
                UpdatedAt = company.UpdatedAt,
                Data = JsonSerializer.Serialize(company)
            };
        }

        private FreshdeskTicketEntity MapToTicketEntity(TicketModel ticket)
        {
            return new FreshdeskTicketEntity
            {
                TicketId = ticket.Id,
                Subject = ticket.Subject,
                Description = ticket.Description,
                Status = ticket.Status,
                Priority = ticket.Priority,
                Source = ticket.Source,
                Type = ticket.Type,
                RequesterId = ticket.RequesterId,
                ResponderId = ticket.ResponderId,
                CompanyId = ticket.CompanyId,
                GroupId = ticket.GroupId,
                CreatedAt = ticket.CreatedAt,
                UpdatedAt = ticket.UpdatedAt,
                DueBy = ticket.DueBy,
                FrDueBy = ticket.FrDueBy,
                FrEscalated = ticket.FrEscalated,
                IsEscalated = ticket.IsEscalated,
                Tags = string.Join(",", ticket.Tags),
                Spam = ticket.Spam,
                CustomFields = string.Join(",", ticket.CustomFields),
                Data = JsonSerializer.Serialize(ticket)
            };
        }

        private FreshdeskConversationEntity MapToConversationEntity(ConversationModel conversation, int? ticketId)
        {
            var userType = conversation.UserId.HasValue
                ? (conversation.IsAgent ? "agent" : "contact")
                : null;

            return new FreshdeskConversationEntity
            {
                TicketId = conversation.TicketId ?? ticketId,
                UserType = userType,
                FromId = conversation.UserId,
                Body = conversation.Body,
                Private = conversation.Private,
                Source = conversation.Source,
                Attachments = string.Join(",", conversation.Attachments ?? Array.Empty<string>()),
                CreatedAt = conversation.CreatedAt,
                UpdatedAt = conversation.UpdatedAt,
                Data = JsonSerializer.Serialize(conversation)
            };
        }

        private async Task UpsertEntityAsync<TEntity>(
            DbSet<TEntity> dbSet,
            TEntity entity,
            Expression<Func<TEntity, bool>> matchPredicate,
            Action<TEntity> updateAction) where TEntity : class
        {
            var existing = await dbSet.FirstOrDefaultAsync(matchPredicate);
            if (existing == null)
            {
                dbSet.Add(entity);
            }
            else
            {
                updateAction(existing);
            }
        }

        private void UpdateAgentEntity(FreshdeskAgentEntity existing, FreshdeskAgentEntity entity)
        {
            existing.Name = entity.Name;
            existing.Email = entity.Email;
            existing.Phone = entity.Phone;
            existing.JobTitle = entity.JobTitle;
            existing.CreatedAt = entity.CreatedAt;
            existing.UpdatedAt = entity.UpdatedAt;
            existing.Data = entity.Data;
        }

        private void UpdateContactEntity(FreshdeskContactEntity existing, FreshdeskContactEntity entity)
        {
            existing.Name = entity.Name;
            existing.Email = entity.Email;
            existing.Phone = entity.Phone;
            existing.JobTitle = entity.JobTitle;
            existing.CompanyId = entity.CompanyId;
            existing.CreatedAt = entity.CreatedAt;
            existing.UpdatedAt = entity.UpdatedAt;
            existing.Data = entity.Data;
        }

        private void UpdateCompanyEntity(FreshdeskCompanyEntity existing, FreshdeskCompanyEntity entity)
        {
            existing.Name = entity.Name;
            existing.Description = entity.Description;
            existing.Domains = entity.Domains;
            existing.CreatedAt = entity.CreatedAt;
            existing.UpdatedAt = entity.UpdatedAt;
            existing.Data = entity.Data;
        }

        private void UpdateTicketEntity(FreshdeskTicketEntity existing, FreshdeskTicketEntity entity)
        {
            existing.Subject = entity.Subject;
            existing.Description = entity.Description;
            existing.Status = entity.Status;
            existing.Priority = entity.Priority;
            existing.Source = entity.Source;
            existing.Type = entity.Type;
            existing.RequesterId = entity.RequesterId;
            existing.ResponderId = entity.ResponderId;
            existing.CompanyId = entity.CompanyId;
            existing.GroupId = entity.GroupId;
            existing.CreatedAt = entity.CreatedAt;
            existing.UpdatedAt = entity.UpdatedAt;
            existing.DueBy = entity.DueBy;
            existing.FrDueBy = entity.FrDueBy;
            existing.FrEscalated = entity.FrEscalated;
            existing.IsEscalated = entity.IsEscalated;
            existing.Tags = entity.Tags;
            existing.Spam = entity.Spam;
            existing.CustomFields = entity.CustomFields;
            existing.Data = entity.Data;
        }

        private void UpdateConversationEntity(FreshdeskConversationEntity existing, FreshdeskConversationEntity entity)
        {
            existing.TicketId = entity.TicketId;
            existing.UserType = entity.UserType;
            existing.FromId = entity.FromId;
            existing.Body = entity.Body;
            existing.Private = entity.Private;
            existing.Source = entity.Source;
            existing.Attachments = entity.Attachments;
            existing.CreatedAt = entity.CreatedAt;
            existing.UpdatedAt = entity.UpdatedAt;
            existing.Data = entity.Data;
        }
    }
}