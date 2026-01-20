
import { useEffect, useState, useRef } from 'react';
import { EditorEngine, INITIAL_STATE } from '../engine/core';
import type { EditorState } from '../engine/types';
import { saveContent, loadContent } from '../core/utils/storage';
import { GhostUser } from '../simulation/ghost';

export function useEditor() {
  const engineRef = useRef<EditorEngine>(new EditorEngine(
    loadContent() || INITIAL_STATE
  ));
  const engine = engineRef.current;
  const [editorState, setEditorState] = useState<EditorState>(engine.getState());
  
  
  const [isCollabActive, setIsCollabActive] = useState(false);

  useEffect(() => {
    const unsubscribe = engine.subscribe((newState) => {
      setEditorState(newState);
      saveContent(newState);
    });
    return () => unsubscribe();
  }, [engine]);

  
  useEffect(() => {
    if (!isCollabActive) return;

    const ghost = new GhostUser(engine, 'Alice', '#ff0000');
    ghost.start();

    return () => {
      ghost.stop();
    };
  }, [engine, isCollabActive]);

  return {
    editorState,
    engine,
    isCollabActive,
    toggleCollab: () => setIsCollabActive(prev => !prev)
  };
}