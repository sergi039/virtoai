namespace NL2SQL.WebApp.Utils
{
    public static class TimeHelper
    {
        public static TimeSpan CalculateInterval(TimeHelperSetting options)
        {
            if (string.IsNullOrEmpty(options.SyncUnit))
            {
                return TimeSpan.FromMinutes(1);
            }

            return options.SyncUnit.ToLower() switch
            {
                "minutes" => TimeSpan.FromMinutes(options.SyncDuration),
                "hours" => TimeSpan.FromHours(options.SyncDuration),
                _ => throw new ArgumentException($"Invalid SyncUnit: {options.SyncUnit}")
            };
        }
    }
}
