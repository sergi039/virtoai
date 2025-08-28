using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Models.Pipedrive.Response;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Utils;
using System.Linq.Expressions;
using System.Text.Json;

namespace NL2SQL.WebApp.Repositories
{
    public class PipedriveRepository : IPipedriveRepository
    {
        private readonly AppDbContext _context;
        private const int DefaultRecordsCount = 0;

        public PipedriveRepository(AppDbContext context)
        {
            _context = context ?? throw new ArgumentNullException(nameof(context));
        }

        public async Task<int> ImportActivitiesAsync(IReadOnlyList<PipedriveActivityModel> activities)
        {
            if (activities == null || !activities.Any()) return DefaultRecordsCount;

            var successCount = 0;

            foreach (var activity in activities)
            {
                try
                {
                    var entity = await MapToActivityEntityAsync(activity);
                    await UpsertEntityAsync(_context.PipedriveActivities, entity,
                        e => e.ActivityId == entity.ActivityId,
                        existing => UpdateActivityEntity(existing, entity));

                    successCount += await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    _context.ChangeTracker.Clear();
                }
            }

            return successCount;
        }

        public async Task<int> ImportContactsAsync(IReadOnlyList<PipedriveContactModel> contacts)
        {
            if (contacts == null || !contacts.Any()) return DefaultRecordsCount;

            var successCount = 0;

            foreach (var contact in contacts)
            {
                try
                {
                    var entity = MapToContactEntity(contact);
                    await UpsertEntityAsync(_context.PipedriveContacts, entity,
                        e => e.ContactId == entity.ContactId,
                        existing => UpdateContactEntity(existing, entity));

                    successCount += await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    _context.ChangeTracker.Clear();
                }
            }

            return successCount;
        }

        public async Task<int> ImportDealsAsync(IReadOnlyList<PipedriveDealModel> deals)
        {
            if (deals == null || !deals.Any()) return DefaultRecordsCount;

            var successCount = 0;

            foreach (var deal in deals)
            {
                try
                {
                    var entity = MapToDealEntity(deal);
                    await UpsertEntityAsync(_context.PipedriveDeals, entity,
                        e => e.DealId == entity.DealId,
                        existing => UpdateDealEntity(existing, entity));

                    successCount += await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    _context.ChangeTracker.Clear();
                }
            }

            return successCount;
        }

        public async Task<int> ImportOrganizationsAsync(IReadOnlyList<PipedriveOrganizationModel> organizations)
        {
            if (organizations == null || !organizations.Any()) return DefaultRecordsCount;

            var successCount = 0;

            foreach (var org in organizations)
            {
                try
                {
                    var entity = MapToOrganizationEntity(org);
                    await UpsertEntityAsync(_context.PipedriveOrganizations, entity,
                        e => e.OrganizationId == entity.OrganizationId,
                        existing => UpdateOrganizationEntity(existing, entity));

                    successCount += await _context.SaveChangesAsync();
                }
                catch (DbUpdateException ex)
                {
                    _context.ChangeTracker.Clear();
                }
            }

            return successCount;
        }

        public async Task<int> MatchContactsWithFreshdeskAsync()
        {
            const string emailQuery = @"
                insert into pipedrive_freshdesk_contact (pipedrive_contact_id, freshdesk_contact_id, match_confidence, match_method, matched_at)
                select p.contact_id, f.contact_id, 0.9, 'email_match', now()
                from pipedrive_contact p
                join freshdesk_contact f on lower(p.email) = lower(f.email)
                where p.email is not null and f.email is not null
                    and not exists (
                        select 1 from pipedrive_freshdesk_contact pfc
                        where pfc.pipedrive_contact_id = p.contact_id and pfc.freshdesk_contact_id = f.contact_id
            )";

            const string nameQuery = @"
                insert into pipedrive_freshdesk_contact (pipedrive_contact_id, freshdesk_contact_id, match_confidence, match_method, matched_at)
                select p.contact_id, f.contact_id, 0.6, 'name_match', now()
                from pipedrive_contact p
                join freshdesk_contact f on lower(p.name) = lower(f.name)
                where not exists (
                    select 1 from pipedrive_freshdesk_contact pfc 
                    where pfc.pipedrive_contact_id = p.contact_id and pfc.freshdesk_contact_id = f.contact_id
            )";

            await _context.Database.ExecuteSqlRawAsync(emailQuery);
            await _context.Database.ExecuteSqlRawAsync(nameQuery);
            return await _context.PipedriveFreshdeskContacts.CountAsync();
        }

        public async Task SetupDatabaseAsync()
        {
            await _context.Database.EnsureCreatedAsync();
        }

        private async Task<PipedriveActivityEntity> MapToActivityEntityAsync(PipedriveActivityModel activity)
        {
            return new PipedriveActivityEntity
            {
                ActivityId = activity.Id,
                Type = activity.Type,
                Subject = activity.Subject,
                Note = activity.Note,
                DueDate = activity.DueDate != null ? DateHelper.ConvertToUtc(activity.DueDate ?? DateTime.UtcNow) : null,
                DueTime = string.IsNullOrEmpty(activity.DueTime) ? null : activity.DueTime,
                Duration = activity.Duration,
                OrgId = activity.OrgId,
                PersonId = activity.PersonId,
                DealId = activity.DealId,
                AddTime = activity.AddTime != null ? DateHelper.ConvertToUtc(activity.AddTime ?? DateTime.UtcNow) : null,
                UpdateTime = activity.UpdateTime != null ? DateHelper.ConvertToUtc(activity.UpdateTime ?? DateTime.UtcNow) : null,
                Data = JsonSerializer.Serialize(activity)
            };
        }

