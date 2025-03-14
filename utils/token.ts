// utils/tokenUtils.ts
export function getUserIdFromToken(token: string): number {
  try {
    // JWT tokens have three parts separated by dots: header.payload.signature
    const payload = token.split(".")[1];

    // The payload is base64 encoded
    const decodedPayload = atob(payload);

    // Parse the JSON
    const parsedPayload = JSON.parse(decodedPayload);

    // Return the user_id from the token payload
    return parsedPayload.user_id || parsedPayload.userId || parsedPayload.sub;
  } catch (error) {
    console.error("Error decoding token:", error);
    return 0; // Return a default value or throw an error
  }
}
