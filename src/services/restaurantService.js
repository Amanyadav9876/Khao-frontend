import axios from "axios";

const BASE_URL = "http://fooddeliveryapp-backend-production-33e8.up.railway.app/api";

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