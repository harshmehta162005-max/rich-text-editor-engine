
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
          className={`group flex items-start gap-2 mb-2 relative -ml-8 pr-4 ${
            snapshot.isDragging ? 'opacity-50 bg-white shadow-lg rounded-lg pointer-events-none' : ''
          }`}
        >
          
          <div
            {...provided.dragHandleProps}
            className="mt-1.5 p-1 rounded hover:bg-gray-200 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
            contentEditable={false} // Critical: prevents cursor from entering handle
          >
            
            <svg width="12" height="12" viewBox="0 0 24 24" fill="#9CA3AF">
              <path d="M8 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM8 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM18 6a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM18 12a2 2 0 1 1-4 0 2 2 0 0 1 4 0zM18 18a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
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