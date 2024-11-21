// 匯入 共用工具
import * as utils from "./utils.js";

// 匯入 共用 API
import * as api from "./api.js";

// 取得產品列表
let productData = [];
// loding 動畫載入
utils.toggleLoading(true);
const getProductList = async () => {
  try {
    const res = await api.getProductList();    
    productData = res.data.products;
    utils.toggleLoading(false);
    renderProductList(productData);    
  } catch (err) {
    console.error(err); 
  }
};

// 渲染產品列表
const productList = document.querySelector(".productWrap");
const renderProductList = (data) => {
  let str = "";
  data.forEach((item) => {
    str += `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-id="${item.id}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${item.origin_price}</del>
                <p class="nowPrice">NT$${item.price}</p>
            </li>`;
  });
  productList.innerHTML = str;
};

// 篩選產品
const productSelect = document.querySelector(".productSelect");
const filterProduct = (value) => {
  let result;
  productData.forEach((item) => {
    if (value === "全部") {
      result = productData;
    } else {
      result = productData.filter((item) => item.category === value);
    }
    renderProductList(result);
  });
};

productSelect.addEventListener("change", (e) => {
  e.preventDefault();
  filterProduct(e.target.value);
});

// 取得購物車列表
let cartData = [];
let cartTotal = 0;
const getCartList = async () => {
  try {
    const res = await api.getCartList();
    cartData = res.data.carts;
    cartTotal = res.data.finalTotal;
    console.log(cartData);
    renderCarts();
  } catch (err) {
    console.error(err);
  }
};

const cartList = document.querySelector(".shoppingCart-tableList");
const cartListTfoot = document.querySelector(".shoppingCart-table tfoot");
const renderCarts = () => {
  if (cartData.length === 0) {
    cartListTfoot.innerHTML = "";
    cartList.innerHTML = "購物車無商品...";
    return;
  }
  let str = "";
  cartData.forEach((item) => {
    str += ` <tr data-id="${item.id}">
                      <td>
                        <div class="cardItem-title">
                          <img src="${item.product.images}" alt="">
                          <p>${item.product.title}</p>
                        </div>
                      </td>
                      <td>NT$${item.product.origin_price}</td>
                      <td class="quantity-cell" data-cart-qty><button type="button" class="material-symbols-outlined removeBtn">
remove
</button>${item.quantity}<button type="button" class="material-symbols-outlined addBtn">
add
</button></td>
                      <td>NT$${item.product.price * item.quantity}</td>
                      <td>
                        <a href="#" class="material-icons discardBtn">
                          clear
                        </a>
                      </td>
                    </tr`;
  });
  cartList.innerHTML = str;
  cartListTfoot.innerHTML = `<tr>
              <td>
                <a href="#" class="discardAllBtn">刪除所有品項</a>
              </td>
              <td></td>
              <td></td>
              <td>
                <p>總金額</p>
              </td>
              <td>NT$${cartTotal}</td>
            </tr>`;
  return;
};

// 加入購物車
const addCart = async (id) => {
  let numCart = 1;
  cartData.forEach((item) => {
    if (item.product.id === id) {
      numCart = item.quantity += 1;
    }
  });

  const data = {
    data: {
      productId: id,
      quantity: numCart,
    },
  };
  // loding 動畫載入
  // utils.toggleLoading(true);
  try {
    const res = await api.addCart(data);
    cartData = res.data.carts;
    cartTotal = res.data.finalTotal;
    console.log(cartData);
    renderCarts();
  } catch (err) {
    console.error(err.message);
  } 
};

productList.addEventListener("click", (e) => {
  e.preventDefault();  
  addCart(e.target.dataset.id);  
});

// 刪除所有購物車品項
const deleteAllCarts = async () => {
  try {
    const res = await api.deleteAllCarts();
    cartData = res.data.carts;
    renderCarts();
  } catch (err) {
    console.error(err);
  }
};

cartListTfoot.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("discardAllBtn")) {
    deleteAllCarts();
  }
});

// 刪除單一品項
const deleteCart = async (id) => {
  try {
    const res = await api.deleteCart(id);
    cartData = res.data.carts;
    renderCarts();
  } catch (err) {
    console.error(err);
  }
};

// 輯編產品數量
const updateCart = async (id, qty) => {
  const data = {
    data: {
      id,
      quantity: qty,
    },
  };

  try {
    const res = await api.updateCart(data);
    cartData = res.data.carts;
    console.log(res);
    cartTotal = calculateCartTotal(cartData);
    renderCarts();
  } catch (err) {
    console.error(err);
  }
};

cartList.addEventListener("click", (e) => {
  const id = e.target.closest('tr').dataset.id;   
  
  e.preventDefault();  
  
  if (e.target.classList.contains("discardBtn")) {    
    deleteCart(id);
  }  

  if (e.target.classList.contains("addBtn")) {
    let result = {};
    cartData.forEach((item) => {
      if (item.id === id) {
        result = item;
      }
    });
    let qty = result.quantity + 1;
    updateCart(id, qty);
  }

  if (e.target.classList.contains("removeBtn")) {
    let result = {};
    cartData.forEach((item) => {
      if (item.id === id) {
        result = item;
      }
    });
    let qty = Math.max(result.quantity - 1, 1);
    updateCart(id, qty);
  }
});

// 計算購物車總金額
const calculateCartTotal = (cartData) => {
  return cartData.reduce((total, item) => {
    return total + item.product.price * item.quantity;
  }, 0);
};

// 初始化
const init = () => {
  getProductList();
  getCartList();
};

init();
