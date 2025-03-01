// utils/formatters.ts

/**
 * Formats a feedback ID to display format LRT-XXXX where XXXX is the first 4 characters of the ID
 * @param id - The original feedback ID
 * @returns Formatted feedback ID
 */
export const formatFeedbackId = (id: string): string => {
  // If the ID is undefined or empty, return a placeholder
  if (!id) return "LRT-0000";

  // Extract the first 4 characters from the ID
  // If the ID is shorter than 4 characters, use the entire ID
  const idPart = id.length >= 4 ? id.substring(0, 4) : id.padEnd(4, "0");

  // Return the formatted ID
  return `LRT-${idPart}`;
};
