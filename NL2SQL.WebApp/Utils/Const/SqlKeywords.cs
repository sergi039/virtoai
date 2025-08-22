namespace NL2SQL.WebApp.Utils;

public static class SqlKeywords
{
    public static readonly string[] Complex =
    [
        "join", "union", "intersect", "except", "with", "cte", 
        "subquery", "nested"
    ];

    public static readonly string[] Medium =
    [
        "group by", "having", "case when", "window", "partition",
        "rank", "aggregate", "average", "count distinct", 
        "date difference", "date format"
    ];

    public static readonly string[] Simple =
    [
        "where", "order by", "limit", "distinct", "count",
        "sum", "avg", "min", "max"
    ];
}