import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getAllRestaurants = async () => {
  const response = await axios.get(`${BASE_URL}/restaurants`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const addRestaurant = async (restaurantData) => {
  const response = await axios.post(`${BASE_URL}/restaurants`, restaurantData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const addRestaurant = async (restaurantData) => {
  const response = await axios.post(`${BASE_URL}/restaurants`, restaurantData, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};