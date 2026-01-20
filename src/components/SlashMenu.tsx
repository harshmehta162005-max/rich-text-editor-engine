// src/components/SlashMenu.tsx
import React, { useEffect, useState } from 'react';
import type { BlockType } from '../engine/types';
import { registry } from '../plugins/registry'; // Import Registry

interface Props {
  onSelect: (type: BlockType) => void;
  close: () => void;
}

export const SlashMenu: React.FC<Props> = ({ onSelect, close }) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  
  // DYNAMIC OPTIONS: Get all registered plugins
  const options = registry.getAll().map(plugin => ({
    label: plugin.label,
    type: plugin.type as BlockType,
    desc: plugin.description
  }));

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => (prev + 1) % options.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => (prev - 1 + options.length) % options.length);
      } else if (e.key === 'Enter') {
        e.preventDefault();
        const selectedOption = options[selectedIndex];
        if (selectedOption) {
          onSelect(selectedOption.type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        close();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, onSelect, close, options]);

  return (
    <div className="absolute top-8 left-0 z-50 w-64 bg-white rounded-lg shadow-xl border border-gray-200 py-2 animate-in fade-in zoom-in-95 duration-100">
      <div className="text-xs font-semibold text-gray-500 px-3 py-1 mb-1 uppercase tracking-wider">
        Basic Blocks
      </div>
      {options.map((item, index) => (
        <div
          key={item.type}
          onMouseDown={(e) => {
            e.preventDefault();
            onSelect(item.type);
          }}
          className={`cursor-pointer w-full text-left px-3 py-2 flex items-center gap-2 transition-colors
            ${index === selectedIndex ? 'bg-blue-50 text-blue-800' : 'text-gray-700 hover:bg-gray-100'}
          `}
        >
          <div className="flex-1">
            <div className="text-sm font-medium">{item.label}</div>
            <div className="text-xs text-gray-400">{item.desc}</div>
          </div>
        </div>
      ))}
    </div>
  );
};