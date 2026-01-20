
import type { EditorState, Block, Action } from './types';


export const INITIAL_STATE: EditorState = {
  blocks: [
    { id: '1', type: 'heading-1', content: 'Welcome to the Rich Editor Engine' },
    { id: '2', type: 'paragraph', content: '' },
  ],
  selection: { blockId: '2', cursorOffset: 0 },
};

export class EditorEngine {
    

  private state: EditorState;
  private listeners: ((state: EditorState) => void)[] = [];
  
  
  private history: EditorState[] = [];
  private redoStack: EditorState[] = [];
  private maxHistory = 50;
  private isUndoing = false;

  constructor(initialState: EditorState = INITIAL_STATE) {
    this.state = JSON.parse(JSON.stringify(initialState));
    this.history.push(JSON.parse(JSON.stringify(this.state)));
  }

  getState(): EditorState {
    return this.state;
  }

  subscribe(listener: (state: EditorState) => void) {
    this.listeners.push(listener);
    listener(this.state);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }

  undo() {
    if (this.history.length <= 1) return; 

    this.isUndoing = true;
    
    const current = this.history.pop();
    if (current) this.redoStack.push(current);

    const previous = this.history[this.history.length - 1];
    
    if (previous) {
      this.state = JSON.parse(JSON.stringify(previous));
      this.notify();
    }
    
    this.isUndoing = false;
  }

  redo() {
    if (this.redoStack.length === 0) return;

    this.isUndoing = true;

    const next = this.redoStack.pop();
    if (next) {
      this.history.push(next);
      this.state = JSON.parse(JSON.stringify(next));
      this.notify();
    }

    this.isUndoing = false;
  }

  apply(action: Action) {
    if (!this.isUndoing && action.type !== 'SET_SELECTION') {
        this.history.push(JSON.parse(JSON.stringify(this.state)));
        if (this.history.length > this.maxHistory) this.history.shift();
        this.redoStack = []; 
    }

    const nextState = JSON.parse(JSON.stringify(this.state));

    switch (action.type) {
      case 'ADD_BLOCK': {
        const { index, block } = action;
        nextState.blocks.splice(index, 0, block);
        break;
      }
      case 'REMOVE_BLOCK': {
        nextState.blocks = nextState.blocks.filter((b: Block) => b.id !== action.blockId);
        break;
      }
      case 'UPDATE_BLOCK_TEXT': {
        const block = nextState.blocks.find((b: Block) => b.id === action.blockId);
        if (block) block.content = action.text;
        break;
      }
      case 'UPDATE_BLOCK_TYPE': {
        const block = nextState.blocks.find((b: Block) => b.id === action.blockId);
        if (block) block.type = action.newType;
        break;
      }
      case 'MOVE_BLOCK': {
        const { fromIndex, toIndex } = action;
        const [movedBlock] = nextState.blocks.splice(fromIndex, 1);
        nextState.blocks.splice(toIndex, 0, movedBlock);
        break;
      }
      case 'SET_SELECTION': {
        nextState.selection = {
           blockId: action.blockId,
           cursorOffset: action.offset 
        };
        break;
      }
    }

    this.state = nextState;
    this.notify();
  }
}