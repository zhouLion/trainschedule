const CryptoJS = require('crypto-js');  //引用AES源码js

// 密盐
const SECRET_SALT = "(31<cosaOcmW**DLSA1[c__S";
/**
 * 加密方式
 * @param {*} message 
 * @param {*} key 
 */
export function encryptByDESMode(message) {
  if(!message) return "";
  var keyHex = CryptoJS.enc.Utf8.parse(SECRET_SALT);
  //var x = keyHex.toString(CryptoJS.enc.Hex);
  var encrypted = CryptoJS.TripleDES.encrypt(message, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  var ciphertext = encrypted.ciphertext.toString(CryptoJS.enc.Base64);
  return ciphertext;
}

/**
 * CBC模式解密
 * @param {*} ciphertext 
 * @param {*} key 
 */
export function decryptByDESMode(ciphertext){
  if(!ciphertext) return "{}";
  var parsedWordArray = CryptoJS.enc.Base64.parse(ciphertext);
  var parsedStr = parsedWordArray.toString();
  var keyHex = CryptoJS.enc.Utf8.parse(SECRET_SALT);
  var decrypted = CryptoJS.TripleDES.decrypt({
      ciphertext: CryptoJS.enc.Hex.parse(parsedStr)
  }, keyHex, {
      mode: CryptoJS.mode.ECB,
      padding: CryptoJS.pad.Pkcs7
  });
  var result_value = decrypted.toString(CryptoJS.enc.Utf8);
  return result_value;
}
