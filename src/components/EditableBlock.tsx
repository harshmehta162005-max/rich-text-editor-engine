
import React, { useRef, useEffect, useState, memo, useLayoutEffect } from 'react';
import type { Block, BlockType } from '../engine/types';
import { SlashMenu } from './SlashMenu';
import { registry } from '../plugins/registry'; 
import { ParagraphPlugin } from '../plugins/basics'; 
import { sanitizeContent } from '../utils/sanitize'; 

interface Props {
  block: Block;
  isFocused: boolean;
  caretPosition?: number;
  updateBlock: (id: string, text: string) => void;
  addBlock: (currentBlockId: string) => void;
  deleteBlock: (currentBlockId: string) => void;
  updateBlockType: (id: string, type: BlockType) => void;
  
  onNavigate: (id: string, direction: 'up' | 'down') => void;
}

const EditableBlockComponent: React.FC<Props> = ({ 
  block, 
  isFocused, 
  caretPosition, 
  updateBlock, 
  addBlock, 
  deleteBlock, 
  updateBlockType,
  onNavigate 
}) => {
  const contentRef = useRef<HTMLElement>(null);
  const [showMenu, setShowMenu] = useState(false);

  const plugin = registry.get(block.type) || ParagraphPlugin;
  const Component = plugin.Component;

  
  useEffect(() => {
    if (contentRef.current && contentRef.current.innerHTML !== block.content) {
      contentRef.current.innerHTML = block.content;
    }
  }, [block.content]);

  
  useLayoutEffect(() => {
    if (isFocused && contentRef.current && caretPosition !== undefined) {
      const element = contentRef.current;
      if (document.activeElement !== element) {
        element.focus();
      }
      try {
        const selection = window.getSelection();
        const range = document.createRange();
        const textNode = element.firstChild || element;
        const maxOffset = textNode.textContent?.length || 0;
        const safeOffset = Math.min(caretPosition, maxOffset);

        range.setStart(textNode, safeOffset);
        range.setEnd(textNode, safeOffset);
        
        selection?.removeAllRanges();
        selection?.addRange(range);
      } catch (e) {
        // Silent fail
      }
    }
  }, [isFocused, caretPosition]); 

  
  useEffect(() => {
    if (isFocused && block.content === '/') {
      setShowMenu(true);
    } else {
      setShowMenu(false);
    }
  }, [block.content, isFocused]);

  
  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const text = e.clipboardData.getData('text/plain');
    const cleanText = sanitizeContent(text);
    document.execCommand('insertText', false, cleanText);
    if (contentRef.current) {
        updateBlock(block.id, contentRef.current.innerHTML);
    }
  };

  const handleInput = (e: React.FormEvent<HTMLElement>) => {
    const newHtml = e.currentTarget.innerHTML;
    if (newHtml !== block.content) {
      updateBlock(block.id, newHtml);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (showMenu) {
      if (e.key === 'ArrowUp' || e.key === 'ArrowDown' || e.key === 'Enter') {
        e.preventDefault(); return; 
      }
      if (e.key === 'Escape') {
        setShowMenu(false); return;
      }
    }

    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      addBlock(block.id);
    }

    if (e.key === 'Backspace') {
      const selection = window.getSelection();
      const isAtStart = selection?.anchorOffset === 0 && selection?.isCollapsed;

      if (isAtStart) {
        e.preventDefault();
        deleteBlock(block.id);
      } else if (!block.content || block.content === '<br>') {
        e.preventDefault();
        deleteBlock(block.id);
      }
    }

    
    if (e.key === 'ArrowUp') {
      const selection = window.getSelection();
      
      if (selection?.anchorOffset === 0) {
        e.preventDefault();
        onNavigate(block.id, 'up');
      }
    }

    if (e.key === 'ArrowDown') {
      const selection = window.getSelection();
      const textLength = contentRef.current?.textContent?.length || 0;
     
      if (selection?.anchorOffset === textLength) {
        e.preventDefault();
        onNavigate(block.id, 'down');
      }
    }
  };

  const onMenuSelect = (type: BlockType) => {
    updateBlockType(block.id, type);
    setShowMenu(false);
    setTimeout(() => {
      contentRef.current?.focus();
    }, 0);
  };

  const isEmpty = !block.content 
    || block.content === '<br>' 
    || block.content.trim() === '';

  return (
    <div className="relative group"> 
      <Component
        innerRef={contentRef} 
        block={block}
        
        onPaste={handlePaste}
        onInput={handleInput}
        onKeyDown={handleKeyDown}
        
        contentEditable
        suppressContentEditableWarning
        role="textbox"
        
        className={`outline-none rounded px-1 transition-colors relative ${plugin.baseStyles || ''} 
          ${isEmpty ? 'is-empty' : ''}

          [&.is-empty]:before:content-[attr(data-placeholder)] 
          [&.is-empty]:before:text-gray-300 
          [&.is-empty]:before:absolute 
          [&.is-empty]:before:top-0
          [&.is-empty]:before:left-1
          [&.is-empty]:before:pointer-events-none
          [&.is-empty]:before:select-none
        `}
        data-placeholder={isFocused ? "Type '/' for commands" : "Type something..."}
      />
      {showMenu && (
        <SlashMenu onSelect={onMenuSelect} close={() => setShowMenu(false)} />
      )}
    </div>
  );
};

export const EditableBlock = memo(EditableBlockComponent, (prev, next) => {
  return (
    prev.block.content === next.block.content &&
    prev.block.type === next.block.type &&
    prev.isFocused === next.isFocused &&
    prev.block.id === next.block.id &&
    prev.caretPosition === next.caretPosition
  );
});