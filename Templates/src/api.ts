// src/api.ts

export const API_BASE_URL = 
  (import.meta as any).env?.VITE_API_URL || "https://personalized-blogging-website.onrender.com";

/**
 * Helper function for authentication requests
 */
export async function authRequest(endpoint: string, payload: object) {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.detail || "Something went wrong");
  }

  return data;
}