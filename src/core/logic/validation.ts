// Notice the 'type' keyword below
import type { EditorDocument, ElementNode, TextNode } from '../types';

// Type Guards
export const isTextNode = (node: unknown): node is TextNode => {
  return typeof node === 'object' && node !== null && (node as any).type === 'text';
};

export const isElementNode = (node: unknown): node is ElementNode => {
  return typeof node === 'object' && node !== null && 'children' in node;
};

// Invariant Checks
export const validateDocument = (doc: EditorDocument): boolean => {
  // Rule 1: Doc must not be empty
  if (doc.children.length === 0) return false;

  // Rule 2: Root cannot contain raw text
  const hasTextAtRoot = doc.children.some(child => isTextNode(child));
  if (hasTextAtRoot) return false;

  return true;
};