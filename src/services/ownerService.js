import axios from "axios";

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

const getToken = () => localStorage.getItem("token");

export const getMyRestaurants = async () => {
  const response = await axios.get(`${BASE_URL}/restaurants/my-restaurants`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const createRestaurant = async (data) => {
  const response = await axios.post(`${BASE_URL}/restaurants`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const getRestaurantOrders = async (restaurantId) => {
  const response = await axios.get(`${BASE_URL}/orders/restaurant/${restaurantId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(
    `${BASE_URL}/orders/${orderId}/status?status=${status}`,
    {},
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};

export const addMenuItem = async (data) => {
  const response = await axios.post(`${BASE_URL}/menu-items`, data, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};