        private PipedriveContactEntity MapToContactEntity(PipedriveContactModel contact)
        {
            return new PipedriveContactEntity
            {
                ContactId = contact.Id,
                Name = contact.Name,
                OrganizationId = contact.OrgId?.Value,
                Email = contact.Email?.FirstOrDefault(e => e.Primary)?.Value,
                Phone = contact.Phone?.FirstOrDefault(p => p.Primary)?.Value,
                VisibleTo = contact.VisibleTo,
                AddTime = contact.AddTime != null ? DateHelper.ConvertToUtc(contact.AddTime ?? DateTime.UtcNow) : null,
                UpdateTime = contact.UpdateTime != null ? DateHelper.ConvertToUtc(contact.UpdateTime ?? DateTime.UtcNow) : null,
                Data = JsonSerializer.Serialize(contact)
            };
        }

        private PipedriveDealEntity MapToDealEntity(PipedriveDealModel deal)
        {
            return new PipedriveDealEntity
            {
                DealId = deal.Id,
                Title = deal.Title,
                OrgId = deal.OrgId?.Value,
                PersonId = deal.PersonId?.Value,
                Status = deal.Status,
                Value = deal.Value,
                Currency = deal.Currency,
                AddTime = deal.AddTime != null ? DateHelper.ConvertToUtc(deal.AddTime ?? DateTime.UtcNow) : null,
                UpdateTime = deal.UpdateTime != null ? DateHelper.ConvertToUtc(deal.UpdateTime ?? DateTime.UtcNow) : null,
                CloseTime = deal.CloseTime != null ? DateHelper.ConvertToUtc(deal.CloseTime ?? DateTime.UtcNow) : null,
                PipelineId = deal.PipelineId,
                StageId = deal.StageId,
                Data = JsonSerializer.Serialize(deal)
            };
        }

        private PipedriveOrganizationEntity MapToOrganizationEntity(PipedriveOrganizationModel org)
        {
            return new PipedriveOrganizationEntity
            {
                OrganizationId = org.Id,
                Name = org.Name,
                Address = org.Address,
                VisibleTo = org.VisibleTo,
                AddTime = org.AddTime != null ? DateHelper.ConvertToUtc(org.AddTime ?? DateTime.UtcNow) : null,
                UpdateTime = org.UpdateTime != null ? DateHelper.ConvertToUtc(org.UpdateTime ?? DateTime.UtcNow) : null,
                Data = JsonSerializer.Serialize(org)
            };
        }

        private async Task<int?> ValidateForeignKeyAsync(int? id, Func<int, Task<bool>> existsCheck)
        {
            if (!id.HasValue) return null;
            return await existsCheck(id.Value) ? id : null;
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

        private void UpdateActivityEntity(PipedriveActivityEntity existing, PipedriveActivityEntity entity)
        {
            existing.Type = entity.Type;
            existing.Subject = entity.Subject;
            existing.Note = entity.Note;
            existing.DueDate = entity.DueDate;
            existing.DueTime = entity.DueTime;
            existing.Duration = entity.Duration;
            existing.OrgId = entity.OrgId;
            existing.PersonId = entity.PersonId;
            existing.DealId = entity.DealId;
            existing.UpdateTime = entity.UpdateTime;
            existing.Data = entity.Data;
        }

        private void UpdateContactEntity(PipedriveContactEntity existing, PipedriveContactEntity entity)
        {
            existing.Name = entity.Name;
            existing.OrganizationId = entity.OrganizationId;
            existing.Email = entity.Email;
            existing.Phone = entity.Phone;
            existing.VisibleTo = entity.VisibleTo;
            existing.UpdateTime = entity.UpdateTime;
            existing.Data = entity.Data;
        }

        private void UpdateDealEntity(PipedriveDealEntity existing, PipedriveDealEntity entity)
        {
            existing.Title = entity.Title;
            existing.OrgId = entity.OrgId;
            existing.PersonId = entity.PersonId;
            existing.Status = entity.Status;
            existing.Value = entity.Value;
            existing.Currency = entity.Currency;
            existing.UpdateTime = entity.UpdateTime;
            existing.CloseTime = entity.CloseTime;
            existing.PipelineId = entity.PipelineId;
            existing.StageId = entity.StageId;
            existing.Data = entity.Data;
        }

        private void UpdateOrganizationEntity(PipedriveOrganizationEntity existing, PipedriveOrganizationEntity entity)
        {
            existing.Name = entity.Name;
            existing.Address = entity.Address;
            existing.VisibleTo = entity.VisibleTo;
            existing.UpdateTime = entity.UpdateTime;
            existing.Data = entity.Data;
        }
    }
}