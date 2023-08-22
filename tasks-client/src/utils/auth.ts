import { Credentials } from "@/interfaces/credentials";

export function generateAuthToken(credentials: Credentials) {
  if (!credentials || !credentials.username || !credentials.password) {
    throw new Error("No credentials found.");
  }

  const baseStr = `${credentials.username}:${credentials.password}`;

  return btoa(baseStr);
}
