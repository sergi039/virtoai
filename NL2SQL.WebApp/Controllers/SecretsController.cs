using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using NL2SQL.WebApp.Services;
using NL2SQL.WebApp.Utils;
using System.Threading.Tasks;

namespace NL2SQL.WebApp.Controllers
{
    [Route("api/secrets")]
    [ApiController]
    [Authorize]
    public class SecretsController : ControllerBase
    {
        private readonly SecretsManager _secretsManager;
        private readonly AesEncryptionHelper _aesHelper;

        public SecretsController(SecretsManager secretsManager, IConfiguration configuration)
        {
            _secretsManager = secretsManager;
            _aesHelper = new AesEncryptionHelper(configuration);
        }

        [HttpGet("public-key")]
        [AllowAnonymous]
        public IActionResult GetPublicKey()
        {
            var pem = Utils.RsaEncryptionHelper.GetPublicKeyPem();
            return Ok(new { publicKey = pem });
        }

        [HttpGet("{service}")]
        public IActionResult GetSecret(string service)
        {
            var (apiKey, apiUrl) = _secretsManager.GetSecret(service);
            apiKey = _aesHelper.Encrypt(apiKey);
            apiUrl = _aesHelper.Encrypt(apiUrl);
            return Ok(new { apiKey, apiUrl });
        }

        [HttpPut("{service}")]
        public async Task<IActionResult> UpdateSecret(string service, [FromBody] SecretUpdateDto dto)
        {
            var user = User.Identity?.Name ?? "unknown";
            await _secretsManager.UpdateSecretAsync(service, dto.ApiKey, dto.ApiUrl, user);
            return Ok();
        }
    }

    public class SecretUpdateDto
    {
        public string ApiKey { get; set; }
        public string ApiUrl { get; set; }
    }
}
