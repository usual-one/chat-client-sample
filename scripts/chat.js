import { environment } from './environment.js';
import { getId, getToken, isAuthorized, } from './auth-utils.js';
import { createElement } from './html-utils.js';

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

async function getUser(id) {
  const resp = await fetch(`${environment.serverUrls.http}/auth/profile/${id}`);

  if (resp.status >= 500) {
    return await getUser(id);
  }
  return await resp.json();
}

async function receiveMessage(message) {
  const messageObj = JSON.parse(message.data);

  if (messageObj.id === getId()) {
    return addSelfMessage(messageObj.message);
  }

  const user = await getUser(messageObj.id);
  addOtherMessage(messageObj.message, user);
}

function addSelfMessage(text) {
  const messageContainer = createElement('div', ['self-message-container']);

  const messageTime = createElement('span', ['message-time'])
  const currentTime = new Date();
  messageTime.innerHTML = `${currentTime.toTimeString().substr(0, 5)}`;
  messageContainer.appendChild(messageTime);

  const messageContent = createElement('div', ['message-content'])

  const messageText = createElement('div', ['message-text']);
  messageText.innerHTML = text;
  messageContent.appendChild(messageText);

  messageContainer.appendChild(messageContent);

  form.messagesContainer.appendChild(messageContainer);
  form.messagesContainer.scroll(0, form.messagesContainer.scrollHeight);
}

function addOtherMessage(text, user) {
  const messageContainer = createElement('div', ['other-message-container']);

  const messageAvatar = createElement('img', [], { src: user.image });
  messageContainer.appendChild(messageAvatar);

  const messageContent = createElement('div', ['message-content']);

  const messageAuthor = createElement('span', ['message-author']);
  messageAuthor.innerHTML = user.login;
  messageContent.appendChild(messageAuthor);

  const messageText = createElement('span', ['message-text']);
  messageText.innerHTML = text;
  messageContent.appendChild(messageText);

  messageContainer.appendChild(messageContent);

  const messageTime = createElement('span', ['message-time']);
  const currentTime = new Date();
  messageTime.innerHTML = `${currentTime.toTimeString().substr(0, 5)}`;
  messageContainer.appendChild(messageTime);

  form.messagesContainer.appendChild(messageContainer);
  form.messagesContainer.scroll(0, form.messagesContainer.scrollHeight);
}

function redirectToAuth() {
  window.location.replace(`${environment.localUrl}/pages/auth.html`);
}
