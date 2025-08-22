using System;
using System.Collections.Concurrent;
using System.Threading.Tasks;
using NL2SQL.WebApp.Entities;
using NL2SQL.WebApp.Models.Context;
using NL2SQL.WebApp.Utils;
using Microsoft.EntityFrameworkCore;

namespace NL2SQL.WebApp.Services
{
    public class SecretsManager
    {
        private readonly IServiceProvider _serviceProvider;
        private readonly ConcurrentDictionary<string, (string apiKey, string apiUrl)> _cache = new();
        private readonly AesEncryptionHelper _aesHelper;

        public SecretsManager(IServiceProvider serviceProvider, IConfiguration configuration)
        {
            _serviceProvider = serviceProvider;
            _aesHelper = new AesEncryptionHelper(configuration);
        }

        public async Task LoadSecretsAsync()
        {
            try
            {
                using var scope = _serviceProvider.CreateScope();
                var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();

                var apollo = await db.ApolloSettings.FirstOrDefaultAsync();
                if (apollo == null || apollo.ApiKey == null || apollo.ApiUrl == null)
                    _cache["apollo"] = (null, null);
                else
                    _cache["apollo"] = (_aesHelper.Decrypt(apollo.ApiKey), _aesHelper.Decrypt(apollo.ApiUrl));

                var ortto = await db.OrttoSettings.FirstOrDefaultAsync();
                if (ortto == null || ortto.ApiKey == null || ortto.ApiUrl == null)
                    _cache["ortto"] = (null, null);
                else
                    _cache["ortto"] = (_aesHelper.Decrypt(ortto.ApiKey), _aesHelper.Decrypt(ortto.ApiUrl));

                var pipedrive = await db.PipedriveSettings.FirstOrDefaultAsync();
                if (pipedrive == null || pipedrive.ApiKey == null || pipedrive.ApiUrl == null)
                    _cache["pipedrive"] = (null, null);
                else
                    _cache["pipedrive"] = (_aesHelper.Decrypt(pipedrive.ApiKey), _aesHelper.Decrypt(pipedrive.ApiUrl));

                var freshdesk = await db.FreshdeskSettings.FirstOrDefaultAsync();
                if (freshdesk == null || freshdesk.ApiKey == null || freshdesk.ApiUrl == null)
                    _cache["freshdesk"] = (null, null);
                else
                    _cache["freshdesk"] = (_aesHelper.Decrypt(freshdesk.ApiKey), _aesHelper.Decrypt(freshdesk.ApiUrl));
            }
            catch (Exception)
            { }
        }

        public (string apiKey, string apiUrl) GetSecret(string service)
        {
            return _cache.TryGetValue(service, out var secret) ? secret : (null, null);
        }

        public async Task UpdateSecretAsync(string service, string encryptedApiKey, string encryptedApiUrl, string user)
        {
            using var scope = _serviceProvider.CreateScope();
            var db = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            switch (service)
            {
                case "apollo":
                    var apollo = await db.ApolloSettings.FirstOrDefaultAsync();
                    if (apollo != null)
                    {
                        apollo.ApiKey = encryptedApiKey;
                        apollo.ApiUrl = encryptedApiUrl;
                        await db.SaveChangesAsync();
                        _cache[service] = (_aesHelper.Decrypt(encryptedApiKey), _aesHelper.Decrypt(encryptedApiUrl));
                    }
                    break;
                case "ortto":
                    var ortto = await db.OrttoSettings.FirstOrDefaultAsync();
                    if (ortto != null)
                    {
                        ortto.ApiKey = encryptedApiKey;
                        ortto.ApiUrl = encryptedApiUrl;
                        await db.SaveChangesAsync();
                        _cache[service] = (_aesHelper.Decrypt(encryptedApiKey), _aesHelper.Decrypt(encryptedApiUrl));
                    }
                    break;
                case "pipedrive":
                    var pipedrive = await db.PipedriveSettings.FirstOrDefaultAsync();
                    if (pipedrive != null)
                    {
                        pipedrive.ApiKey = encryptedApiKey;
                        pipedrive.ApiUrl = encryptedApiUrl;
                        await db.SaveChangesAsync();
                        _cache[service] = (_aesHelper.Decrypt(encryptedApiKey), _aesHelper.Decrypt(encryptedApiUrl));
                    }
                    break;
                case "freshdesk":
                    var freshdesk = await db.FreshdeskSettings.FirstOrDefaultAsync();
                    if (freshdesk != null)
                    {
                        freshdesk.ApiKey = encryptedApiKey;
                        freshdesk.ApiUrl = encryptedApiUrl;
                        await db.SaveChangesAsync();
                        _cache[service] = (_aesHelper.Decrypt(encryptedApiKey), _aesHelper.Decrypt(encryptedApiUrl));
                    }
                    break;
            }
        }

    }
}
