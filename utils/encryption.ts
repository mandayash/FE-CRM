/* eslint-disable @typescript-eslint/no-explicit-any */

const ENCRYPTION_KEY = process.env.NEXT_PUBLIC_ENCRYPTION_KEY;

if (!ENCRYPTION_KEY) {
  throw new Error(
    "ENCRYPTION_KEY is missing. Please set it in your environment variables."
  );
}

const KEY_LENGTH = ENCRYPTION_KEY.length;

export function encryptData(data: any): string {
  try {
    const jsonString = JSON.stringify(data);

    const encrypted = btoa(
      encodeURIComponent(
        Array.from(jsonString)
          .map((char) => String.fromCharCode(char.charCodeAt(0) + KEY_LENGTH))
          .join("")
      )
    );

    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
}

export function decryptData(encryptedData: string): any {
  try {
    const decrypted = decodeURIComponent(atob(encryptedData))
      .split("")
      .map((char) => String.fromCharCode(char.charCodeAt(0) - KEY_LENGTH))
      .join("");

    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
