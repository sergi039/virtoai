using System.ComponentModel;

namespace NL2SQL.WebApp.Entities.Enums
{
    public enum DatabaseServiceName
    {
        [Description("Pipedrive")]
        Pipedrive,

        [Description("Ortto")]
        Ortto,

        [Description("Freshdesk")]
        Freshdesk,

        [Description("Apollo")]
        Apollo
    }
}
