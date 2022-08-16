import axios from "axios";
import { API_BASE_URL } from "../configs";
import { getAccessToken, refreshTokens } from "../utils/localStorage";
import { refreshAccessToken } from "./auth";
import { store } from "../redux/store";
import { setError } from "../redux/actions/errorActions";

const CancelToken = axios.CancelToken;

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  responseType: "json",
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 300 * 1000,
});

axiosClient.interceptors.request.use(
  (config) => {
    const accessToken = getAccessToken();
    if (accessToken) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${accessToken}`,
      };
    }
    return config;
  },
  function (error) {
    console.log(error);
    return Promise.reject(error);
  }
);

axiosClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    if (error.response) {
      if (error.response.status === 400) {
        store.dispatch(setError(error.response.data));
        // handle bad request error
      } else if (error.response.status === 401) {
        // handle unauthorized error
        // originalRequest._retry = true;
        // const { tokens } = (await refreshAccessToken()).data;
        // refreshTokens(tokens);
        // axios.defaults.headers.common[
        //   "Authorization"
        // ] = `Bearer ${tokens.access?.token}`;
        // return axiosClient(originalRequest);
      } else if (error.response.status === 404) {
        // handle not found error
      } else if (error.response.status === 500) {
        // handle server error
        store.dispatch(setError({ code: "SERVER_ERROR" }));
      }
    } else {
      return Promise.reject(error);
    }
  }
);

export default axiosClient;
