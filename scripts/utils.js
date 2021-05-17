const tokenKey = 'token';

export function saveToken(token) {
  localStorage.setItem(tokenKey, token);
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function isAuthorized() {
  return !!getToken();
}
