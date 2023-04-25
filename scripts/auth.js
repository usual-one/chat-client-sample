import { environment } from './environment.js';
import { isAuthorized, saveUserData } from './auth-utils.js';

const form = {
  usernameInput: document.getElementById('username'),
  // passwordInput: document.getElementById('password'),
  authButton: document.getElementById('sign-in'),
};

form.authButton.addEventListener('click', authorize);
form.usernameInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') authorize();
});
// form.passwordInput.addEventListener('keypress', (e) => {
//   if (e.key === 'Enter') authorize();
// });

async function authorize() {
  if (isAuthorized()) {
    redirectToChat();
    return;
  }

  const resp = await fetch(`${environment.serverUrls.http}/api/user`, {
    body: JSON.stringify({
      name: form.usernameInput.value,
      // password: form.passwordInput.value,
    }),
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
  });

  const jsonResp = await resp.json();

  saveUserData(jsonResp);
  // saveAuthData(jsonResp.token, jsonResp.id);
  redirectToChat();
}

function redirectToChat() {
  window.location.replace(`${window.location.origin}/pages/chat.html`);
}
