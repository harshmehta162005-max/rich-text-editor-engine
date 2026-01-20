// src/hooks/useEditor.ts
import { useEffect, useState, useRef } from 'react';
import { EditorEngine, INITIAL_STATE } from '../engine/core';
import type { EditorState } from '../engine/types';
import { saveContent, loadContent } from '../core/utils/storage';
// Import the Ghost
import { GhostUser } from '../simulation/ghost';

export function useEditor() {
  const engineRef = useRef<EditorEngine>(new EditorEngine(
    loadContent() || INITIAL_STATE
  ));
  const engine = engineRef.current;
  const [editorState, setEditorState] = useState<EditorState>(engine.getState());

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setEditorState(newState);
      saveContent(newState);
    });

    // SIMULATION START
    // Create a fake user named "Alice"
    const ghost = new GhostUser(engine, 'Alice', '#ff0000');
    // Start her after 2 seconds
    const timer = setTimeout(() => {
       ghost.start(); 
    }, 2000);

    return () => {
      unsubscribe();
      ghost.stop(); // Cleanup
      clearTimeout(timer);
    };
  }, [engine]);

  return {
    editorState,
    engine,
  };
}