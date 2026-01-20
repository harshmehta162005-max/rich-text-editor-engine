
import React, { useEffect, useState, useRef } from 'react';

export const FloatingToolbar: React.FC = () => {
  const [position, setPosition] = useState<{ top: number; left: number } | null>(null);
  const toolbarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      
      
      if (!selection || selection.isCollapsed) {
        setPosition(null);
        return;
      }

      
      const range = selection.getRangeAt(0);
      const rect = range.getBoundingClientRect();

      
      if (rect.width === 0) {
        setPosition(null);
        return;
      }

      
      setPosition({
        top: rect.top - 50, 
        left: rect.left + (rect.width / 2) - 60, 
      });
    };

    
    document.addEventListener('selectionchange', handleSelectionChange);
    return () => document.removeEventListener('selectionchange', handleSelectionChange);
  }, []);

  const format = (command: string) => {
    
    document.execCommand(command, false);
  };

  if (!position) return null;

  return (
    <div 
      ref={toolbarRef}
      style={{ top: position.top, left: position.left }}
      className="fixed z-50 bg-gray-900 text-white rounded-lg shadow-xl flex items-center px-2 py-1 gap-1 animate-in fade-in zoom-in-95 duration-100"
      
      onMouseDown={(e) => e.preventDefault()}
    >
      <button 
        onClick={() => format('bold')}
        className="p-2 hover:bg-gray-700 rounded transition-colors font-bold w-8 h-8 flex items-center justify-center"
        title="Bold (Ctrl+B)"
      >
        B
      </button>
      <button 
        onClick={() => format('italic')}
        className="p-2 hover:bg-gray-700 rounded transition-colors italic font-serif w-8 h-8 flex items-center justify-center"
        title="Italic (Ctrl+I)"
      >
        i
      </button>
      <button 
        onClick={() => format('underline')}
        className="p-2 hover:bg-gray-700 rounded transition-colors underline w-8 h-8 flex items-center justify-center"
        title="Underline (Ctrl+U)"
      >
        U
      </button>
      
      
      <div className="w-[1px] h-4 bg-gray-700 mx-1"></div>

      <button 
         onClick={() => format('strikethrough')}
         className="p-2 hover:bg-gray-700 rounded transition-colors line-through w-8 h-8 flex items-center justify-center text-gray-300"
         title="Strike"
      >
        S
      </button>
    </div>
  );
};