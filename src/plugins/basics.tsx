
import React from 'react';
import type { BlockPlugin } from './types';

export const ParagraphPlugin: BlockPlugin = {
  type: 'paragraph',
  label: 'Paragraph',
  description: 'Just plain text',
  baseStyles: 'text-base mb-2 min-h-[1.5em]',
  Component: ({ className, style, innerRef, ...props }) => (
    <div 
      // Cast the ref to satisfy TypeScript
      ref={innerRef as React.Ref<HTMLDivElement>} 
      className={className} 
      style={style} 
      {...props} 
    />
  ),
};

export const Heading1Plugin: BlockPlugin = {
  type: 'heading-1',
  label: 'Heading 1',
  description: 'Big section heading',
  baseStyles: 'text-3xl font-bold mb-4',
  Component: ({ className, style, innerRef, ...props }) => (
    <h1 
      ref={innerRef as React.Ref<HTMLHeadingElement>} 
      className={className} 
      style={style} 
      {...props} 
    />
  ),
};

export const Heading2Plugin: BlockPlugin = {
  type: 'heading-2',
  label: 'Heading 2',
  description: 'Medium section heading',
  baseStyles: 'text-2xl font-bold mb-3',
  Component: ({ className, style, innerRef, ...props }) => (
    <h2 
      ref={innerRef as React.Ref<HTMLHeadingElement>} 
      className={className} 
      style={style} 
      {...props} 
    />
  ),
};

export const BlockquotePlugin: BlockPlugin = {
  type: 'blockquote',
  label: 'Blockquote',
  description: 'Capture a quote',
  baseStyles: 'border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-4 bg-gray-50 py-2',
  Component: ({ className, style, innerRef, ...props }) => (
    <blockquote 
      ref={innerRef as React.Ref<HTMLQuoteElement>} 
      className={className} 
      style={style} 
      {...props} 
    />
  ),
};