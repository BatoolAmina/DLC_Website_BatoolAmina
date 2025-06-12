const chatBox = document.getElementById('chat-box');
const input = document.getElementById('user-input');

function appendMessage(text, type) {
  const msg = document.createElement('div');
  msg.className = `chat-msg ${type}`;
  msg.textContent = text;
  chatBox.appendChild(msg);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKey(event) {
  if (event.key === 'Enter') sendMessage();
}

async function sendMessage() {
  const message = input.value.trim();
  if (!message) return;

  appendMessage('🧑 ' + message, 'user');
  input.value = '';
  appendMessage('🤖 Typing...', 'bot');

  try {
    const response = await fetch("http://localhost:3000/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message })
    });

    const data = await response.json();
    const botMessages = document.querySelectorAll(".chat-msg.bot");
    botMessages[botMessages.length - 1].textContent = "🤖 " + (data.reply || "Sorry, I didn’t get that.");
  } catch (error) {
    const botMessages = document.querySelectorAll(".chat-msg.bot");
    botMessages[botMessages.length - 1].textContent = "⚠️ Error connecting to server.";
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
