# wowoRoom 傢俱電商

[![made-with-javascript](https://img.shields.io/badge/Made%20with-JavaScript-1f425f.svg)](https://www.javascript.com)
[![made-for-VSCode](https://img.shields.io/badge/Made%20for-VSCode-1f425f.svg)](https://code.visualstudio.com/)

## Demo Link
### 前台
- [Demo](https://char849.github.io/wowoRoom/)

### 後台
- [Demo](https://char849.github.io/wowoRoom/admin)

## 使用相關套件
- [aos](https://michalsnik.github.io/aos/)
- [axios](https://axios-http.com/)
- [sweetalert2](https://sweetalert2.github.io/)
- [validate.js](https://validatejs.org/)

## 前台開發
- axios 搭配 Async/Await 與錯誤管理整合
- 建立前後台實體，可以分開管理api
- 商品篩選功能
- 加入購物車，物車無商品...文字會轉成購物車商品列表
- 加入購物車時，會顯示加入的商品名稱
- 購物車數量更改功能
- 單一商品刪除
- 數字轉換千分位
- 刪除單一商品時，會顯示刪除的商品名稱
- 全部商品刪除
- 當購物車沒資料時，只會顯購物車無商品...
- 表單驗證 - 當購物車沒資料時，無法送出表單
- 表單驗證 - 當表單資料沒填寫或填寫錯誤，無法送出表單

## 後台開發
- 訂單列表使用，使用方法 sort() 排序
- 訂單日期，時間戳設計，使用 padStart() 方法，將變成 2 位數
- 一張訂單多個品項顯示及數量
- 可更改訂單狀態切換
- 刪除訂單，會顯示刪除單一訂單成功
- c3 圖表，顯示全產品類別營收比重
- c3 圖表，全品項營收比重，使用方法 sort() 排序
- 全產品類別營收比重，類別含三項，共有：床架、收納、窗簾
- 全品項營收比重，類別含四項，篩選出前三名營收品項，其他 4~8 名都統整為「其它」



