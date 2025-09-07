export function apiUrl(path: string) {
    const p = path.startsWith('/') ? path : `/${path}`;
    return p.startsWith('/api/') ? p : `/api${p}`; // 항상 /api/... 로 강제
  }
  
  export async function apiFetch(path: string, init: RequestInit = {}) {
    return fetch(apiUrl(path), {
      credentials: 'include',
      ...init,
    });
  }
  