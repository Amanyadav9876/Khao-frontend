import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

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