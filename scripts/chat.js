import { environment } from './environment.js';
import { getId, getToken, isAuthorized, } from './utils.js';

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
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('self-message-container');

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');

  const messageAuthor = document.createElement('span');
  messageAuthor.classList.add('message-author');
  messageAuthor.innerHTML = 'Вы';
  messageContent.appendChild(messageAuthor);

  const messageText = document.createElement('span');
  messageText.classList.add('message-text');
  messageText.innerHTML = text;
  messageContent.appendChild(messageText);

  messageContainer.appendChild(messageContent);

  form.messagesContainer.appendChild(messageContainer);
  form.messagesContainer.scroll(0, form.messagesContainer.scrollHeight);
}

function addOtherMessage(text, user) {
  const messageContainer = document.createElement('div');
  messageContainer.classList.add('other-message-container');

  const messageAvatar = document.createElement('img');
  messageAvatar.setAttribute('src', user.image + `?id=${Math.random()}`);
  messageContainer.appendChild(messageAvatar);

  const messageContent = document.createElement('div');
  messageContent.classList.add('message-content');

  const messageAuthor = document.createElement('span');
  messageAuthor.classList.add('message-author');
  messageAuthor.innerHTML = user.login;
  messageContent.appendChild(messageAuthor);

  const messageText = document.createElement('span');
  messageText.classList.add('message-text');
  messageText.innerHTML = text;
  messageContent.appendChild(messageText);

  messageContainer.appendChild(messageContent);

  form.messagesContainer.appendChild(messageContainer);
  form.messagesContainer.scroll(0, form.messagesContainer.scrollHeight);
}

function redirectToAuth() {
  window.location.replace(`${environment.localUrl}/pages/auth.html`);
}
