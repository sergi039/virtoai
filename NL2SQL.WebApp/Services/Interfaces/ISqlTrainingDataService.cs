using NL2SQL.WebApp.Models.SqlTrainingData.Request;

namespace NL2SQL.WebApp.Services.Interfaces;

public interface ISqlTrainingDataService
{
    public Task<bool> AddTrainingDataAsync(AddSqlTrainingDataModel model);

    public Task<bool> DeleteTrainingDataAsync(RemoveSqlTrainingDataModel modelToRemove);
}