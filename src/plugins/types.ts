// src/plugins/types.ts
import type { CSSProperties, FC, HTMLAttributes, Ref } from 'react'; // <--- Import Ref
import type { Block } from '../engine/types';

export interface BlockProps extends HTMLAttributes<HTMLElement> {
  block: Block;
  className?: string;
  style?: CSSProperties;
  innerRef?: Ref<HTMLElement>; // <--- Add this custom ref prop
}

export interface BlockPlugin {
  type: string;
  label: string;
  description: string;
  Component: FC<BlockProps>;
  baseStyles?: string;
}