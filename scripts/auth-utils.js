const tokenKey = 'token';
const idKey = 'id';
const userKey = 'user';

export function saveUserData(user) {
  localStorage.setItem(userKey, JSON.stringify(user));
}

export function getUserData() {
  const user = localStorage.getItem(userKey);
  if (!user) { return null; }
  return JSON.parse(user);
}

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
  return !!getUserData();
  // return !!getToken();
}
