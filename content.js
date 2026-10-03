let isRunning = false;
let checkInterval = null;

// Dynamic pools to construct completely unique questions
const TEMPLATES = [
  "Explain {topic} {angle}.",
  "What are {number} key facts about {topic} regarding {aspect}?",
  "Analyze the impact of {topic} on {aspect} {angle}.",
  "Write a detailed comparison between {topic} and {contrast_topic}.",
  "What are common misconceptions about {topic}?",
  "How will advancements in {topic} influence {aspect} over the next decade?",
  "Provide a step-by-step breakdown of how {topic} works {angle}.",
  "Discuss the historical evolution of {topic} in relation to {aspect}.",
  "What practical challenges arise when implementing {topic}?",
  "Synthesize the connection between {topic} and {aspect}."
];

const TOPICS = [
  "quantum computing", "neural network optimization", "CRISPR gene editing",
  "solid-state battery technology", "distributed systems architecture",
  "space habitat life support", "deep sea geothermal vents", "algorithmic game theory",
  "epigenetics and longevity", "nuclear fusion containment", "zero-knowledge proofs",
  "autonomous vehicle sensor fusion", "ancient trade route economics",
  "mycelial networks and forest communication", "optical computing",
  "dark matter detection methods", "carbon capture and sequestration",
  "computational linguistics", "aerospace propulsion systems", "graphene nanomaterials"
];

const CONTRAST_TOPICS = [
  "classical computing models", "traditional heuristics", "selective breeding",
  "lithium-ion batteries", "centralized client-server models",
  "shallow marine ecosystems", "evolutionary psychology", "classical encryption schemes",
  "fossil fuel energy infrastructure", "traditional silicon semiconductors"
];

const ANGLES = [
  "from first principles",
  "using an everyday analogy",
  "from an engineering perspective",
  "focusing on real-world edge cases",
  "for an advanced technical audience",
  "with specific historical context",
  "highlighting counter-intuitive details"
];

const ASPECTS = [
  "scalability and energy efficiency",
  "long-term ecological sustainability",
  "modern global supply chains",
  "computational performance bottlenecks",
  "ethical and societal implications",
  "resource allocation and fault tolerance"
];

function pickRandom(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

// Generates a new unique prompt that hasn't been used yet
async function getUniquePrompt() {
  const data = await chrome.storage.local.get(["usedPromptsHistory"]);
  const usedPrompts = new Set(data.usedPromptsHistory || []);

  let candidate = "";
  let attempts = 0;

  while (attempts < 50) {
    const template = pickRandom(TEMPLATES);
    candidate = template
      .replace("{topic}", pickRandom(TOPICS))
      .replace("{contrast_topic}", pickRandom(CONTRAST_TOPICS))
      .replace("{angle}", pickRandom(ANGLES))
      .replace("{aspect}", pickRandom(ASPECTS))
      .replace("{number}", Math.floor(Math.random() * 4) + 3);

    if (!usedPrompts.has(candidate)) {
      break;
    }
    attempts++;
  }

  // Save the prompt to persistent storage
  usedPrompts.add(candidate);
  
  // Retain the last 5,000 queries to prevent unbounded storage growth
  const updatedList = Array.from(usedPrompts).slice(-5000);
  await chrome.storage.local.set({ usedPromptsHistory: updatedList });

  return candidate;
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === "START") {
    isRunning = true;
    startNextCycle();
  } else if (request.action === "STOP") {
    stopCycle();
  }
});

function stopCycle() {
  isRunning = false;
  if (checkInterval) {
    clearInterval(checkInterval);
    checkInterval = null;
  }
}

async function startNextCycle() {
  if (!isRunning) return;
  const prompt = await getUniquePrompt();
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
