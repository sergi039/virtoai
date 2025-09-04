using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Apollo.Response;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;
using System.Linq.Expressions;
using System.Text.Json;

namespace NL2SQL.WebApp.Repositories
{
    public class ApolloRepository : IApolloRepository
    {
        private readonly AppDbContext _context;
        private const int DefaultRecordsCount = 0;

        public ApolloRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<Dictionary<string, int>> GetCountsAsync()
        {
            return new Dictionary<string, int>
            {
                { "apollo_contacts", await _context.ApolloContacts.CountAsync() },
                { "apollo_organizations", await _context.ApolloOrganizations.CountAsync() },
                { "apollo_freshdesk_mapping", await _context.ApolloFreshdeskMappings.CountAsync() }
            };
        }

        public async Task<int> ImportApolloDataAsync(IReadOnlyList<ApolloContactModel> contacts)
        {
            if (!contacts.Any())
                return DefaultRecordsCount;

            var organizationsToImport = new Dictionary<string, ApolloOrganizationModel>();

            foreach (var contact in contacts)
            {
                if (contact.Organization?.Id != null)
                {
                    organizationsToImport.TryAdd(contact.Organization.Id, contact.Organization);
                }
            }

            var organizationsImported = await ImportOrganizationsAsync(organizationsToImport);

            var contactsImported = await ImportContactsAsync(contacts);

            return organizationsImported + contactsImported;
        }

        private async Task<int> ImportOrganizationsAsync(Dictionary<string, ApolloOrganizationModel> organizations)
        {
            if (!organizations.Any())
                return 0;

            foreach (var orgPair in organizations)
            {
                var orgData = orgPair.Value;
                var orgEntity = MapToOrganizationEntity(orgData);

                await UpsertEntityAsync(
                    _context.ApolloOrganizations,
                    orgEntity,
                    e => e.OrganizationId == orgEntity.OrganizationId,
                    existing => UpdateOrganizationEntity(existing, orgEntity));
            }

            return await _context.SaveChangesAsync();
        }

        private async Task<int> ImportContactsAsync(IReadOnlyList<ApolloContactModel> contacts)
        {
            foreach (var contact in contacts)
            {
                var entity = MapToContactEntity(contact);
                await UpsertEntityAsync(
                    _context.ApolloContacts,
                    entity,
                    e => e.ContactId == entity.ContactId,
                    existing => UpdateContactEntity(existing, entity));
            }

            return await _context.SaveChangesAsync();
        }

        public async Task<int> MatchWithFreshdeskAsync()
        {
            const string emailQuery = @"
                insert into apollo_freshdesk_mapping (apollo_id, freshdesk_id, match_method, confidence, created_at)
                select a.contact_id, f.contact_id, 'email', 0.9, now()
                from apollo_contact a
                join freshdesk_contact f on lower(a.email) = lower(f.email)
                where a.email is not null and a.email != ''
                and not exists (
                    select 1 from apollo_freshdesk_mapping m where m.apollo_id = a.contact_id and m.freshdesk_id = f.contact_id
            )";

            const string nameQuery = @"
                insert into apollo_freshdesk_mapping (apollo_id, freshdesk_id, match_method, confidence, created_at)
                select a.contact_id, f.contact_id, 'name', 0.6, now()
                from apollo_contact a
                join freshdesk_contact f on lower(a.name) = lower(f.name)
                where a.name is not null 
                and f.name is not null
                and not exists (
                    select 1 from apollo_freshdesk_mapping m where m.apollo_id = a.contact_id and m.freshdesk_id = f.contact_id
            )";

            var emailMatches = await _context.Database.ExecuteSqlRawAsync(emailQuery);
            var nameMatches = await _context.Database.ExecuteSqlRawAsync(nameQuery);
            return emailMatches + nameMatches;
        }

