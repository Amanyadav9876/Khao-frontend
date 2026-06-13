import axios from "axios";

const BASE_URL = "https://fooddeliveryapp-backend-production-33e8.up.railway.app/api";

const getToken = () => localStorage.getItem("token");
const getUserId = () => localStorage.getItem("userId");

export const placeOrder = async (orderData) => {
  const response = await axios.post(`${BASE_URL}/orders`, {
    ...orderData,
    userId: getUserId(),
  }, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const getMyOrders = async () => {
  const userId = getUserId();
  const response = await axios.get(`${BASE_URL}/orders/my/${userId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const getOrderById = async (orderId) => {
  const response = await axios.get(`${BASE_URL}/orders/${orderId}`, {
    headers: { Authorization: `Bearer ${getToken()}` }
  });
  return response.data;
};

export const updateOrderStatus = async (orderId, status) => {
  const response = await axios.put(
    `${BASE_URL}/orders/${orderId}/status?status=${status}`, {},
    { headers: { Authorization: `Bearer ${getToken()}` } }
  );
  return response.data;
};