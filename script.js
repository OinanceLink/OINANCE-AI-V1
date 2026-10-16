const screens = [
  "home",
  "chat",
  "voice",
  "tools",
  "profile"
];

function showScreen(screenId) {
  screens.forEach(id => {
    document.getElementById(id).classList.toggle(
      "active",
      id === screenId
    );
  });

  document.querySelectorAll(".nav-btn").forEach(button => {
    button.classList.toggle(
      "active",
      button.dataset.screen === screenId
    );
  });

  window.scrollTo({
    top: 0,
    behavior: "smooth"
  });
}


// Bottom navigation
document.querySelectorAll(".nav-btn").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.screen);
  });
});


// Buttons that navigate to another screen
document.querySelectorAll("[data-go]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen(button.dataset.go);
  });
});


// Start a new chat
document.getElementById("newChat").addEventListener("click", () => {
  clearChat();
  showScreen("chat");
});


// Clear chat
function clearChat() {
  document.getElementById("chatBox").innerHTML = `
    <div class="bubble ai">
      Hello! I'm OINANCE AI. What can I help you with today?
    </div>
  `;
}

document.getElementById("clearChat").addEventListener(
  "click",
  clearChat
);


// Add chat message
function addMessage(message, sender) {
  const box = document.getElementById("chatBox");
  const bubble = document.createElement("div");

  bubble.className = "bubble " + sender;
  bubble.textContent = message;

  box.appendChild(bubble);

  bubble.scrollIntoView({
    behavior: "smooth",
    block: "end"
  });
}


// Demonstration responses
// These are examples, not responses from a real AI model.
function getDemoResponse(message) {
  const text = message.toLowerCase();

  if (
    text.includes("budget") ||
    text.includes("money") ||
    text.includes("save")
  ) {
    return `Here is a simple starting plan:

1. Write down your monthly income.
2. List your essential expenses.
3. Decide how much you can realistically save.
4. Keep money for unexpected expenses.
5. Review your spending every week.

Tell me your income and expenses to help create a sample budget.

Note: This is a demonstration response.`;
  }

  if (
    text.includes("translate") ||
    text.includes("translator")
  ) {
    return `I can help prepare a translation.

Please provide:
1. The text you want translated.
2. The language of the original text.
3. The language you want to translate it into.

Real AI translation will be connected in a future version.`;
  }

  if (
    text.includes("write") ||
    text.includes("message") ||
    text.includes("email")
  ) {
    return `Let's work on your writing.

Tell me:
1. What you want to write.
2. Who will read it.
3. Whether you want a friendly, professional, or formal tone.

The live AI writing service is not connected yet.`;
  }

  if (
    text.includes("plan") ||
    text.includes("day") ||
    text.includes("task")
  ) {
    return `Here is a simple daily plan:

1. Choose your three most important tasks.
2. Start with the most important task.
3. Take short breaks.
4. Review your progress at the end of the day.

This is a demonstration response.`;
  }

  if (
    text.includes("calculate") ||
    text.includes("25000 plus 17500")
  ) {
    return "25,000 + 17,500 = 42,500.";
  }

  if (
    text.includes("hello") ||
    text.trim() === "hi"
  ) {
    return "Hello! Welcome to OINANCE AI. How can I help you today?";
  }

  return `Thanks for your question!

The OINANCE AI interface is working, but the real AI model has not been connected yet.

Our next step is to connect an AI service securely so the assistant can generate intelligent responses.`;
}


// Send chat message
function sendMessage(message) {
  const cleanMessage = message.trim();

  if (!cleanMessage) {
    return;
  }

  addMessage(cleanMessage, "user");

  setTimeout(() => {
    addMessage(
      getDemoResponse(cleanMessage),
      "ai"
    );
  }, 350);
}


// Chat form
document.getElementById("chatForm").addEventListener(
  "submit",
  function(event) {
    event.preventDefault();

    const input = document.getElementById("messageInput");

    sendMessage(input.value);

    input.value = "";
  }
);


// Home and tool shortcuts
document.querySelectorAll("[data-prompt]").forEach(button => {
  button.addEventListener("click", () => {
    showScreen("chat");

    const prompt = button.dataset.prompt;

    sendMessage(prompt);
  });
});


// Save display name
document.getElementById("saveName").addEventListener(
  "click",
  function() {
    const input = document.getElementById("displayName");
    const name = input.value.trim() || "there";

    document.querySelector(".hero h1").textContent =
      "Good to see you, " + name + "!";

    showToast("Display name updated.");
  }
);


// Small notification
let toastTimer;

function showToast(message) {
  const toast = document.getElementById("toast");

  toast.textContent = message;
  toast.style.display = "block";

  clearTimeout(toastTimer);

  toastTimer = setTimeout(() => {
    toast.style.display = "none";
  }, 2500);
}


// Optional browser speech recognition
const micButton = document.getElementById("micButton");

micButton.addEventListener("click", function() {
  const SpeechRecognition =
    window.SpeechRecognition ||
    window.webkitSpeechRecognition;

  const status = document.getElementById("voiceStatus");

  if (!SpeechRecognition) {
    status.textContent =
      "Speech recognition is not supported by this browser. You can still type in Chat.";
    return;
  }

  const recognition = new SpeechRecognition();

  recognition.lang = "en-NG";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;

  status.textContent = "Listening... Please speak.";

  recognition.onresult = function(event) {
    const transcript =
      event.results[0][0].transcript;

    status.textContent = "You said: " + transcript;

    showScreen("chat");

    sendMessage(transcript);
  };

  recognition.onerror = function() {
    status.textContent =
      "Could not recognize speech. Check microphone permission and try again.";
  };

  recognition.onend = function() {
    if (status.textContent === "Listening... Please speak.") {
      status.textContent = "Voice session ended.";
    }
  };

  recognition.start();
});
