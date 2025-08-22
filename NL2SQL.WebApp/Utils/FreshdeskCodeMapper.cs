namespace NL2SQL.WebApp.Utils
{
    public class FreshdeskCodeMapper
    {
        public static string MapStatus(int status) => status switch
        {
            2 => "Open",
            3 => "Pending",
            4 => "Resolved",
            5 => "Closed",
            _ => $"Unknown ({status})"
        };

        public static string MapPriority(int priority) => priority switch
        {
            1 => "Low",
            2 => "Medium",
            3 => "High",
            4 => "Urgent",
            _ => $"Unknown ({priority})"
        };

        public static string MapSource(int source) => source switch
        {
            1 => "Email",
            2 => "Portal",
            3 => "Phone",
            4 => "Forum",
            5 => "Twitter",
            6 => "Facebook",
            7 => "Chat",
            8 => "MobiHelp",
            9 => "Feedback Widget",
            10 => "Outbound Email",
            11 => "Ecommerce",
            12 => "Bot",
            13 => "Whatsapp",
            _ => $"Unknown ({source})"
        };
    }
}
