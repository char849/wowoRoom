// Loadingy效果
const toggleLoading = (show) => {
   document.querySelector("#preloder").style.display = show ? 'block' : 'none';
}

// 提示訊息  sweetAlert2
const swalMassage = (title, icon, time) => {

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
const tothousands = (num) => {
   let parts = num.toString().split('.');
   parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
   return parts.join('.');
};

// 日期格式處理
const timeDate = (time) => {
   // 時間要轉為毫秒要 13位數
   const timeStamp = new Date(time * 1000);

   // 方法一
   return `${timeStamp.getFullYear()} / ${timeStamp.getMonth() + 1} / ${timeStamp.getDate()}
   ${String(timeStamp.getHours()).padStart(2,0)}:${String(timeStamp.getMinutes()).padStart(2,0)}:${String(timeStamp.getSeconds()).padStart(2,0)}`;
};

// 先轉成字串後，再用 padStart() 方法，傳入2個參數
// String(timeStamp.getHours()).padStart(2,0) 將小時變成2位數，如果沒有二位數前面補0

// 方法二
// return time.toLocaleString('zh-Tw', {hour12: false});

export { toggleLoading, swalMassage, tothousands, timeDate};