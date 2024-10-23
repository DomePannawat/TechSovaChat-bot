import { GoogleGenerativeAI } from "@google/generative-ai";
import md from 'markdown-it';

const genAI = new GoogleGenerativeAI(`${import.meta.env.VITE_API_KEY}`);
const model = genAI.getGenerativeModel({model: "gemini-pro"});

let history = [];

async function getResponse(prompt) {
  const retryCount = 3;  
  let attempt = 0;       
  let responseText = ''; 

  while (attempt < retryCount) {
    try {
      const chat = await model.startChat({ history: history });
      const result = await chat.sendMessage(prompt);
      const response = await result.response;
      responseText = response.text();

      
      responseText = responseText.replace(/Gemini/g, "TechSova");
      responseText = responseText.replace(/GPT/g, "TechSova");
      responseText = responseText.replace(/Google/g, "DomePannawat");
      responseText = responseText.replace(/goo/g, "TechSova");
      responseText = responseText.replace(/กูป/g, "TechSova");
      responseText = responseText.replace(/Goog/g, "TechSova");
      responseText = responseText.replace(/DomePannawat Assistant/g, "TechSova Assistant");

      console.log(responseText);
      return responseText; 
    } catch (error) {
      attempt++;
      console.error(`Attempt ${attempt} failed: ${error.message}`);
      
      await new Promise(resolve => setTimeout(resolve, 2000)); 
    }
  }

  
  console.error('Maximum retry attempts reached.');
  throw new Error('Error fetching AI response after retries');
}

// User Chat DIV
export const userDiv = (data) => {
  return `
<!-- User Chat -->
<div class="flex items-center gap-3 justify-start">
  <img src="/User-logo.jpg" alt="user icon" class="w-10 h-10 rounded-full">
  <p class="bg-sage-mint/40 text-white p-1 rounded-md shadow-md h-auto">${data}</p>
</div>
  `;
};

// AI CHAT DIV
export const aiDiv = (data) => {
  return `
  <!-- AI Chat -->
  <div class="flex items-center gap-3 justify-end">
    <div class="bg-white text-black p-3 rounded-lg shadow-lg border border-cyan-500/60 shadow-cyan-500/60 transform transition-transform hover:scale-105 duration-300">${data}</div>
    <img src="/LOGO-CHAT-BOT.jpeg" alt="AI icon" class="w-10 h-10 rounded-full">
  </div>
  `;
}; 

async function handleSubmit(event) {
  event.preventDefault();

  let userMessage = document.getElementById("prompt");
  const chatArea = document.getElementById("chat-container");

  var prompt = userMessage.value.trim();
  if (prompt === "") {
    return;
  }

  console.log('user message', prompt);

  chatArea.innerHTML += userDiv(prompt);
  userMessage.value = "";

  try {
    const aiResponse = await getResponse(prompt); 
    let md_text = md().render(aiResponse);
    chatArea.innerHTML += aiDiv(md_text);
  } catch (error) {
    chatArea.innerHTML += aiDiv("Sorry, I couldn't get a response. Please try again later."); 
  }

  chatArea.lastElementChild.scrollIntoView({ behavior: 'smooth' });
}

const chatForm = document.getElementById('chat-form');

const sendButton = chatForm.querySelector('button[type="submit"]');
sendButton.addEventListener('click', (event) => {
  event.preventDefault();
  handleSubmit(event);
});

chatForm.addEventListener('keydown', (event) => {
  if (event.key === 'Enter' && event.shiftKey) {
    event.preventDefault(); 
    const promptInput = document.getElementById("prompt");
    promptInput.value += '\n'; 
  } 
  else if (event.key === 'Enter') {
    event.preventDefault(); 
    handleSubmit(event); 
  }
});
