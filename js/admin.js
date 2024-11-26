// 匯入 c3.js
import "https://cdnjs.cloudflare.com/ajax/libs/d3/5.16.0/d3.min.js";
import "https://cdnjs.cloudflare.com/ajax/libs/c3/0.7.20/c3.min.js";

// 匯入 共用工具
import * as utils from "./utils.js";

// 匯入 共用 API
import * as api from "./api.js";

// 取得訂單列表
const getOrderList = async () => {
  // loding 動畫載入
  utils.toggleLoading(true);
  try {
    const res = await api.getOrderList();    
    orderData = res.data.orders;
    orderData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    renderOrders();
    calcProductCategory();
    calcProductTitle();
    utils.toggleLoading(false);
  } catch (err) {
    console.error(err);
  }
};

// 渲染訂單列表
let orderData = [];
const orderList = document.querySelector(".orderPage-table tbody");
const renderOrders = () => {
  let str = "";
  orderData.forEach((order) => {
    let productStr = "";
    order.products.forEach((product) => {
      productStr += `<p>${product.title}</p> x ${product.quantity}`;
    });
    str += `<tr data-id="${order.id}">
            <td>${order.id}</td>
            <td>
              <p>${order.user.name}</p>
              <p>${order.user.tel}</p>
            </td>
            <td>${order.user.address}</td>
            <td>${order.user.email}</td>
            <td>
              ${productStr}
            </td>
            <td>${utils.timeDate(order.createdAt)}</td>
            <td class="orderStatus">
              <a href="#">${
                order.paid
                  ? `<span style='color: green;'>己處理</span>`
                  : `<span style='color: red;'>未處理</span>`
              }</a>
            </td>
            <td>
              <input type="button" class="delSingleOrder-Btn" value="刪除" />
            </td>
          </tr>`;
  });
  orderList.innerHTML = str;
};

// 刪除單筆訂單
const deleteOrder = async (id) => {
  // loding 動畫載入
  utils.toggleLoading(true);
  try {
    const res = await api.deleteOrder(id);
    orderData = res.data.orders;
    renderOrders();
    calcProductCategory();
    calcProductTitle();
    utils.toggleLoading(false);
    utils.swalMassage(`刪除單一訂單成功`, "success", 800);
  } catch (err) {
    console.error(err);
  }
};

// 刪除所有訂單
const deleteAllOrders = async () => {
  // loding 動畫載入
  utils.toggleLoading(true);
  try {
    const res = await api.deleteAllOrders();
    orderData = res.data.orders;
    renderOrders();
    calcProductCategory();
    calcProductTitle();
    utils.toggleLoading(false);
    utils.swalMassage("已刪除所有訂單", "success", 800);
  } catch (err) {
    console.error(err);
  }
};

const discardAllBtn = document.querySelector(".discardAllBtn");
discardAllBtn.addEventListener("click", (e) => {
  e.preventDefault();
  if (e.target.classList.contains("discardAllBtn")) {
    deleteAllOrders();
  }
});

// 修改訂單狀態
const updateOrder = async (id) => {
  let result = orderData.find((order) => order.id === id);  

  const data = {
    data: {
      id: id,
      paid: !result.paid,
    },
  };
  try {
    const res = await api.updateOrder(data);
    console.log(res);
    orderData = res.data.orders;
    utils.swalMassage("訂單狀態修改成功", "success", 800);
    renderOrders();
  } catch (err) {
    console.error(err.message);
  }
};

// 全產品類別營收比重
const calcProductCategory = () => {
  const totalObj = {};
  orderData.forEach((order) => {
    order.products.forEach((product) => {
      const { category, price, quantity } = product;
      if (totalObj[category] === undefined) {
        totalObj[category] = price * quantity;
      } else {
        totalObj[category] += price * quantity;
      }
    });
  });
  // 轉成陣列包陣列的型式
  renderChat(Object.entries(totalObj));
};

// 全品項營收比重
const calcProductTitle = () => {
  const totalObj = {};
  orderData.forEach((order) => {
    order.products.forEach((product) => {
      const { title, price, quantity } = product;
      if (totalObj[title] === undefined) {
        totalObj[title] = price * quantity;
      } else {
        totalObj[title] += price * quantity;
      }
    });
  });
  // 轉成陣列包陣列的型式
  const totalArr = Object.entries(totalObj);
  // 排序
  const sortTotalArr = totalArr.sort((a, b) => {
    // 對陣列的第二個值做排序
    return b[1] - a[1];
  });
  console.log("sort", sortTotalArr);
  const resultArr = [];
  let otherTotal = 0;
  sortTotalArr.forEach((product, index) => {
    // 拿前三筆資料
    if (index <= 2) {
      resultArr.push(product);
    }
    if (index > 2) {
      otherTotal += product[1]; // 第二個值
    }
  });
  if(sortTotalArr.length > 3){
    resultArr.push(['其它', otherTotal])
  }
  renderChat(resultArr);
};

orderList.addEventListener("click", (e) => {
  e.preventDefault();
  const id = e.target.closest("tr").dataset.id;

  if (e.target.classList.contains("delSingleOrder-Btn")) {
    deleteOrder(id);
  }

  if (e.target.nodeName === "SPAN") {
    updateOrder(id);
  }

  if (e.target.classList.contains("discardAllBtn")) {
    deleteAllCarts();
  }
});


// c3.js
const renderChat = (data) => {
  let chart = c3.generate({
    bindto: "#chart", // HTML 元素綁定
    color: {
      pattern: ["#DACBFF", "#9D7FEA", "#5434A7"],
    },
    data: {
      type: "pie",
      columns: data,
    },
  });
};


// 初始化
const init = () => {
    getOrderList();    
  };
  init();