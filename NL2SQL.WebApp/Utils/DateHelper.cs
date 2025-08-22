namespace NL2SQL.WebApp.Utils
{
    public static class DateHelper
    {
        public static DateTime ConvertToUtc(DateTime dateTime)
        {
            if (dateTime == default) return dateTime;
            return dateTime.Kind == DateTimeKind.Unspecified
                ? DateTime.SpecifyKind(dateTime, DateTimeKind.Utc)
                : dateTime.ToUniversalTime();
        }
    }
}
