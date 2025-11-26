const URL_BASE = 'http://localhost:8080';

export function getAccessToken() {
  return localStorage.getItem('accessToken');
}

export function setAccessToken(token) {
  localStorage.setItem('accessToken', token);
}

export function getRefreshToken() {
  return localStorage.getItem('refreshToken');
}

export function setRefreshToken(token) {
  localStorage.setItem('refreshToken', token);
}

export function setAuthUser({userId, profileImg}) {
  localStorage.setItem('userId', userId);
  localStorage.setItem('profileImg', profileImg);
}

export function getAuthUser() {
  const userId = localStorage.getItem('userId');
  const profileImg = localStorage.getItem('profileImg');
  return {
    userId: userId,
    profileImg: profileImg
  }
}

export function deleteAuthUser() {
  localStorage.removeItem('userId');
  localStorage.removeItem('profileImg');
}

export async function apiFetch(path, { method = 'GET', headers = {}, body, withAuth = true }) {
  
  const header = { ...headers };

  if (withAuth) {
    const accessToken = getAccessToken();
    if (accessToken) header['Authorization'] = `Bearer ${accessToken}`;
  }

  if (body && !(body instanceof FormData)) {
    header['Content-Type'] = 'application/json';
    body = JSON.stringify(body);
  }

  const response = await fetch(`${URL_BASE}${path}`, {
    method,
    headers: header,
    body,
  });

  let data = null;
  try { 
    data = await response.json(); 
  } 
  catch(error) {
    throw new Error(`HTTP 응답 JSON 파싱 오류: ${error?.message || error}`);
  }

  if (!response.ok) {
    const message = data?.message || `HTTP ${response.status}`;
    const error = new Error(message);
    error.status = response.status;
    error.payload = data;
    throw error;
  }

  return data;
}
