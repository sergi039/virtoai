using Microsoft.EntityFrameworkCore;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories.Interfaces;

namespace NL2SQL.WebApp.Repositories;

public class SqlTrainingDataRepository : Repository<SqlTrainingDataEntity>, ISqlTrainingDataRepository
{
    public SqlTrainingDataRepository(AppDbContext context) : base(context)
    {
        
    }

    public Task<SqlTrainingDataEntity?> GetByQuestionNameAsync(string questionName)
    {
        var result = _context.TrainingData
            .FirstOrDefaultAsync(c => c.NaturalLanguageQuery == questionName);

        return result;
    }

    public async Task<SqlTrainingDataEntity?> GetBySqlNameAsync(string sql)
    {
        var result = await _context.TrainingData
            .FirstOrDefaultAsync(c => c.GeneratedSql == sql);

        return result;
    }
}