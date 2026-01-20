

export type BlockType = 'paragraph' | 'heading-1' | 'heading-2' | 'blockquote';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
}

export interface SelectionState {
  blockId: string | null;
  cursorOffset: number;
}

export interface EditorState {
  blocks: Block[];
  selection: SelectionState;
}


export type Action = 
  | { type: 'ADD_BLOCK'; index: number; block: Block }
  | { type: 'REMOVE_BLOCK'; blockId: string }
  | { type: 'UPDATE_BLOCK_TEXT'; blockId: string; text: string }
  | { type: 'UPDATE_BLOCK_TYPE'; blockId: string; newType: BlockType }
  | { type: 'MOVE_BLOCK'; fromIndex: number; toIndex: number }
  | { type: 'SET_SELECTION'; blockId: string | null; offset: number };