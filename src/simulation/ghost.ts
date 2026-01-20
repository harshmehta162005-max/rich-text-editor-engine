
import { EditorEngine } from '../engine/core';

export class GhostUser {
  private engine: EditorEngine;
  private interval: number | null = null;
  private name: string;
  private color: string;

  constructor(engine: EditorEngine, name: string = 'Ram', color: string = '#ff0000') {
    this.engine = engine;
    this.name = name;
    this.color = color;
  }

  start() {
    
    this.interval = window.setInterval(() => {
      this.makeRandomEdit();
    }, 3000);
    
    console.log(`%c${this.name} joined the session.`, `color: ${this.color}; font-weight: bold;`);
  }

  stop() {
    if (this.interval) clearInterval(this.interval);
    console.log(`%c${this.name} left the session.`, `color: ${this.color}; font-weight: bold;`);
  }

  private makeRandomEdit() {
    const state = this.engine.getState();
    if (state.blocks.length === 0) return;

    
    const randomIndex = Math.floor(Math.random() * state.blocks.length);
    const targetBlock = state.blocks[randomIndex];

    
    if (!targetBlock) return;

    
    const action = Math.random();

    if (action > 0.2) {
      
      const phrases = [' (edited)', ' [simulated]', ' hello!', ' 👻'];
      const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
      
      const newContent = targetBlock.content + randomPhrase;

      this.engine.apply({
        type: 'UPDATE_BLOCK_TEXT',
        blockId: targetBlock.id,
        text: newContent
      });
      
    } else {
      
      const newId = Math.random().toString(36).substr(2, 9);
      this.engine.apply({
        type: 'ADD_BLOCK',
        index: randomIndex + 1,
        block: { id: newId, type: 'paragraph', content: `Ghost ${this.name} was here` }
      });
    }
  }
}