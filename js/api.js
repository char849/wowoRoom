import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

const api_path = "charlotte-lee";
const token = "lnn1lxFoXZeimoqvqEFBuqzxmzH2";

// 建立前後台實體
// 前台使用者
const userRequest = axios.create({
  baseURL: `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}`,
  headers: {
    "Content-Type": "application/json",
  },
});

// 後台管理者
const adminRequest = axios.create({
  baseURL: 'https://livejs-api.hexschool.io/api/livejs/v1/admin/charlotte-lee',
  headers: {
      'Content-Type': 'application/json',
      'Authorization': token,
  }
});

// 前台
// 產品 API
export const getProductList = () => userRequest.get("/products");

// 購物車 API
export const getCartList = () => userRequest.get("/carts");
export const addCart = (data) => userRequest.post("/carts", data);
export const deleteAllCarts = () => userRequest.delete("/carts");
export const deleteCart = (id) => userRequest.delete(`/carts/${id}`);
export const updateCart = (data) => userRequest.patch("/carts", data);
export const apiAddOrder = (data) => userRequest.post('/orders', data);

// 後台 - 訂單 API
export const getOrderList = () => adminRequest.get('/orders');
export const deleteOrder = (id) => adminRequest.delete(`/orders/${id}`);
export const deleteAllOrders = () => adminRequest.delete(`/orders`);
export const updateOrder  = (data) => adminRequest.put('/orders', data);