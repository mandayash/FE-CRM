/* eslint-disable @typescript-eslint/no-explicit-any */
// utils/encryption.ts

// Kunci enkripsi (sebaiknya simpan di environment variable)
const ENCRYPTION_KEY =
  process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "lrt-sumsel-crm-secure-key-2025";

// Fungsi untuk mengenkripsi data
export function encryptData(data: any): string {
  try {
    // Mengubah data menjadi string JSON
    const jsonString = JSON.stringify(data);

    // Mengenkripsi data menggunakan algoritma sederhana
    // Catatan: Ini bukan enkripsi yang sangat kuat, hanya untuk basic protection
    const encrypted = btoa(
      encodeURIComponent(
        Array.from(jsonString)
          .map((char) => {
            return String.fromCharCode(
              char.charCodeAt(0) + ENCRYPTION_KEY.length
            );
          })
          .join("")
      )
    );

    return encrypted;
  } catch (error) {
    console.error("Encryption failed:", error);
    return "";
  }
}

// Fungsi untuk mendekripsi data
export function decryptData(encryptedData: string): any {
  try {
    // Dekripsi data
    const decrypted = decodeURIComponent(atob(encryptedData))
      .split("")
      .map((char) => {
        return String.fromCharCode(char.charCodeAt(0) - ENCRYPTION_KEY.length);
      })
      .join("");

    // Parse kembali menjadi objek
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("Decryption failed:", error);
    return null;
  }
}
