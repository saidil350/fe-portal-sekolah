import { api } from './client';

type LogoutCallback = () => void;
let on401Callback: LogoutCallback | null = null;

export function register401Listener(callback: LogoutCallback) {
  on401Callback = callback;
}

api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Tangani unauthorized error secara otomatis
    if (error.status === 401 && on401Callback) {
      on401Callback();
    }
    return Promise.reject(error);
  }
);
