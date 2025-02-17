// hooks/useAuthenticatedApi.ts
import { useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import { authService } from "../services/auth.service"

export function useAuthenticatedApi() {
  const { userToken } = useAuth();

  const api = useMemo(() => {
    if (!userToken) return null;
    return authService.createAuthenticatedApi(userToken);
  }, [userToken]);

  return api;
}
