import "https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js";

const api_path = "charlotte-lee";
const token = "lnn1lxFoXZeimoqvqEFBuqzxmzH2";

// 前台使用者
const userRequest = axios.create({
  baseURL: `https://livejs-api.hexschool.io/api/livejs/v1/customer/${api_path}`,
  headers: {
    "Content-Type": "application/json",
  },
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