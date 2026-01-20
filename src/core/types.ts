/**
 * CORE SCHEMA
 * A recursive tree structure with unique IDs for collaboration.
 */

export type NodeId = string;

// Styling for text (Bold, Italic, etc.)
export type TextAttributes = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: string;
};

// 1. Text Node (Leaf)
export type TextNode = {
  id: NodeId;
  type: 'text';
  text: string;
  attributes: TextAttributes;
};

// 2. Block Nodes (Paragraphs, Headings, Lists)
export type BlockType = 
  | 'paragraph' 
  | 'heading-1' 
  | 'heading-2' 
  | 'heading-3' 
  | 'blockquote' 
  | 'bullet-list' 
  | 'ordered-list' 
  | 'list-item';

export type ElementNode = {
  id: NodeId;
  type: BlockType;
  children: (ElementNode | TextNode)[];
};

// Union of all node types
export type EditorNode = ElementNode | TextNode;

// 3. The Root Document
export type EditorDocument = {
  type: 'root';
  children: ElementNode[]; // Root can only contain blocks
};

// 4. Selection (Path-based, not DOM-based)
export type EditorSelection = {
  anchorId: NodeId;
  anchorOffset: number;
  focusId: NodeId;
  focusOffset: number;
} | null;