
import React, { useCallback } from 'react';
import { useEditor } from './hooks/useEditor';
import { EditableBlock } from './components/EditableBlock';
import { FloatingToolbar } from './components/FloatingToolbar';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { DraggableBlockWrapper } from './components/DraggableBlockWrapper';

const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
  const { editorState, engine, isCollabActive, toggleCollab } = useEditor();

  const handleAddBlock = useCallback((currentBlockId?: string) => {
    const currentState = engine.getState();
    const newId = generateId();
    let index = currentState.blocks.length;

    if (currentBlockId) {
      const currentIndex = currentState.blocks.findIndex(b => b.id === currentBlockId);
      if (currentIndex !== -1) index = currentIndex + 1;
    }

    engine.apply({
      type: 'ADD_BLOCK',
      index: index,
      block: { id: newId, type: 'paragraph', content: '' },
    });

    engine.apply({
      type: 'SET_SELECTION',
      blockId: newId,
      offset: 0,
    });
  }, [engine]);

  const handleDeleteBlock = useCallback((currentBlockId: string) => {
    const state = engine.getState();
    const index = state.blocks.findIndex(b => b.id === currentBlockId);

    
    if (index <= 0) return;

    const currentBlock = state.blocks[index];
    const prevBlock = state.blocks[index - 1];

    if (!currentBlock || !prevBlock) return;

    
    const newCursorOffset = prevBlock.content.length;

    
    const mergedText = prevBlock.content + currentBlock.content;

    
    engine.apply({
      type: 'UPDATE_BLOCK_TEXT',
      blockId: prevBlock.id,
      text: mergedText
    });

    
    engine.apply({
      type: 'REMOVE_BLOCK',
      blockId: currentBlockId
    });

    
    setTimeout(() => {
      engine.apply({
        type: 'SET_SELECTION',
        blockId: prevBlock.id,
        offset: newCursorOffset
      });
    }, 0);

  }, [engine]);

  const handleUpdateBlockType = useCallback((id: string, newType: any) => {
    engine.apply({
      type: 'UPDATE_BLOCK_TYPE',
      blockId: id,
      newType: newType,
    });
    engine.apply({
      type: 'UPDATE_BLOCK_TEXT',
      blockId: id,
      text: '',
    });
    setTimeout(() => {
      engine.apply({
        type: 'SET_SELECTION',
        blockId: id,
        offset: 0
      });
    }, 10);
  }, [engine]);

  const updateBlockHandler = useCallback((id: string, text: string) => {
    engine.apply({
      type: 'UPDATE_BLOCK_TEXT',
      blockId: id,
      text: text,
    });
  }, [engine]);

  
  const handleNavigation = useCallback((currentBlockId: string, direction: 'up' | 'down') => {
    const state = engine.getState();
    const index = state.blocks.findIndex(b => b.id === currentBlockId);
    if (index === -1) return;

    let targetBlock;
    if (direction === 'up') {
      if (index > 0) targetBlock = state.blocks[index - 1];
    } else {
      if (index < state.blocks.length - 1) targetBlock = state.blocks[index + 1];
    }

    if (targetBlock) {
      engine.apply({
        type: 'SET_SELECTION',
        blockId: targetBlock.id,
        
        offset: direction === 'up' ? targetBlock.content.length : 0
      });
    }
  }, [engine]);

  const onDragEnd = useCallback((result: DropResult) => {
    const { destination, source } = result;

    if (!destination || destination.index === source.index) {
      return;
    }

    engine.apply({
      type: 'MOVE_BLOCK',
      fromIndex: source.index,
      toIndex: destination.index,
    });
  }, [engine]);

  React.useEffect(() => {
    const handleGlobalKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (e.shiftKey) {
          engine.redo();
        } else {
          engine.undo();
        }
      }
    };

    document.addEventListener('keydown', handleGlobalKeyDown);
    return () => document.removeEventListener('keydown', handleGlobalKeyDown);
  }, [engine]);

  return (
    <div className="min-h-screen bg-gray-50 p-8 font-sans">
      <FloatingToolbar />
      <div className="max-w-2xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg min-h-[500px] flex flex-col">

        <div className="border-b border-gray-100 p-3 flex gap-2 items-center">
          <button
            onClick={() => handleAddBlock()}
            className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
          >
            + Add Paragraph
          </button>

          <button
            onClick={toggleCollab}
            className={`px-3 py-1 text-sm font-medium rounded transition-colors flex items-center gap-2
              ${isCollabActive
                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
          >
            <span className={`w-2 h-2 rounded-full ${isCollabActive ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`} />
            {isCollabActive ? 'Alice is Typing...' : 'Simulate Partner'}
          </button>

          <div className="text-xs text-gray-400 self-center ml-auto">
            Blocks: {editorState.blocks.length}
          </div>

          <button
            onClick={() => {
              localStorage.removeItem('rich-editor-content');
              window.location.reload();
            }}
            className="px-3 py-1 bg-red-50 text-red-600 text-sm font-medium rounded hover:bg-red-100 transition-colors"
          >
            Reset
          </button>
        </div>

        <div className="p-8 flex-1 pl-12">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="editor-content">
              {(provided) => (
                <div
                  ref={provided.innerRef}
                  {...provided.droppableProps}
                >
                  {editorState.blocks.map((block, index) => (
                    <DraggableBlockWrapper
                      key={block.id}
                      blockId={block.id}
                      index={index}
                    >
                      <EditableBlock
                        block={block}
                        isFocused={editorState.selection.blockId === block.id}

                        caretPosition={
                          editorState.selection.blockId === block.id
                            ? editorState.selection.cursorOffset
                            : undefined
                        }

                        updateBlock={updateBlockHandler}
                        addBlock={handleAddBlock}
                        deleteBlock={handleDeleteBlock}
                        updateBlockType={handleUpdateBlockType}
                        
                        
                        onNavigate={handleNavigation}
                      />
                    </DraggableBlockWrapper>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      </div>
    </div>
  );
}

export default App;