# 🤖 AI Auto Continuous Prompter

> A Chrome extension that automatically sends prompts to an AI chat, waits for the response to finish, and continues with the next prompt.

AI Auto Continuous Prompter is a lightweight browser extension designed for automated AI interaction and testing.

Instead of manually entering the same type of prompts again and again, the extension can:

- Select a prompt automatically
- Insert it into the AI chat input
- Submit the prompt
- Wait for the AI response to finish
- Automatically send the next prompt
- Continue until the user stops the loop

The current version is configured for **Google Gemini**. The project architecture can be extended to support **ChatGPT** and **Claude** with platform-specific integrations.

---

## ✨ Features

### 🔄 Continuous Prompting

Automatically sends prompts one after another without requiring manual input for every request.

### 🎲 Random Prompt Selection

The extension randomly selects prompts from the configured prompt list.

### 📤 Automatic Submission

The extension automatically detects the chat input and attempts to submit the generated prompt.

### ⏳ Response Detection

The extension monitors the AI interface and waits for the current response to finish before starting the next prompt.

### ▶️ Start / Stop Control

The extension popup provides a simple control to start or stop the continuous prompting process.

### 💾 Loop State

The extension uses Chrome local storage to maintain the looping state used by the popup.

### 🧩 Lightweight Architecture

The project does not require:

- Node.js
- npm
- Python
- A backend server
- A database
- API keys

It runs directly as a Chrome extension.

---

## 🖥️ Current Platform Support

| Platform | Status |
|----------|--------|
| Google Gemini | ✅ Currently implemented |
| ChatGPT | 🚧 Planned |
| Claude | 🚧 Planned |

### Google Gemini

The current extension is configured to run on:


https://gemini.google.com/

### 🌐 Installing the Extension on Different Browsers

AI Auto Continuous Prompter is built using **Chrome Extension Manifest V3**.

You can install the extension locally as an **unpacked extension** in supported Chromium-based browsers.

> **Important:** The current extension is configured specifically for Google Gemini, Chatgpt, Claude.

---

## 🟢 Google Chrome

### Step 1 — Download the Project

Clone the repository:

```bash
https://github.com/Ninja-Atmos/AI-Auto-Prompt-Extension-Chatgpt-Gemini-Claud-.git
