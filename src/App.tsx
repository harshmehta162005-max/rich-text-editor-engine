// src/App.tsx
import { useCallback } from 'react';
import { useEditor } from './hooks/useEditor';
import { EditableBlock } from './components/EditableBlock';
import { FloatingToolbar } from './components/FloatingToolbar';
import { DragDropContext, Droppable, type DropResult } from '@hello-pangea/dnd';
import { DraggableBlockWrapper } from './components/DraggableBlockWrapper';

const generateId = () => Math.random().toString(36).substr(2, 9);

function App() {
    const { editorState, engine } = useEditor();

    // PERFORMANCE FIX: 
    // We use 'useCallback' and fetch 'engine.getState()' inside.
    // This keeps the function stable so EditableBlock doesn't re-render unnecessarily.

    const handleAddBlock = useCallback((currentBlockId?: string) => {
        const currentState = engine.getState(); // Fetch fresh state
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
        const currentState = engine.getState(); // Fetch fresh state
        const currentIndex = currentState.blocks.findIndex(b => b.id === currentBlockId);

        // Prevent deleting the last remaining block
        if (currentState.blocks.length <= 1) return;

        // Find the previous block to move focus to
        if (currentIndex > 0) {
            const prevBlock = currentState.blocks[currentIndex - 1];

            if (!prevBlock) return;

            // 1. Move selection to the previous block
            engine.apply({
                type: 'SET_SELECTION',
                blockId: prevBlock.id,
                offset: prevBlock.content.length,
            });

            // 2. Remove the current block
            engine.apply({
                type: 'REMOVE_BLOCK',
                blockId: currentBlockId,
            });
        }
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

    return (
        <div className="min-h-screen bg-gray-50 p-8 font-sans">
            <FloatingToolbar />
            <div className="max-w-2xl mx-auto bg-white shadow-sm border border-gray-200 rounded-lg min-h-[500px] flex flex-col">

                <div className="border-b border-gray-100 p-3 flex gap-2">
                    <button
                        onClick={() => handleAddBlock()}
                        className="px-3 py-1 bg-blue-600 text-white text-sm font-medium rounded hover:bg-blue-700 transition-colors"
                    >
                        + Add Paragraph
                    </button>
                    <div className="text-xs text-gray-400 self-center ml-auto">
                        Blocks: {editorState.blocks.length}
                    </div>
                    <button
                        onClick={() => {
                            localStorage.removeItem('rich-editor-content');
                            window.location.reload();
                        }}
                        className="px-3 py-1 bg-red-100 text-red-700 text-sm font-medium rounded hover:bg-red-200 transition-colors"
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
                                                // This is simple value comparison, so it's fine
                                                isFocused={editorState.selection.blockId === block.id}
                                                // These are now STABLE functions, enabling React.memo to work
                                                updateBlock={updateBlockHandler}
                                                addBlock={handleAddBlock}
                                                deleteBlock={handleDeleteBlock}
                                                updateBlockType={handleUpdateBlockType}
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