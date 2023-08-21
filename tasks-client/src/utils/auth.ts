export function generateAuthToken() {
  const baseStr = `${process.env.ADM_USERNAME}:${process.env.ADM_PASSWORD}`;

  return btoa(baseStr);
}
