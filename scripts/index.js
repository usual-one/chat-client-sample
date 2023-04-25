import { isAuthorized } from './auth-utils.js';

if (isAuthorized()) {
  window.location.replace(`${window.location.origin}/pages/chat.html`);
} else {
  window.location.replace(`${window.location.origin}/pages/auth.html`);
}
