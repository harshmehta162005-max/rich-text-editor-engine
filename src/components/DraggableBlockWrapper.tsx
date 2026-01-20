
import React from 'react';
import { Draggable } from '@hello-pangea/dnd';

interface Props {
  blockId: string;
  index: number;
  children: React.ReactNode;
}

export const DraggableBlockWrapper: React.FC<Props> = ({ blockId, index, children }) => {
  return (
    <Draggable draggableId={blockId} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          className={`group flex items-start gap-2 mb-2 relative -ml-8 px-2 rounded
            ${snapshot.isDragging ? 'bg-blue-50 opacity-90 shadow-lg z-50' : ''}
          `}
        >
          
          <div
            {...provided.dragHandleProps}
            
            aria-label="Drag to move block" 
            role="button"
            tabIndex={0} 
            
            className="mt-1.5 p-1 rounded hover:bg-gray-100 cursor-grab active:cursor-grabbing text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity"
            contentEditable={false}
          >
            <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
              <path d="M8 6a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm8-16a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4zm0 8a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
            </svg>
          </div>

         
          <div className="flex-1 min-w-0">
            {children}
          </div>
        </div>
      )}
    </Draggable>
  );
};