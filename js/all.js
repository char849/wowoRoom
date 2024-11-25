// 匯入 共用工具
import * as utils from "./utils.js";

// 匯入 共用 API
import * as api from "./api.js";

// 取得產品列表
let productData = [];

const getProductList = async () => {
  // loding 動畫載入
  utils.toggleLoading(true);
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
  productList.innerHTML = data
    .map(
      (item) => `<li class="productCard">
                <h4 class="productType">新品</h4>
                <img src="${item.images}" alt="">
                <a href="#" class="addCardBtn" data-id="${item.id}" data-title="${item.title}">加入購物車</a>
                <h3>${item.title}</h3>
                <del class="originPrice">NT$${utils.tothousands(item.origin_price)}</del>
                <p class="nowPrice">NT$${utils.tothousands(item.price)}</p>
            </li>`
    )
    .join('');
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

  cartList.innerHTML = cartData
    .map(
      (item) =>
        `<tr data-id="${item.id}">
                      <td>
                        <div class="cardItem-title">
                          <img src="${item.product.images}" alt="">
                          <p>${item.product.title}</p>
                        </div>
                      </td>
                      <td>NT$${utils.tothousands(item.product.origin_price)}</td>
                      <td class="quantity-cell" data-cart-qty><button type="button" class="material-symbols-outlined removeBtn">
remove
</button>${
          item.quantity
        }<button type="button" class="material-symbols-outlined addBtn">
add
</button></td>
                      <td>NT$${utils.tothousands(item.product.price * item.quantity)}</td>
                      <td>
                        <a href="#" class="material-icons discardBtn" data-title="${item.product.title}">
                          clear
                        </a>
                      </td>
                    </tr>`
    )
    .join("");

  cartListTfoot.innerHTML = `<tr>
              <td>
                <a href="#" class="discardAllBtn">刪除所有品項</a>
              </td>
              <td></td>
              <td></td>
              <td>
                <p>總金額</p>
              </td>
              <td>NT$${utils.tothousands(cartTotal)}</td>
            </tr>`;
  return;
};

// 加入購物車
const addCart = async (id, productTitle) => {
  // loding 動畫載入
  utils.toggleLoading(true);
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

  try {
    const res = await api.addCart(data);      
    cartData = res.data.carts;
    cartTotal = res.data.finalTotal;
    utils.toggleLoading(false);
    renderCarts();
    utils.swalMassage(`${productTitle}已加入購物車`, "success", 800);
  } catch (err) {
    console.error(err.message);
  }
};

productList.addEventListener("click", (e) => {
  e.preventDefault();
  const productId = e.target.dataset.id;
  const productTitle = e.target.dataset.title;
  addCart(productId, productTitle);  
});

// 刪除所有購物車品項
const deleteAllCarts = async () => {
  // loding 動畫載入
  utils.toggleLoading(true);
  try {
    const res = await api.deleteAllCarts();   
    cartData = res.data.carts;
    utils.toggleLoading(false);
    renderCarts();
    utils.swalMassage("已清空溝物車", "success", 800);
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
const deleteCart = async (id, title) => {
  // loding 動畫載入
  utils.toggleLoading(true);
  try {
    const res = await api.deleteCart(id);    
    cartData = res.data.carts;    
    cartTotal = calculateCartTotal(cartData);
    utils.toggleLoading(false);
    renderCarts();
    utils.swalMassage(`刪除單一產品 ${title}成功`, "success", 800);
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
  // loding 動畫載入
  utils.toggleLoading(true);
  try {
    const res = await api.updateCart(data);
    cartData = res.data.carts;
    utils.toggleLoading(false);
    cartTotal = calculateCartTotal(cartData);
    renderCarts();
    utils.swalMassage("購物車商品數量已更新", "success", 800);
  } catch (err) {
    console.error(err);
  }
};

cartList.addEventListener("click", (e) => {
  const id = e.target.closest("tr").dataset.id;
  const title = e.target.dataset.title;  

  e.preventDefault();

  if (e.target.classList.contains("discardBtn")) {
    deleteCart(id, title);
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

// 送出訂單
const orderInfoBtn = document.querySelector(".orderInfo-btn");
const orderInfoForm = document.querySelector(".orderInfo-form");

const checkFrom = () => {
  const constraints = {
    姓名: {
      presence: { message: "是必填欄位" },
    },
    電話: {
      presence: {
        message: "是必填的欄位",
      },
      format: {
        pattern: /^09\d{2}-?\d{3}-?\d{3}$/,
        message: "開頭須為09",
      },
      length: {
        is: 10,
        message: "長度須為10碼",
      },
    },
    Email: {
      presence: {
        message: "是必填的欄位",
      },
      format: {
        pattern: /^[^@\s]+@[^@\s]+\.[^@\s]+$/,
        message: "格式輸入錯誤，需有@ 、.等符號",
      },
    },
    寄送地址: {
      presence: { message: "是必填欄位" },
    },
  };
  const errors = validate(orderInfoForm, constraints);
  console.log(errors);
  if (errors) {
    const errorsArr = Object.keys(errors);
    errorsArr.forEach((item) => {
      console.log(item);
      const message = document.querySelector(`[data-message='${item}']`);
      message.textContent = errors[item][0];
    });
  }
  return errors;
};

const apiAddOrder = async () => {
  // 購物車沒有資料就 return
  if (cartData.length === 0) {
    utils.swalMassage("購物車不得為空", "warning", 800);
    return;
  }
  // 驗證沒通過就 return
  if (checkFrom()) {
    utils.swalMassage("請填寫訂單資料", "warning", 800);
    return;
  }

  const customerName = document.querySelector("#customerName");
  const customerPhone = document.querySelector("#customerPhone");
  const customerEmail = document.querySelector("#customerEmail");
  const customerAddress = document.querySelector("#customerAddress");
  const tradeWay = document.querySelector("#tradeWay");

  const data = {
    data: {
      user: {
        name: customerName.value.trim(),
        tel: customerPhone.value.trim(),
        email: customerEmail.value.trim(),
        address: customerAddress.value.trim(),
        payment: tradeWay.value,
      },
    },
  };

  checkFrom();

  // loding 動畫載入
  utils.toggleLoading(true);

  try {
    const res = await api.apiAddOrder(data);
    console.log(res);
    utils.toggleLoading(false);
    getCartList();
    utils.swalMassage("己送出您的訂單", "success", 800);
    orderInfoForm.reset();
  } catch (err) {
    console.error(err.message);
  }
};

orderInfoBtn.addEventListener("click", (e) => {
  e.preventDefault();
  apiAddOrder();
});

// 初始化
const init = () => {
  getProductList();
  getCartList();
};

init();
