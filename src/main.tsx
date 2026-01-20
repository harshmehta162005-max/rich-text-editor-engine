
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';


import { registry } from './plugins/registry';
import { ParagraphPlugin, Heading1Plugin, Heading2Plugin, BlockquotePlugin } from './plugins/basics';


registry.register(ParagraphPlugin);
registry.register(Heading1Plugin);
registry.register(Heading2Plugin);
registry.register(BlockquotePlugin);

createRoot(document.getElementById('root')!).render(
  <App />
);