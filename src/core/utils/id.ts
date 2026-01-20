export const generateId = (): string => {
  // Use modern crypto API if available
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  // Fallback for safety
  return Math.random().toString(36).substring(2, 15);
};