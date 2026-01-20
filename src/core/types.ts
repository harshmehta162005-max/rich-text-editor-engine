

export type NodeId = string;


export type TextAttributes = {
  bold?: boolean;
  italic?: boolean;
  code?: boolean;
  link?: string;
};


export type TextNode = {
  id: NodeId;
  type: 'text';
  text: string;
  attributes: TextAttributes;
};


export type BlockType = 
  | 'paragraph' 
  | 'heading-1' 
  | 'heading-2' 
  | 'heading-3' 
  | 'blockquote' 
  | 'bullet-list' 
  | 'ordered-list' 
  | 'list-item';

export type ElementNode = {
  id: NodeId;
  type: BlockType;
  children: (ElementNode | TextNode)[];
};


export type EditorNode = ElementNode | TextNode;


export type EditorDocument = {
  type: 'root';
  children: ElementNode[]; 
};


export type EditorSelection = {
  anchorId: NodeId;
  anchorOffset: number;
  focusId: NodeId;
  focusOffset: number;
} | null;