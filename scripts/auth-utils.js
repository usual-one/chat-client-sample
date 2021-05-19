const tokenKey = 'token';
const idKey = 'id';

export function saveAuthData(token, id) {
  localStorage.setItem(tokenKey, token);
  localStorage.setItem(idKey, id);
}

export function getToken() {
  return localStorage.getItem(tokenKey);
}

export function getId() {
  return localStorage.getItem(idKey);
}

export function isAuthorized() {
  return !!getToken();
}
