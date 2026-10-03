const PROMPTS = [
  "Explain quantum entanglement with an everyday analogy.",
  "What are 3 practical productivity strategies for deep focus?",
  "Write a micro-fiction story about an astronaut finding an old cassette in orbit.",
  "Summarize key differences between monolithic and microservice architectures.",
  "Share 4 fascinating, lesser-known historical facts.",
  "Write a witty haiku about debugging code.",
  "How does a mechanical watch escapement regulate time?",
  "Suggest 3 unique ideas for a side-project web application."
];

let isRunning = false;
let checkInterval = null;

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "START") {
    isRunning = true;
    startNextCycle();
  } else if (request.action === "STOP") {
    stopCycle();
  }
});

function getRandomPrompt() {
  return PROMPTS[Math.floor(Math.random() * PROMPTS.length)];
}

function stopCycle() {
  isRunning = false;
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

function startNextCycle() {
  if (!isRunning) return;
  const prompt = getRandomPrompt();
  sendPrompt(prompt);
}

function sendPrompt(text) {
  const editable =
    document.querySelector('div[contenteditable="true"]') ||
    document.querySelector('rich-textarea p') ||
    document.querySelector('.ql-editor');

  if (!editable) {
    console.warn("Input element not found. Retrying in 2s...");
    setTimeout(() => { if (isRunning) sendPrompt(text); }, 2000);
    return;
  }

  editable.focus();
  editable.innerText = text;
  editable.dispatchEvent(new Event("input", { bubbles: true }));

  setTimeout(() => {
    const sendBtn =
      document.querySelector('button[aria-label*="Send message"]') ||
      document.querySelector('button[aria-label*="Send prompt"]') ||
      document.querySelector('.send-button');

    if (sendBtn && !sendBtn.disabled) {
      sendBtn.click();
    } else {
      editable.dispatchEvent(new KeyboardEvent("keydown", {
        key: "Enter",
        code: "Enter",
        keyCode: 13,
        which: 13,
        bubbles: true
      }));
    }

    waitForResponseCompletion();
  }, 500);
}

function waitForResponseCompletion() {
  if (checkInterval) clearInterval(checkInterval);

  setTimeout(() => {
    checkInterval = setInterval(() => {
      if (!isRunning) {
        clearInterval(checkInterval);
        return;
      }

      const stopBtn =
        document.querySelector('button[aria-label*="Stop"]') ||
        document.querySelector('button[aria-label*="Stop response"]');

      const isGenerating = Boolean(stopBtn && stopBtn.offsetParent !== null);

      if (!isGenerating) {
        clearInterval(checkInterval);
        checkInterval = null;

        setTimeout(() => {
          if (isRunning) {
            startNextCycle();
          }
        }, 2500);
      }
    }, 1000);
  }, 2000);
}