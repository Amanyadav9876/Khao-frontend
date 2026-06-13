import axios from "axios";

const BASE_URL = "http://fooddeliveryapp-backend-production-33e8.up.railway.app/api";

const getToken = () => localStorage.getItem("token");

export const getAllUsers = async () => {
  const response = await axios.get(`${BASE_URL}/admin/users`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const getAllRestaurantsAdmin = async () => {
  const response = await axios.get(`${BASE_URL}/admin/restaurants`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const getAllOrdersAdmin = async () => {
  const response = await axios.get(`${BASE_URL}/admin/orders`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const blockUser = async (userId) => {
  const response = await axios.put(`${BASE_URL}/admin/users/${userId}/block`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const blockRestaurant = async (restaurantId) => {
  const response = await axios.put(`${BASE_URL}/admin/restaurants/${restaurantId}/block`, {}, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};