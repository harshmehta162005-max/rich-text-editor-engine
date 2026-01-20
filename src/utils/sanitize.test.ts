// @ts-nocheck
import { sanitizeContent } from './sanitize';


const describe = (name: string, fn: () => void) => { console.log(`\nSuite: ${name}`); fn(); };
const test = (name: string, fn: () => void) => { 
  try { 
    fn(); 
    console.log(`  ✅ ${name}`); 
  } catch (e) { 
    console.error(`  ❌ ${name}`); 
  }
};

describe('Security: Sanitization', () => {
  
  test('strips script tags', () => {
    const input = 'Hello <script>alert("hack")</script> World';
    const output = sanitizeContent(input);
    if (output !== 'Hello  World') throw new Error('Script not removed');
  });

  test('strips event handlers', () => {
    const input = 'Click me <div onclick="steal()">Button</div>';
    const output = sanitizeContent(input);
    if (output.includes('onclick')) throw new Error('Handler not removed');
  });

  test('preserves safe text', () => {
    const input = 'Just normal text';
    const output = sanitizeContent(input);
    if (output !== 'Just normal text') throw new Error('Safe text mutated');
  });
});