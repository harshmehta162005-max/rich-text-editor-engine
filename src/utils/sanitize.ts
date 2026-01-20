
export const sanitizeContent = (dirtyText: string): string => {
  
  let clean = dirtyText.replace(/<script\b[^>]*>([\s\S]*?)<\/script>/gim, "");

 
  clean = clean.replace(/ on\w+="[^"]*"/g, "");

  
  clean = clean.replace(/<[^>]*>?/gm, "");

  return clean;
};