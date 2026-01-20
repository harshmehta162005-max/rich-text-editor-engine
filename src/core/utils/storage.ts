
import type { EditorState } from '../../engine/types';

const STORAGE_KEY = 'rich-editor-content';

export const saveContent = (state: EditorState): void => {
  try {
    const json = JSON.stringify(state);
    localStorage.setItem(STORAGE_KEY, json);
    console.log('Saved to local storage'); 
  } catch (error) {
    console.error('Failed to save content:', error);
  }
};

export const loadContent = (): EditorState | null => {
  try {
    const json = localStorage.getItem(STORAGE_KEY);
    if (!json) return null;
    return JSON.parse(json) as EditorState;
  } catch (error) {
    console.error('Failed to load content:', error);
    return null;
  }
};