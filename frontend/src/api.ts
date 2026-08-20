// Typed API fetch wrapper for PlatePilgrim.
// All routes are protected — passes the Cognito access token in Authorization header.
// Via CloudFront, routes are at /api/*, in dev they hit the VITE_API_URL directly.

import { getAccessToken } from "./auth";

const BASE = import.meta.env.VITE_API_URL || "/api";

async function apiFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAccessToken();
  if (!token) {
    throw new Error("API 401: not signed in");
  }
  const res = await fetch(`${BASE}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`API ${res.status}: ${body}`);
  }
  return res.json() as Promise<T>;
}

// ---- Types ----

export interface Meal {
  mealId: string;
  dish: string;
  countryCode: string;
  countryName: string;
  notes?: string;
  photoUrl?: string | null;
  funFact?: string | null;
  loggedAt: string;
}

export interface Stamp {
  countryCode: string;
  countryName: string;
  earnedAt: string;
}

export interface DareResponse {
  allExplored: boolean;
  message?: string;
  country?: {
    code: string;
    name: string;
    cuisine: string;
    continent: string;
    difficulty: number;
    emoji: string;
  };
  recipe?: string;
}

export interface LogMealRequest {
  dish: string;
  countryCode: string;
  countryName: string;
  notes?: string;
  photoUrl?: string;
}

export interface LogMealResponse {
  meal: Meal;
  stampAwarded: boolean;
}

// ---- API calls ----

export const api = {
  getMeals: () => apiFetch<{ meals: Meal[] }>("/meals"),

  logMeal: (payload: LogMealRequest) =>
    apiFetch<LogMealResponse>("/meals", {
      method: "POST",
      body: JSON.stringify(payload),
    }),

  deleteMeal: (mealId: string) =>
    apiFetch<{ deleted: boolean; mealId: string }>(`/meals/${mealId}`, {
      method: "DELETE",
    }),

  getStamps: () => apiFetch<{ stamps: Stamp[] }>("/stamps"),

  getDare: () => apiFetch<DareResponse>("/dare"),
};
