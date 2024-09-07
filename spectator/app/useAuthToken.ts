import { useState, useEffect } from "react";
import { jwtDecode } from "jwt-decode";

const fetchAccessTokenWithApiKey = async () => {
  const response = await fetch('https://realm.mongodb.com/api/client/v2.0/app/data-gdwsjkb/auth/providers/api-key/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      key: 'szh5JljBccYCUJHBEUCrwDscVhwLsfv0pHUTw4iGtuhFrKiDkD9KFepQLhCVoSxW',
    }),
  });

  const authentication = await response.json();
  localStorage.setItem('accessToken', authentication.access_token);
  localStorage.setItem('refreshToken', authentication.refresh_token);
  return authentication.access_token;
};

const refreshAccessToken = async (refreshToken: string) => {
  const response = await fetch('https://services.cloud.mongodb.com/api/client/v2.0/auth/session', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      refresh_token: refreshToken,
      grant_type: 'refresh_token',
    }),
  });

  if (!response.ok) {
    throw new Error('Failed to refresh token');
  }

  const data = await response.json();
  localStorage.setItem('accessToken', data.access_token);
  return data.access_token;
};

export const useAuthToken = () => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      let token = localStorage.getItem('accessToken');
      const refreshToken = localStorage.getItem('refreshToken');
      if(token) {
        const decodedToken = jwtDecode(token);
        const expiry = decodedToken.exp ?? 0;
        const currentTime = Math.floor(Date.now() / 1000);
        const expired = (expiry > currentTime) ? true : false;
        if(expired){
          token = await fetchAccessTokenWithApiKey();
        }
      }

      try {
        if (!token && refreshToken) {
          token = await refreshAccessToken(refreshToken);
        } else if (!token) {
          token = await fetchAccessTokenWithApiKey();
        }
        setAccessToken(token);
      } catch (error: any) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    loadToken();
  }, []);

  return { accessToken, loading, error };
};
