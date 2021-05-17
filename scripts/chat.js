import { environment } from './environment.js';
import { getToken, isAuthorized, } from './utils.js';

if (!isAuthorized) {
  redirectToAuth();
}

const ws = new WebSocket(environment.serverUrls.ws);

ws.onmessage = message => receiveMessage(message);
ws.onopen = () => console.log('Connection opened');

const form = {
  messagesContainer: document.getElementById('messages-container'),
  messageInput: document.getElementById('message-input'),
  sendButton: document.getElementById('send-button'),
}

form.sendButton.addEventListener('click', 
  () => sendMessage(form.messageInput.value));
form.messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage(form.messageInput.value);
});

function sendMessage(text) {
  if (!text.length) return;

  ws.send(JSON.stringify({
    event: 'message',
    data: {
      token: getToken(),
      message: text,
    },
  }));

  form.messageInput.value = '';
}

function receiveMessage(message) {
  addOtherMessage(JSON.parse(message.data).message);
}

function addSelfMessage(text) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('self-message-container');
  const message = document.createElement('span');
  message.innerHTML = text;
  messageContainer.appendChild(message);
  form.messagesContainer.appendChild(messageContainer);
  form.messagesContainer.scroll(0, form.messagesContainer.scrollHeight);
}

function addOtherMessage(text) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('other-message-container');
  const message = document.createElement('span');
  message.innerHTML = text;
  messageContainer.appendChild(message);
  form.messagesContainer.appendChild(messageContainer);
  form.messagesContainer.scroll(0, form.messagesContainer.scrollHeight);
}

function redirectToAuth() {
  window.location.replace(`${environment.localUrl}/pages/auth.html`);
}
