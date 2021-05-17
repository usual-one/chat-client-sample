import { environment } from './environment.js';
import { isAuthorized, saveToken } from './utils.js';

const form = {
  usernameInput: document.getElementById('username'),
  passwordInput: document.getElementById('password'),
  authButton: document.getElementById('sign-in'),
};

form.authButton.addEventListener('click', authorize);
form.passwordInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') authorize();
});

async function authorize() {
  if (isAuthorized()) {
    redirectToChat();
    return;
  }

  const resp = await fetch(`${environment.serverUrls.http}/auth/login`, {
    body: {
      login: form.usernameInput.value,
      password: form.passwordInput.value,
    },
    method: 'POST',
  });

  saveToken((await resp.json()).token);
  redirectToChat();
}

function redirectToChat() {
  window.location.replace(`${environment.localUrl}/pages/chat.html`);
}
