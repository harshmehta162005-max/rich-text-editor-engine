// src/engine/types.ts

export type BlockType = 'paragraph' | 'heading-1' | 'heading-2' | 'blockquote';

export interface Block {
  id: string;
  type: BlockType;
  content: string; // The raw text content
  // In Phase 3, we will add 'marks' here for bold/italic ranges
}

export interface EditorState {
  blocks: Block[];
  selection: {
    blockId: string | null; // Which block is active
    cursorOffset: number;   // Cursor position inside the text
  };
}

// These are the only ways to change the state
export type Operation =
  | { type: 'ADD_BLOCK'; index: number; block: Block }
  | { type: 'REMOVE_BLOCK'; blockId: string }
  | { type: 'UPDATE_BLOCK_TEXT'; blockId: string; text: string }
  | { type: 'UPDATE_BLOCK_TYPE'; blockId: string; newType: BlockType } // <--- NEW
  | { type: 'SET_SELECTION'; blockId: string; offset: number }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number };