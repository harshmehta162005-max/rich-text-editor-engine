
export const sanitizeContent = (html: string): string => {
  if (!html) return '';
  
  
  let clean = html.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");
  
  
  clean = clean.replace(/ on\w+="[^"]*"/g, "");
  
  
  return clean.trim();
};