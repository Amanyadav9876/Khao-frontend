import axios from "axios";

const BASE_URL = "https://fooddeliveryapp-backend-production-33e8.up.railway.app/api";

const getToken = () => localStorage.getItem("token");

export const getMenuByRestaurant = async (restaurantId) => {
  const response = await axios.get(`${BASE_URL}/menu-items/restaurant/${restaurantId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};