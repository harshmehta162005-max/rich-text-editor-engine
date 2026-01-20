// src/engine/core.ts
import type { EditorState, Operation } from './types';

export const INITIAL_STATE: EditorState = {
  blocks: [
    { id: '1', type: 'heading-1', content: 'Welcome to the Engine' },
    { id: '2', type: 'paragraph', content: 'Start typing...' },
  ],
  selection: { blockId: '2', cursorOffset: 0 },
};

export class EditorEngine {
  private state: EditorState;
  private listeners: ((state: EditorState) => void)[] = [];

  constructor(initialState: EditorState = INITIAL_STATE) {
    this.state = initialState;
  }

  public getState(): EditorState {
    return this.state;
  }

  // The Heart of the Engine
  public apply(op: Operation): void {
    const prevState = this.state;
    let nextState = { ...prevState }; // Shallow copy

    switch (op.type) {
      case 'ADD_BLOCK':
        const newBlocks = [...nextState.blocks];
        newBlocks.splice(op.index, 0, op.block);
        nextState.blocks = newBlocks;
        break;

      case 'REMOVE_BLOCK':
        nextState.blocks = nextState.blocks.filter(b => b.id !== op.blockId);
        break;

      case 'UPDATE_BLOCK_TEXT':
        nextState.blocks = nextState.blocks.map(b =>
          b.id === op.blockId ? { ...b, content: op.text } : b
        );
        break;

      case 'SET_SELECTION':
        nextState.selection = {
          blockId: op.blockId,
          cursorOffset: op.offset
        };
        break;

      case 'MOVE_BLOCK':
        const movedBlocks = [...nextState.blocks];
        const [removed] = movedBlocks.splice(op.fromIndex, 1);

        // FIX: Only insert if a block was actually removed
        if (removed) {
          movedBlocks.splice(op.toIndex, 0, removed);
        }

        nextState.blocks = movedBlocks;
        break;

      case 'UPDATE_BLOCK_TYPE':
        nextState.blocks = nextState.blocks.map(b =>
          b.id === op.blockId ? { ...b, type: op.newType } : b
        );
        break;
    }

    this.state = nextState;
    this.notify();
  }

  // Pub/Sub for UI updates
  public subscribe(listener: (state: EditorState) => void) {
    this.listeners.push(listener);
    return () => {
      this.listeners = this.listeners.filter(l => l !== listener);
    };
  }

  private notify() {
    this.listeners.forEach(l => l(this.state));
  }
}