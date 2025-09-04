using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.SqlTrainingData.Request;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp.Services;

public class SqlTrainingDataService : ISqlTrainingDataService
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IVannaService _vannaService;

    public SqlTrainingDataService(IUnitOfWork unitOfWork, IVannaService vannaService)
    {
        _unitOfWork = unitOfWork ?? throw new ArgumentNullException(nameof(unitOfWork));
        _vannaService = vannaService ?? throw new ArgumentNullException(nameof(vannaService));
    }
    
    public async Task<bool> AddTrainingDataAsync(AddSqlTrainingDataModel model)
    {
        var existedTrainingDataByQuestion = await _unitOfWork.SqlTrainingData.GetByQuestionNameAsync(model.NaturalLanguageQuery);

        if (existedTrainingDataByQuestion != null)
            return true;

        var existedTrainingDataBySql = await _unitOfWork.SqlTrainingData.GetBySqlNameAsync(model.GeneratedSql);

        if (existedTrainingDataBySql != null)
            return true;

        var addSqlTrainingDara = new SqlTrainingDataEntity()
        {
            NaturalLanguageQuery = model.NaturalLanguageQuery,
            GeneratedSql = model.GeneratedSql,
            CreatedAt = DateTime.UtcNow
        };
        
        await _unitOfWork.SqlTrainingData.AddAsync(addSqlTrainingDara);
        await _unitOfWork.CompleteAsync();
        _vannaService.ReinitializeModels();

        return true;
    }

    public async Task<bool> DeleteTrainingDataAsync(RemoveSqlTrainingDataModel modelToRemove)
    {
        var existedTrainingDataByQuestion = await _unitOfWork.SqlTrainingData.GetByQuestionNameAsync(modelToRemove.NaturalLanguageQuery);

        if (existedTrainingDataByQuestion == null || existedTrainingDataByQuestion.GeneratedSql != modelToRemove.GeneratedSql)
            return true;

        await _unitOfWork.SqlTrainingData.DeleteAsync(existedTrainingDataByQuestion);
        await _unitOfWork.CompleteAsync();
        _vannaService.ReinitializeModels();

        return true;
    }
}