using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Models.Ortto.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Utils;
using System.Text.Json;

namespace NL2SQL.WebApp.Repositories
{
    public class OrttoRepository : IOrttoRepository
    {
        private readonly AppDbContext _dbContext;

        public OrttoRepository(AppDbContext dbContext)
        {
            _dbContext = dbContext;
        }

        public async Task SetupDatabaseAsync()
        {
            await _dbContext.Database.EnsureCreatedAsync();
        }

        public async Task StorePersonsAsync(List<OrttoPersonModel> persons)
        {
            foreach (var person in persons)
            {
                if (string.IsNullOrEmpty(person.Id))
                {
                    continue;
                }

                try
                {
                    var entity = new OrttoPersonEntity
                    {
                        OrttoId = person.Id,
                        Email = person.Email,
                        FirstName = person.FirstName,
                        LastName = person.LastName,
                        DateCreated = DateHelper.ConvertToUtc(DateTime.UtcNow),
                        DateUpdated = DateHelper.ConvertToUtc(DateTime.UtcNow),
                        SubscriptionStatus = person.SubscriptionStatus,
                        Data = JsonSerializer.Serialize(person),
                        CreatedAt = DateHelper.ConvertToUtc(DateTime.UtcNow),
                        UpdatedAt = DateHelper.ConvertToUtc(DateTime.UtcNow)
                    };

                    var existing = await _dbContext.OrttoPersons
                        .FirstOrDefaultAsync(p => p.OrttoId == person.Id);

                    if (existing == null)
                    {
                        _dbContext.OrttoPersons.Add(entity);
                    }
                    else
                    {
                        existing.Email = entity.Email;
                        existing.FirstName = entity.FirstName;
                        existing.LastName = entity.LastName;
                        existing.DateUpdated = DateHelper.ConvertToUtc(DateTime.UtcNow);
                        existing.SubscriptionStatus = entity.SubscriptionStatus;
                        existing.Data = entity.Data;
                        existing.UpdatedAt = DateHelper.ConvertToUtc(DateTime.UtcNow);
                    }
                }
                catch (Exception ex)
                {
                }
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task StoreOrganizationsAsync(List<OrttoOrganizationModel> organizations)
        {
            foreach (var org in organizations)
            {
                if (string.IsNullOrEmpty(org.Id))
                {
                    continue;
                }

                try
                {
                    var entity = new OrttoOrganizationEntity
                    {
                        OrttoId = org.Id,
                        Name = org.Name,
                        CreatedAt = DateHelper.ConvertToUtc(DateTime.UtcNow),
                        UpdatedAt = DateHelper.ConvertToUtc(DateTime.UtcNow),
                        Data = JsonSerializer.Serialize(org),
                    };

                    var existing = await _dbContext.OrttoOrganizations
                        .FirstOrDefaultAsync(o => o.OrttoId == org.Id);

                    if (existing == null)
                    {
                        _dbContext.OrttoOrganizations.Add(entity);
                    }
                    else
                    {
                        existing.Name = entity.Name;
                        existing.UpdatedAt = DateHelper.ConvertToUtc(DateTime.UtcNow);
                        existing.Data = entity.Data;
                    }
                }
                catch (Exception ex)
                {
                }
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task StoreActivitiesAsync(List<OrttoActivityModel> activities, string orttoPersonId)
        {
            var person = await _dbContext.OrttoPersons
                .FirstOrDefaultAsync(p => p.OrttoId == orttoPersonId);

            if (person == null)
                return;

            foreach (var activity in activities)
            {
                if (string.IsNullOrEmpty(activity.Id))
                    continue;

                var existing = await _dbContext.OrttoActivities
                    .FirstOrDefaultAsync(a => a.OrttoId == activity.Id);

                if (existing != null)
                    continue;

                var org = await _dbContext.OrttoOrganizations
                    .FirstOrDefaultAsync(o => o.OrttoId == (activity.Attribute.IdtC ?? activity.Attribute.IdtA));

                var organizationId = org?.OrttoId;

                var entity = new OrttoActivityEntity
                {
                    OrttoId = activity.Id,
                    PersonId = person.OrttoId,
                    OrganizationId = organizationId,
                    ActivityType = (activity.Attribute.StrCt ?? activity.Attribute.StrName),
                    ActivityDate = activity.CreatedAt != null ? DateHelper.ConvertToUtc(activity.CreatedAt ?? DateTime.UtcNow) : DateHelper.ConvertToUtc(DateTime.UtcNow),
                    Data = JsonSerializer.Serialize(activity),
                    CreatedAt = DateHelper.ConvertToUtc(DateTime.UtcNow)
                };

                _dbContext.OrttoActivities.Add(entity);
            }

            await _dbContext.SaveChangesAsync();
        }

        public async Task<int> MatchWithFreshdeskContactsAsync()
        {
            try
            {
                var query = @"
                    INSERT INTO ortto_freshdesk_mapping (ortto_person_id, freshdesk_contact_id, created_at, updated_at)
                    SELECT op.ortto_id, c.contact_id, NOW(), NOW()
                    FROM ortto_person op
                    JOIN freshdesk_contact c ON op.email = c.email
                    LEFT JOIN ortto_freshdesk_mapping ofm ON op.ortto_id = ofm.ortto_person_id AND c.contact_id = ofm.freshdesk_contact_id
                    WHERE ofm.id IS NULL";

                var matches = await _dbContext.Database.ExecuteSqlRawAsync(query);
                return matches;
            }
            catch (Exception ex)
            {
                return 0;
            }
        }

        public async Task<List<string>> GetOrttoPersonIdsAsync()
        {
            try
            {
                var personIds = await _dbContext.OrttoPersons
                    .Select(p => p.OrttoId)
                    .ToListAsync();

                return personIds;
            }
            catch (Exception ex)
            {
                return new List<string>();
            }
        }

        public async Task<int> MatchWithPipedriveDataAsync()
        {
            try
            {
                var personQuery = @"
                    INSERT INTO ortto_pipedrive_mapping (ortto_person_id, pipedrive_contact_id, created_at, updated_at)
                    SELECT op.ortto_id, pp.contact_id, NOW(), NOW()
                    FROM ortto_person op
                    JOIN pipedrive_contact pp ON LOWER(op.email) = LOWER(pp.email)
                    LEFT JOIN ortto_pipedrive_mapping opm ON op.ortto_id = opm.ortto_person_id AND pp.contact_id = opm.pipedrive_contact_id
                    WHERE opm.id IS NULL";

                var personMatches = await _dbContext.Database.ExecuteSqlRawAsync(personQuery);

                return personMatches;
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Ошибка в MatchWithPipedriveDataAsync: {ex.Message}");
                throw; 
            }
        }
    }
}
