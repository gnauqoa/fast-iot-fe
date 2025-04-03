import { IRole } from "interfaces/user";

export function extractRoleInfoFromToken(token: string | null): IRole | null {
  if (!token) {
    return null;
  }
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roleInfo = payload.role;
    return roleInfo !== undefined ? roleInfo : null;
  } catch (error) {
    console.error("Error parsing JWT token:", error);
    return null;
  }
}
