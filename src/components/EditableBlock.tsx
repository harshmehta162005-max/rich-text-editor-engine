// src/components/EditableBlock.tsx
import React, { useRef, useEffect, useState, memo } from 'react';
import type { Block, BlockType } from '../engine/types';
import { SlashMenu } from './SlashMenu';
import { registry } from '../plugins/registry'; 
import { ParagraphPlugin } from '../plugins/basics'; 

interface Props {
  block: Block;
  isFocused: boolean;
  updateBlock: (id: string, text: string) => void;
  addBlock: (currentBlockId: string) => void;
  deleteBlock: (currentBlockId: string) => void;
  updateBlockType: (id: string, type: BlockType) => void;
}

const EditableBlockComponent: React.FC<Props> = ({ 
  block, 
  isFocused, 
  updateBlock, 
  addBlock,
  deleteBlock,
  updateBlockType 
}) => {
  const contentRef = useRef<HTMLElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  // LOOKUP THE PLUGIN
  const plugin = registry.get(block.type) || ParagraphPlugin;
  const Component = plugin.Component;

  useEffect(() => {
    if (isFocused && contentRef.current) {
      contentRef.current.focus();
    }
  }, [isFocused]);

  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== block.content) {
      contentRef.current.innerHTML = block.content;
    }
    if (isFocused && block.content === '/') {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  }, [block.content, isFocused]);

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const newHtml = e.currentTarget.innerHTML;
    updateBlock(block.id, newHtml);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMenu) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault(); 
        return; 
      }
      if (e.key === 'Escape') {
        setShowMenu(false);
        return;
      }
    }
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(block.id);
    }
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      deleteBlock(block.id);
    }
  };

  const onMenuSelect = (type: BlockType) => {
    updateBlockType(block.id, type);
    setShowMenu(false);
    setTimeout(() => {
      contentRef.current?.focus();
    }, 0);
  };

  return (
    <div className="relative group"> 
      {/* RENDER DYNAMICALLY */}
      <Component
        // ✅ FIX: Use innerRef (matches your plugin definition)
        innerRef={contentRef} 
        
        block={block}
        
        // Pass event handlers
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        
        // ContentEditable Props
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        
        // Dynamic Styles from Plugin
        className={`outline-none rounded px-1 transition-colors ${plugin.baseStyles || ''} 
          empty:before:content-[attr(data-placeholder)] empty:before:text-gray-300 empty:before:absolute`}
        
        // HTML Injection
        dangerouslySetInnerHTML={{ __html: block.content }}
        
        // Placeholder
        data-placeholder={isFocused ? "Type '/' for commands" : "Type something..."}
      />

      {showMenu && (
        <SlashMenu 
            onSelect={onMenuSelect} 
            close={() => setShowMenu(false)} 
        />
      )}
    </div>
  );
};

export const EditableBlock = memo(EditableBlockComponent, (prev, next) => {
  return (
    prev.block.content === next.block.content &&
    prev.block.type === next.block.type &&
    prev.isFocused === next.isFocused &&
    prev.block.id === next.block.id
  );
});