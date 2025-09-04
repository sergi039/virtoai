using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.Identity.Web;
using MyApp.BackgroundTasks;
using NL2SQL.WebApp.BackgroundServices;
using NL2SQL.WebApp.Entities.Context;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Repositories;
using NL2SQL.WebApp.Repositories.Interfaces;
using NL2SQL.WebApp.Services;
using NL2SQL.WebApp.Services.Import;
using NL2SQL.WebApp.Services.Import.Interfaces;
using NL2SQL.WebApp.Services.Interfaces;

namespace NL2SQL.WebApp
{
    public class Program
    {
        public static void Main(string[] args)
        {
            var builder = WebApplication.CreateBuilder(args);

            builder.Services.AddDbContext<AppDbContext>(options =>
                options.UseNpgsql(builder.Configuration.GetConnectionString("AzureSqlConnection")));

            builder.Services.AddHttpClient();
            builder.Services.AddAutoMapper(typeof(Program));

            builder.Services.AddSpaStaticFiles(configuration =>
            {
                configuration.RootPath = "wwwroot"; 
            });

            builder.Services.AddHostedService<PipedriveBackgroundService>();
            builder.Services.AddHostedService<ApolloBackgroundService>();
            builder.Services.AddHostedService<OrttoBackgroundService>();
            builder.Services.AddHostedService<FreshdeskBackgroundService>();

            builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();
            builder.Services.AddScoped<IChatService, ChatService>();
            builder.Services.AddScoped<IMessageService, MessageService>();
            builder.Services.AddSingleton<SecretsManager>();
            builder.Services.AddScoped<IApolloApiService, ApolloApiService>();
            builder.Services.AddScoped<IFreshdeskApiService, FreshdeskApiService>();
            builder.Services.AddScoped<IOrttoApiService, OrttoApiService>();
            builder.Services.AddScoped<IPipedriveApiService, PipedriveApiService>();
            builder.Services.AddScoped<IOrttoImportService, OrttoImportService>();
            builder.Services.AddScoped<IFreshdeskImportService, FreshdeskImportService>();
            builder.Services.AddScoped<IApolloImportService, ApolloImportService>();
            builder.Services.AddScoped<IPipedriveImportService, PipedriveImportService>();
            builder.Services.AddScoped<ISqlQueryService, SqlQueryService>();
            builder.Services.AddScoped<IDatabaseInfoService, DatabaseInfoService>();
            builder.Services.AddScoped<ISettingDataService, SettingDataService>();
            builder.Services.AddScoped<ISqlTrainingDataService, SqlTrainingDataService>();
            builder.Services.AddScoped<ISpeechService, SpeechService>();
            builder.Services.AddScoped<IVannaService, VannaService>();
            builder.Services.AddScoped<IServiceConstructorService, ServiceConstructorService>();
            builder.Services.AddScoped<IOpenAiApiService, OpenAiApiService>();

            builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddMicrosoftIdentityWebApi(builder.Configuration.GetSection("AzureAd"));

            builder.Services.AddCors(options =>
            {
                options.AddPolicy("AllowAll", builder =>
                {
                    builder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader();
                });
            });

            builder.Services.AddControllers();
            builder.Services.AddEndpointsApiExplorer();
            builder.Services.AddSwaggerGen();

            var app = builder.Build();

            app.UseHttpsRedirection();

            app.UseStaticFiles();
            app.UseSpaStaticFiles();

            app.UseCors("AllowAll");

            app.UseAuthentication();
            app.UseAuthorization();

            if (app.Environment.IsDevelopment())
            {
                app.UseSwagger();
                app.UseSwaggerUI();
            }

            app.MapControllers();

            app.UseSpa(spa =>
            {
                spa.Options.SourcePath = "wwwroot";
            });

            using (var scope = app.Services.CreateScope())
            {
                var secretsManager = scope.ServiceProvider.GetRequiredService<SecretsManager>();
                secretsManager.LoadSecretsAsync().GetAwaiter().GetResult();
            }

            using (var scope = app.Services.CreateScope())
            {
                var services = scope.ServiceProvider;
                var context = services.GetRequiredService<AppDbContext>();
                DbInitializer.Seed(context);
            }

            app.Run();
        }
    }
}