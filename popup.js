const toggleBtn = document.getElementById("toggleBtn");
const statusDiv = document.getElementById("status");

chrome.storage.local.get(["isLooping"], ({ isLooping }) => {
  updateUI(Boolean(isLooping));
});

function updateUI(active) {
  if (active) {
    toggleBtn.textContent = "Stop Loop";
    toggleBtn.className = "stop";
    statusDiv.textContent = "Status: Running continuous loop...";
  } else {
    toggleBtn.textContent = "Start Looping";
    toggleBtn.className = "start";
    statusDiv.textContent = "Status: Idle";
  }
}

toggleBtn.addEventListener("click", async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab || !tab.url || !tab.url.startsWith("https://gemini.google.com")) {
    statusDiv.textContent = "Open gemini.google.com first!";
    return;
  }

  chrome.storage.local.get(["isLooping"], ({ isLooping }) => {
    const nextState = !isLooping;
    chrome.storage.local.set({ isLooping: nextState });
    updateUI(nextState);

    chrome.tabs.sendMessage(tab.id, { action: nextState ? "START" : "STOP" });
  });
});