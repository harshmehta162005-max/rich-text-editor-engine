
import type { Meta, StoryObj } from '@storybook/react';
import { EditableBlock } from './EditableBlock';
import { DraggableBlockWrapper } from './DraggableBlockWrapper';
import { DragDropContext, Droppable } from '@hello-pangea/dnd';
import React from 'react';


const Wrapper = ({ children }: { children: React.ReactNode }) => (
  <DragDropContext onDragEnd={() => {}}>
    <Droppable droppableId="test-droppable">
      {(provided) => (
        <div ref={provided.innerRef} {...provided.droppableProps}>
          {children}
          {provided.placeholder}
        </div>
      )}
    </Droppable>
  </DragDropContext>
);


const meta: Meta<typeof EditableBlock> = {
  title: 'Editor/EditableBlock',
  component: EditableBlock,
  decorators: [
    (Story) => (
      <div className="p-10 bg-gray-50 min-h-[200px]">
        <div className="max-w-2xl mx-auto bg-white p-6 shadow-sm rounded-lg border border-gray-200">
           <Wrapper>
             <Story />
           </Wrapper>
        </div>
      </div>
    ),
  ],
  parameters: {
    
    a11y: {
      config: {
        rules: [{ id: 'color-contrast', enabled: true }],
      },
    },
  },
};

export default meta;
type Story = StoryObj<typeof EditableBlock>;


const mockHandlers = {
  
  updateBlock: (id: string, text: string) => console.log('Update:', id, text),
  addBlock: (id: string) => console.log('Add Block after:', id),
  deleteBlock: (id: string) => console.log('Delete Block:', id),
  updateBlockType: (id: string, type: any) => console.log('Change Type:', id, type),
  onNavigate: (id: string, dir: 'up' | 'down') => console.log('Navigate:', id, dir),
};


export const Paragraph: Story = {
  render: () => (
    <DraggableBlockWrapper blockId="1" index={0}>
      <EditableBlock
        block={{ id: '1', type: 'paragraph', content: 'This is a standard paragraph. Try typing here!' }}
        isFocused={false}
        {...mockHandlers}
      />
    </DraggableBlockWrapper>
  ),
};


export const Heading: Story = {
  render: () => (
    <DraggableBlockWrapper blockId="2" index={0}>
      <EditableBlock
        block={{ id: '2', type: 'heading-1', content: 'Section Title' }}
        isFocused={false}
        {...mockHandlers}
      />
    </DraggableBlockWrapper>
  ),
};


export const EmptyPlaceholder: Story = {
  render: () => (
    <DraggableBlockWrapper blockId="3" index={0}>
      <EditableBlock
        block={{ id: '3', type: 'paragraph', content: '' }}
        isFocused={true} 
        {...mockHandlers}
      />
    </DraggableBlockWrapper>
  ),
};