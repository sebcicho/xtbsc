import { useAuth0 } from "@auth0/auth0-react";

export const useApiClient = () => {
  const { getAccessTokenSilently } = useAuth0();

  const apiFetchAuthenticated = async (url: string, options: RequestInit = {}) => {
    const token = await getAccessTokenSilently({
      authorizationParams: { audience: "localhost:8080/" },
    });

    const headers = {
      ...options.headers,
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
      Accept: "application/json",
    };

    return fetch(url, { ...options, headers });
  };

  const apiPostAuthenticated = async (url: string, body: any, options: RequestInit = {}) => {
    return apiFetchAuthenticated(url, {
      ...options,
      method: "POST",
      body: JSON.stringify(body),
    });
  };

  return { apiPostAuthenticated, apiFetchAuthenticated };
};
