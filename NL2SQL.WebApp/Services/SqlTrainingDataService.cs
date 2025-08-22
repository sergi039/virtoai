using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.SqlTrainingData.Request;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services;

public class SqlTrainingDataService : ISqlTrainingDataService
{
    private readonly IUnitOfWork _unitOfWork;

    public SqlTrainingDataService(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }
    
    public async Task<bool> AddTrainingDataAsync(AddSqlTrainingDataModel model)
    {
        var existedTrainingData = await _unitOfWork.SqlTrainingData.GetBySqlNameAsync(model.GeneratedSql);

        if (existedTrainingData != null)
            return true;

        var addSqlTrainingDara = new SqlTrainingDataEntity()
        {
            NaturalLanguageQuery = model.NaturalLanguageQuery,
            GeneratedSql = model.GeneratedSql,
            CreatedAt = DateTime.UtcNow
        };
        
        await _unitOfWork.SqlTrainingData.AddAsync(addSqlTrainingDara);
        await _unitOfWork.CompleteAsync();
        
        return true;
    }
}