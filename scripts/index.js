import { environment } from './environment.js';
import { isAuthorized } from './utils.js';

if (isAuthorized()) {
  window.location.replace(`${environment.localUrl}/pages/chat.html`);
} else {
  window.location.replace(`${environment.localUrl}/pages/auth.html`);
}
