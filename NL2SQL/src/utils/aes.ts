import CryptoJS from 'crypto-js';

const AES_KEY = 'mt174yczHTL/WFEXddXD4DW+2bw1AQHdCajmrHa8814=';
const AES_IV = 'q/AS1kJyi412MOASUu9bew==';

export function encryptAES(text: string): string {
  if (!AES_KEY || !AES_IV) return text;
  const key = CryptoJS.enc.Base64.parse(AES_KEY);
  const iv = CryptoJS.enc.Base64.parse(AES_IV);
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return encrypted.toString();
}

export function decryptAES(cipher: string): string {
  if (!AES_KEY || !AES_IV) return cipher;
  const key = CryptoJS.enc.Base64.parse(AES_KEY);
  const iv = CryptoJS.enc.Base64.parse(AES_IV);
  const decrypted = CryptoJS.AES.decrypt(cipher, key, { iv, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

export function getAesKey(): string {
  return AES_KEY;
}

export function getAesIv(): string {
  return AES_IV;
}
