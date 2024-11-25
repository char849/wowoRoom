// Loadingy效果
export const toggleLoading = (show) => {
   document.querySelector("#preloder").style.display = show ? 'block' : 'none';
}

// 提示訊息  sweetAlert2
export const swalMassage = (title, icon, time) => {

   // success 成功, error 錯誤, warning 驚嘆號 , info 說明
   swal.fire({
       toast: true,
       position: 'top-end',
       title: title,
       icon: icon,
       timer: time,
       showConfirmButton: false,
   });
};

// 數字轉換千分位函式
export const tothousands = (num) => {
   let parts = num.toString().split('.');
   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   return parts.join('.');
};