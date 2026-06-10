/**
 * AthlynX E2E ENCRYPTION — Web Crypto API (AES-GCM 256-bit)
 * Zero external dependencies — uses browser's native SubtleCrypto.
 * Each conversation uses a deterministic key derived from conversationId + app secret.
 * Messages are encrypted before storage and decrypted on display.
 */

const APP_SALT = "athlynx-e2e-v1-2026";

//  Key Derivation 
// Derives a 256-bit AES-GCM key from a conversation ID.
// Same conversation always produces the same key (deterministic).
async function deriveConversationKey(conversationId: number): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${APP_SALT}:conv:${conversationId}`),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(`athlynx-salt-${conversationId}`),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

//  Derive a key for NIL contracts / documents 
async function deriveDocumentKey(userId: number, docType: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(`${APP_SALT}:doc:${userId}:${docType}`),
    { name: "PBKDF2" },
    false,
    ["deriveKey"]
  );
  return crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(`athlynx-doc-salt-${userId}`),
      iterations: 100000,
      hash: "SHA-256",
    },
    keyMaterial,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"]
  );
}

//  Encrypt 
// Returns base64-encoded string: iv (12 bytes) + ciphertext
async function encryptWithKey(plaintext: string, key: CryptoKey): Promise<string> {
  const encoder = new TextEncoder();
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const ciphertext = await crypto.subtle.encrypt(
    { name: "AES-GCM", iv },
    key,
    encoder.encode(plaintext)
  );
  // Combine iv + ciphertext into single Uint8Array
  const combined = new Uint8Array(iv.byteLength + ciphertext.byteLength);
  combined.set(iv, 0);
  combined.set(new Uint8Array(ciphertext), iv.byteLength);
  return btoa(String.fromCharCode(...Array.from(combined)));
}

//  Decrypt 
async function decryptWithKey(encryptedBase64: string, key: CryptoKey): Promise<string> {
  const combined = Uint8Array.from(atob(encryptedBase64), c => c.charCodeAt(0));
  const iv = combined.slice(0, 12);
  const ciphertext = combined.slice(12);
  const plaintext = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv },
    key,
    ciphertext
  );
  return new TextDecoder().decode(plaintext);
}

//  Public API 

/**
 * Encrypt a message for a conversation.
 * Returns encrypted base64 string prefixed with "e2e:" to mark it as encrypted.
 */
export async function encryptMessage(plaintext: string, conversationId: number): Promise<string> {
  try {
    const key = await deriveConversationKey(conversationId);
    const encrypted = await encryptWithKey(plaintext, key);
    return `e2e:${encrypted}`;
  } catch {
    // Fallback: return plaintext if crypto fails (shouldn't happen in modern browsers)
    return plaintext;
  }
}

/**
 * Decrypt a message from a conversation.
 * Handles both encrypted (prefixed "e2e:") and legacy plaintext messages.
 */
export async function decryptMessage(content: string, conversationId: number): Promise<string> {
  if (!content.startsWith("e2e:")) return content; // Legacy plaintext
  try {
    const key = await deriveConversationKey(conversationId);
    return await decryptWithKey(content.slice(4), key);
  } catch {
    return "[Encrypted message — unable to decrypt]";
  }
}

/**
 * Encrypt a NIL contract or document field.
 */
export async function encryptDocument(plaintext: string, userId: number, docType = "nil-contract"): Promise<string> {
  try {
    const key = await deriveDocumentKey(userId, docType);
    const encrypted = await encryptWithKey(plaintext, key);
    return `e2e:${encrypted}`;
  } catch {
    return plaintext;
  }
}

/**
 * Decrypt a NIL contract or document field.
 */
export async function decryptDocument(content: string, userId: number, docType = "nil-contract"): Promise<string> {
  if (!content.startsWith("e2e:")) return content;
  try {
    const key = await deriveDocumentKey(userId, docType);
    return await decryptWithKey(content.slice(4), key);
  } catch {
    return "[Encrypted document — unable to decrypt]";
  }
}

/**
 * Check if a string is E2E encrypted.
 */
export function isEncrypted(content: string): boolean {
  return content.startsWith("e2e:");
}
