# Custom Rich Text Editor Engine

A **fully custom rich text editor engine** built from scratch using **React 18**, **TypeScript (strict mode)**, and **Tailwind CSS**.

This is **not** a wrapper around any existing editor framework.  
All document modeling, editing logic, collaboration, plugins, and accessibility are implemented manually.

---

## 🔗 Live Links

| Artifact | Link |
|--------|------|
| Live Editor Demo | https://rich-text-editor-engineee.vercel.app/ |
| Public Storybook | https://rich-text-engine-storybook.vercel.app/ |
| Accessibility Report | `./ACCESSIBILITY.md` |

---

## 🎯 Features

- Block & inline formatting (headings, lists, code, links)
- Slash menu (`/`) and markdown shortcuts
- Keyboard-first editing (no mouse-only actions)
- Semantic HTML output (no `div` / `span` soup)
- Sanitized paste handling (HTML / Markdown)

---

## 🏗 Architecture

- Document stored as a **structured JSON tree**
- Editing performed via **immutable operations**
- Deterministic normalization and invariants
- Controlled block rendering (no contentEditable soup)

---

## 🤝 Collaboration (Simulation)

- Custom operation-based convergence model
- Deterministic state across simulated clients
- No data loss
- Per-user undo / redo that preserves remote edits

📘 Demonstrated in Storybook.

---

## 🧩 Plugin System

Extensible plugin registry for:
- block types
- commands
- toolbars
- slash menu entries
- keyboard shortcuts

New functionality can be added **without modifying core engine code**.

---

## 🧼 Paste Sanitization

- Removes unsafe tags (`script`, `iframe`)
- Strips dangerous attributes (`on*`)
- Normalizes content into editor schema
- Prevents XSS and document corruption

---

## ♿ Accessibility

- Keyboard-only UX supported everywhere
- Correct ARIA roles for editor, menus, and toolbars
- Semantic HTML output
- Tested using `axe-core` and Storybook a11y addon

---

## 📘 Storybook

Public Storybook includes:
- collaboration convergence
- paste sanitization
- keyboard-only usage
- failure recovery
- high-contrast mode

---

## ⚙️ Local Development

```bash
git clone https://github.com/harshmehta162005-max/rich-text-editor-engine.git
cd rich-text-editor-engine

npm install
npm run dev
npm run storybook
