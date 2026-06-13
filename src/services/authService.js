import axios from "axios";

const BASE_URL = "http://fooddeliveryapp-backend-production-33e8.up.railway.app/api";

export const loginUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/auth/login`, data);
  return response.data;
};

export const signupUser = async (data) => {
  const response = await axios.post(`${BASE_URL}/auth/register`, data);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("role");
};