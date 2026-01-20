import type { EditorDocument } from './types';
import { generateId } from './utils/id';

export const createEmptyDocument = (): EditorDocument => ({
  type: 'root',
  children: [
    {
      id: generateId(),
      type: 'paragraph',
      children: [
        {
          id: generateId(),
          type: 'text',
          text: '',
          attributes: {}
        }
      ]
    }
  ]
});