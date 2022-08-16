import { getRefreshToken, getUserId } from "../utils/localStorage";
import api from "./api";

const register = async (registerInfo) => {
  const registerResult = await api({
    method: "POST",
    url: "/auth/register",
    data: registerInfo,
  });
  return registerResult;
};

const login = async (credentials) => {
  const loginResult = await api({
    method: "POST",
    url: "/auth/login",
    data: credentials,
  });
  return loginResult;
};

const refreshAccessToken = (credentials) => {
  const userId = getUserId();
  const refreshToken = getRefreshToken();
  return api.post("auth/refresh-tokens", {
    refresh_token: refreshToken,
    user_id: userId,
  });
};

export { register, login, refreshAccessToken };
