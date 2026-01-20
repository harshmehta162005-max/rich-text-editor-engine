
import type { BlockPlugin } from './types';
import { 
  ParagraphPlugin, 
  Heading1Plugin, 
  Heading2Plugin, 
  BlockquotePlugin 
} from './basics';

class PluginRegistry {
  private plugins: Map<string, BlockPlugin> = new Map();

  constructor() {
    
    this.register(ParagraphPlugin);
    this.register(Heading1Plugin);
    this.register(Heading2Plugin);
    this.register(BlockquotePlugin);
  }

  register(plugin: BlockPlugin) {
    this.plugins.set(plugin.type, plugin);
  }

  get(type: string): BlockPlugin | undefined {
    return this.plugins.get(type);
  }

  getAll(): BlockPlugin[] {
    return Array.from(this.plugins.values());
  }
}

export const registry = new PluginRegistry();