        public async Task<int> MatchWithPipedriveAsync()
        {
            const string emailQuery = @"
                insert into apollo_pipedrive_mapping (apollo_id, pipedrive_id, match_method, confidence, created_at)
                select a.contact_id, p.contact_id, 'email', 0.9, now()
                from apollo_contact a
                join pipedrive_contact p on lower(a.email) = lower(p.email)
                where a.email is not null and a.email != '' 
                and p.email is not null and p.email != ''
                and not exists (
                    select 1 from apollo_pipedrive_mapping m where m.apollo_id = a.contact_id and m.pipedrive_id = p.contact_id
            )";

            const string nameQuery = @"
                insert into apollo_pipedrive_mapping (apollo_id, pipedrive_id, match_method, confidence, created_at)
                select a.contact_id, p.contact_id, 'name', 0.6, now()
                from apollo_contact a
                join pipedrive_contact p on lower(a.name) = lower(p.name)
                where a.name is not null 
                and p.name is not null
                and not exists (
                    select 1 from apollo_pipedrive_mapping m where m.apollo_id = a.contact_id and m.pipedrive_id = p.contact_id
            )";

            var emailMatches = await _context.Database.ExecuteSqlRawAsync(emailQuery);
            var nameMatches = await _context.Database.ExecuteSqlRawAsync(nameQuery);

            return emailMatches + nameMatches;
        }

        public async Task SetupDatabaseAsync()
        {
            await _context.Database.EnsureCreatedAsync();
        }

        private ApolloContactEntity MapToContactEntity(ApolloContactModel contact)
        {
            var name = !string.IsNullOrEmpty(contact.FirstName) && !string.IsNullOrEmpty(contact.LastName)
                ? $"{contact.FirstName} {contact.LastName}"
                : contact.Name ?? string.Empty;

            return new ApolloContactEntity
            {
                ContactId = contact.Id,
                FirstName = contact.FirstName,
                LastName = contact.LastName,
                Name = name,
                Email = contact.Email ?? string.Empty,
                OrganizationId = contact.Organization?.Id,
                Title = contact.Title,
                LinkedInUrl = contact.LinkedInUrl,
                Country = contact.Country,
                City = contact.City,
                Headline = contact.Headline,
                PhotoUrl = contact.PhotoUrl,
                EmailStatus = contact.EmailStatus ?? string.Empty,
                Data = JsonSerializer.Serialize(contact)
            };
        }

        private ApolloOrganizationEntity MapToOrganizationEntity(ApolloOrganizationModel org)
        {
            return new ApolloOrganizationEntity
            {
                OrganizationId = org.Id,
                Name = org.Name,
                WebsiteUrl = org.WebsiteUrl,
                Industry = org.Industry,
                City = org.City,
                Description = org.Description,
                LogoUrl = org.LogoUrl,
                Country = org.Country,
                LinkedInUrl = org.LinkedInUrl,
                Data = JsonSerializer.Serialize(org)
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

        private void UpdateContactEntity(ApolloContactEntity existing, ApolloContactEntity entity)
        {
            existing.FirstName = entity.FirstName;
            existing.LastName = entity.LastName;
            existing.Name = entity.Name;
            existing.Email = entity.Email ?? existing.Email;
            existing.City = entity.City;
            existing.Headline = entity.Headline;
            existing.PhotoUrl = entity.PhotoUrl;
            existing.EmailStatus = entity.EmailStatus;
            existing.OrganizationId = entity.OrganizationId;
            existing.Title = entity.Title;
            existing.LinkedInUrl = entity.LinkedInUrl;
            existing.Country = entity.Country;
            existing.Data = entity.Data;
        }

        private void UpdateOrganizationEntity(ApolloOrganizationEntity existing, ApolloOrganizationEntity entity)
        {
            existing.Name = entity.Name;
            existing.WebsiteUrl = entity.WebsiteUrl;
            existing.Industry = entity.Industry;
            existing.Country = entity.Country;
            existing.LinkedInUrl = entity.LinkedInUrl;
            existing.Data = entity.Data;
            existing.City = entity.City;
            existing.LogoUrl = entity.LogoUrl;
            existing.Description = entity.Description;
        }
    }
}