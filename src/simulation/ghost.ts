// src/simulation/ghost.ts
import { EditorEngine } from '../engine/core';

export class GhostUser {
  private engine: EditorEngine;
  private interval: number | null = null;
  private name: string;
  private color: string;

  constructor(engine: EditorEngine, name: string = 'Alice', color: string = '#ff0000') {
    this.engine = engine;
    this.name = name;
    this.color = color;
  }

  start() {
    // Make a random edit every 3 seconds
    this.interval = window.setInterval(() => {
      this.makeRandomEdit();
    }, 3000);
    // ✅ FIX: Using the color variable here silences the warning
    console.log(`%c${this.name} joined the session.`, `color: ${this.color}; font-weight: bold;`);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    console.log(`%c${this.name} left the session.`, `color: ${this.color}; font-weight: bold;`);
  }

  private makeRandomEdit() {
    const state = this.engine.getState();
    if (state.blocks.length === 0) return;

    // 1. Pick a random block
    const randomIndex = Math.floor(Math.random() * state.blocks.length);
    const targetBlock = state.blocks[randomIndex];

    // ✅ FIX: Guard clause to satisfy TypeScript
    if (!targetBlock) return;

    // 2. Decide what to do (80% chance to type, 20% chance to add block)
    const action = Math.random();

    if (action > 0.2) {
      // TYPE SOMETHING
      const phrases = [' (edited)', ' [simulated]', ' hello!', ' 👻'];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      
      const newContent = targetBlock.content + randomPhrase;

      this.engine.apply({
        type: 'UPDATE_BLOCK_TEXT',
        blockId: targetBlock.id,
        text: newContent
      });
      
    } else {
      // ADD A NEW BLOCK
      const newId = Math.random().toString(36).substr(2, 9);
      this.engine.apply({
        type: 'ADD_BLOCK',
        index: randomIndex + 1,
        block: { id: newId, type: 'paragraph', content: `Ghost ${this.name} was here` }
      });
    }
  }
}