document.addEventListener("DOMContentLoaded", function () {
  const startChatBtn = document.getElementById("start-chat-btn");
  const welcomeScreen = document.getElementById("welcome-screen");
  const chatbotContainer = document.getElementById("chatbot-container");

  const closeBtn = document.getElementById("close-btn");
  const sendBtn = document.getElementById("send-btn");
  const chatbotInput = document.getElementById("chatbot-input");
  const chatbotMessages = document.getElementById("chatbot-messages");

  // START CHAT
  startChatBtn.addEventListener("click", function () {
    welcomeScreen.style.display = "none";
    chatbotContainer.classList.remove("hidden");
  });

  // CLOSE BUTTON
  closeBtn.addEventListener("click", function () {
    chatbotContainer.classList.add("hidden");
    welcomeScreen.style.display = "flex";
  });

  // SEND MESSAGE
  sendBtn.addEventListener("click", sendMessage);
  chatbotInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      sendMessage();
    }
  });

  function sendMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage) {
      appendMessage("user", userMessage);
      chatbotInput.value = "";
      getBotResponse(userMessage);
    }
  }

  function appendMessage(sender, message) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", sender);
    messageElement.textContent = message;
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  }

  async function getBotResponse(userMessage) {
    const apiKey =  "AIzaSyDnUlL_TTgrG3PCPz9snLmeyWtsb5c_Cas"; // Replace with your real key
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`;
    try {
      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          contents: [
            {
              role: "user",
              parts: [{ text: userMessage }]
            }
          ]
        }),
      });

      const data = await response.json();

      if (data.candidates && data.candidates.length > 0) {
        const botMessage = data.candidates[0].content.parts[0].text;
        appendMessage("bot", botMessage);
      } else {
        appendMessage("bot", "Sorry, I didn't get a response.");
      }
    } catch (error) {
      console.error("Error fetching bot response:", error);
      appendMessage("bot", "Sorry, something went wrong.");
    }
  }
});
