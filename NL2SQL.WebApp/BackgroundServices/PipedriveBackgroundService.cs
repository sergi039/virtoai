using AutoMapper;
using Humanizer;
using NL2SQL.WebApp.Models.Pipedrive.Request;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services.Import.Interfaces;
using NL2SQL.WebApp.Utils;

namespace NL2SQL.WebApp.BackgroundServices
{
    public class PipedriveBackgroundService : BackgroundService
    {
        private readonly IServiceScopeFactory _scopeFactory;
        private readonly IMapper _mapper;
        private Timer? _timer;
        private TimeSpan _currentInterval;
        private const int DefaultSyncDuration = 60;
        private const string DefaultSyncUnit = "minutes";

        public PipedriveBackgroundService(IServiceScopeFactory scopeFactory, IMapper mapper)
        {
            _scopeFactory = scopeFactory;
            _mapper = mapper;
        }


        protected override async Task ExecuteAsync(CancellationToken stoppingToken)
        {
            try
            {
                using var scope = _scopeFactory.CreateScope();
                var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
                var settings = await unitOfWork.Settings.GetPipedriveSettingAsync();

                var options = new TimeHelperSetting
                {
                    SyncDuration = settings?.SyncDuration ?? DefaultSyncDuration,
                    SyncUnit = settings?.SyncUnit ?? DefaultSyncUnit
                };

                _currentInterval = TimeHelper.CalculateInterval(options);

                _timer = new Timer(
                    async state => await ExecuteTaskAsync(stoppingToken),
                    null,
                    TimeSpan.Zero,
                    _currentInterval
                );

                await Task.Delay(Timeout.Infinite, stoppingToken);
            }
            catch (Exception ex) when (ex is not OperationCanceledException)
            {
                throw;
            }
        }
        
        private async Task ExecuteTaskAsync(CancellationToken cancellationToken)
        {
            using var scope = _scopeFactory.CreateScope();
            var unitOfWork = scope.ServiceProvider.GetRequiredService<IUnitOfWork>();
            var pipedriveImportService = scope.ServiceProvider.GetRequiredService<IPipedriveImportService>();
            var setting = await unitOfWork.Settings.GetPipedriveSettingAsync();

            if (setting == null)
                return;

            var timeOptions = new TimeHelperSetting
            {
                SyncDuration = setting?.SyncDuration ?? DefaultSyncDuration,
                SyncUnit = setting?.SyncUnit ?? DefaultSyncUnit
            };

            var newInterval = TimeHelper.CalculateInterval(timeOptions);

            if (newInterval != _currentInterval)
            {
                _currentInterval = newInterval;
                _timer?.Change(TimeSpan.Zero, _currentInterval);
            }

            var options = _mapper.Map<PipedriveImportOptionsModel>(setting);
            var result = await pipedriveImportService.ImportPipedriveDataAsync(options);

            await unitOfWork.Settings.UpdateLastSyncDataServiceAsync("Pipedrive", setting.Id, DateTime.UtcNow, result.TotalRecords);
        }

        public override async Task StopAsync(CancellationToken cancellationToken)
        {
            _timer?.Change(Timeout.Infinite, 0);
            await base.StopAsync(cancellationToken);
        }

        public override void Dispose()
        {
            _timer?.Dispose();
            base.Dispose();
        }
    }
}
