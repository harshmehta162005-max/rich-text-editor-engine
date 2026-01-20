
import type { BlockPlugin } from './types';

class PluginRegistry {
  private plugins: Map<string, BlockPlugin> = new Map();

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