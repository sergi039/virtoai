using System.Security.Cryptography;
using System.Text;

namespace NL2SQL.WebApp.Utils
{
    public static class RsaEncryptionHelper
    {
        private static RSA _privateRsa;
        private static RSA _publicRsa;
        private static string _publicKeyPem;

        static RsaEncryptionHelper()
        {
            // Генерація або завантаження ключів
            // Для продакшн — зберігати приватний ключ у vault/env
            _privateRsa = RSA.Create(2048);
            _publicRsa = RSA.Create();
            _publicRsa.ImportParameters(_privateRsa.ExportParameters(false));
            _publicKeyPem = ExportPublicKeyPem(_publicRsa);
        }

        public static string GetPublicKeyPem() => _publicKeyPem;

        public static string Decrypt(string base64Cipher)
        {
            var cipherBytes = Convert.FromBase64String(base64Cipher);
            var plainBytes = _privateRsa.Decrypt(cipherBytes, RSAEncryptionPadding.OaepSHA256);
            return Encoding.UTF8.GetString(plainBytes);
        }

        private static string ExportPublicKeyPem(RSA rsa)
        {
            var publicKey = rsa.ExportSubjectPublicKeyInfo();
            var base64 = Convert.ToBase64String(publicKey);
            var sb = new StringBuilder();
            sb.AppendLine("-----BEGIN PUBLIC KEY-----");
            for (int i = 0; i < base64.Length; i += 64)
                sb.AppendLine(base64.Substring(i, Math.Min(64, base64.Length - i)));
            sb.AppendLine("-----END PUBLIC KEY-----");
            return sb.ToString();
        }
    }
}
