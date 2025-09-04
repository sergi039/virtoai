using NL2SQL.WebApp.Entities;

namespace NL2SQL.WebApp.Repositories.Interfaces;

public interface ISqlTrainingDataRepository : IRepository<SqlTrainingDataEntity>
{
    Task<SqlTrainingDataEntity?> GetBySqlNameAsync(string sql);
    Task<SqlTrainingDataEntity?> GetByQuestionNameAsync(string questionName);
}