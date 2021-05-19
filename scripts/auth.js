import { environment } from './environment.js';
import { isAuthorized, saveAuthData } from './auth-utils.js';

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
    body: JSON.stringify({
      login: form.usernameInput.value,
      password: form.passwordInput.value,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const jsonResp = await resp.json();

  saveAuthData(jsonResp.token, jsonResp.id);
  redirectToChat();
}

function redirectToChat() {
  window.location.replace(`${environment.localUrl}/pages/chat.html`);
}
