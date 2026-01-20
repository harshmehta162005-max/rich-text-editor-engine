
import type { EditorDocument, ElementNode, TextNode } from '../types';


export const isTextNode = (node: unknown): node is TextNode => {
  return typeof node === 'object' && node !== null && (node as any).type === 'text';
};

export const isElementNode = (node: unknown): node is ElementNode => {
  return typeof node === 'object' && node !== null && 'children' in node;
};


export const validateDocument = (doc: EditorDocument): boolean => {
  
  if (doc.children.length === 0) return false;

  
  const hasTextAtRoot = doc.children.some(child => isTextNode(child));
  if (hasTextAtRoot) return false;

  return true;
};