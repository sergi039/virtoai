using System;
using System.IO;
using System.Security.Cryptography;
using System.Text;

namespace NL2SQL.WebApp.Utils
{
    public class AesEncryptionHelper
    {
        private readonly string EncryptionKey;
        private readonly string EncryptionIV;

        public AesEncryptionHelper(IConfiguration configuration)
        {
            EncryptionKey = configuration["AES_KEY"];
            EncryptionIV = configuration["AES_IV"];
        }

        public string Encrypt(string? plainText)
        {
            if (string.IsNullOrEmpty(plainText)) return plainText;
            using (Aes aesAlg = Aes.Create())
            {
                aesAlg.Key = Convert.FromBase64String(EncryptionKey);
                aesAlg.IV = Convert.FromBase64String(EncryptionIV);
                ICryptoTransform encryptor = aesAlg.CreateEncryptor(aesAlg.Key, aesAlg.IV);
                using (MemoryStream msEncrypt = new MemoryStream())
                {
                    using (CryptoStream csEncrypt = new CryptoStream(msEncrypt, encryptor, CryptoStreamMode.Write))
                    using (StreamWriter swEncrypt = new StreamWriter(csEncrypt))
                    {
                        swEncrypt.Write(plainText);
                    }
                    return Convert.ToBase64String(msEncrypt.ToArray());
                }
            }
        }

        public string Decrypt(string cipherText)
        {
            try
            {
                if (string.IsNullOrEmpty(cipherText)) return cipherText;
                using (Aes aesAlg = Aes.Create())
                {
                    aesAlg.Key = Convert.FromBase64String(EncryptionKey);
                    aesAlg.IV = Convert.FromBase64String(EncryptionIV);
                    ICryptoTransform decryptor = aesAlg.CreateDecryptor(aesAlg.Key, aesAlg.IV);
                    using (MemoryStream msDecrypt = new MemoryStream(Convert.FromBase64String(cipherText)))
                    using (CryptoStream csDecrypt = new CryptoStream(msDecrypt, decryptor, CryptoStreamMode.Read))
                    using (StreamReader srDecrypt = new StreamReader(csDecrypt))
                    {
                        return srDecrypt.ReadToEnd();
                    }
                }
            }
            catch (Exception)
            {
                return null;
            }
        }
    }
}
