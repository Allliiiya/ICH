// Utility for JWT decode and admin check
import { jwtDecode } from "jwt-decode";
// For Vite/ESM, use default import as:
// import jwt_decode from "jwt-decode";
// If error persists, use:
// import jwt_decode from "jwt-decode";
// or
// import * as jwt_decode from "jwt-decode";

export function getToken() {
  return localStorage.getItem("heritage_jwt");
}

export function isAdmin() {
  const token = getToken();
  if (!token) return false;
  try {
  const decoded: any = jwtDecode(token);
    return !!decoded.is_admin;
  } catch {
    return false;
  }
}

export function requireAdmin() {
  if (!isAdmin()) {
    window.location.href = "/login";
  }
}
