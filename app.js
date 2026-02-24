// ===== CẤU HÌNH TÀI KHOẢN =====
const BIN = "970422"
const ACC = "0934612989"
const NAME = "PHAM QUANG NGOC"

// ===== DOM =====
const tbody = document.querySelector("tbody")

// ===== THÊM DÒNG =====
function addRow(){
 let tr = document.createElement("tr")
 tr.innerHTML = `
   <td><input class="name"></td>
   <td><input type="number" class="money" value="0" min="0"></td>
   <td style="text-align:center">
     <input type="checkbox" class="paid">
   </td>
   <td><canvas></canvas></td>
 `
 tbody.appendChild(tr)
}

// ===== LƯU DATA =====
function saveData(){
 const rows=[]
 tbody.querySelectorAll("tr").forEach(tr=>{
  rows.push({
   name: tr.querySelector(".name").value,
   money: tr.querySelector(".money").value,
   paid: tr.querySelector(".paid").checked
  })
 })
 localStorage.setItem("chiaTienData", JSON.stringify(rows))
}

// ===== LOAD DATA =====
function loadData(){
 const data = JSON.parse(localStorage.getItem("chiaTienData") || "[]")
 tbody.innerHTML=""

 if(data.length){
  data.forEach(d=>{
   addRow()
   const last = tbody.lastElementChild
   last.querySelector(".name").value = d.name
   last.querySelector(".money").value = d.money
   last.querySelector(".paid").checked = d.paid
   if(d.paid) last.classList.add("paid-row")
  })
 }else{
  for(let i=0;i<5;i++) addRow()
 }
}

// ===== CRC16 EMV =====
function crc16(str){
 let crc = 0xFFFF

 for (let i = 0; i < str.length; i++) {
  crc ^= str.charCodeAt(i) << 8

  for (let j = 0; j < 8; j++) {
   if ((crc & 0x8000) !== 0) {
    crc = (crc << 1) ^ 0x1021
   } else {
    crc = crc << 1
   }
   crc &= 0xFFFF   // 🔥 BẮT BUỘC GIỮ 16 BIT
  }
 }

 return crc.toString(16).toUpperCase().padStart(4,"0")
}

// ===== TẠO VIETQR =====
function vietQR(amount, content){

 function f(id,val){
  return id + String(val.length).padStart(2,"0") + val
 }

 const merchantAccount =
   f("00","A000000727") +
   f("01","QRIBFTTA") +
   f("02", BIN + ACC)   // 🔥 GHÉP BIN + STK

let payload =
  f("00","01") +
  f("01","12") +
  f("38", merchantAccount) +
  f("53","704")

if(amount && Number(amount) > 0){
  payload += f("54", amount)
}

payload +=
  f("58","VN") +
  f("59", NAME) +
  f("60","HANOI") +
  f("62", f("08", content))

 const crc = crc16(payload + "6304")
 return payload + "6304" + crc
}

// ===== UPDATE QR =====
function updateQR(){
 tbody.querySelectorAll("tr").forEach(tr=>{
  let rawName = tr.querySelector(".name").value || "ThanhToan"
  let name = removeVietnameseTones(rawName)
  name = name.trim().toUpperCase().substring(0,25)
  const money = tr.querySelector(".money").value || "0"
  const paid = tr.querySelector(".paid").checked
  const canvas = tr.querySelector("canvas")

  const qrData = vietQR(money, name)
  QRCode.toCanvas(canvas, qrData, { width:120 })

  if(paid){
   tr.classList.add("paid-row")
  }else{
   tr.classList.remove("paid-row")
  }
 })
}
// ===== hàm bỏ dấu =====
function removeVietnameseTones(str){
 return str.normalize("NFD")
           .replace(/[\u0300-\u036f]/g, "")
           .replace(/đ/g, "d")
           .replace(/Đ/g, "D")
}
// ===== CHIA ĐỀU =====
function split(){
 const total = Number(document.getElementById("total").value) || 0
 const rows = tbody.querySelectorAll("tr")
 if(!rows.length) return

 const each = Math.floor(total / rows.length)
 rows.forEach(r=>{
  r.querySelector(".money").value = each
 })
 updateQR()
 saveData()
}

// ===== EVENT =====
document.addEventListener("DOMContentLoaded",()=>{
 loadData()
 updateQR()
})

document.addEventListener("input",()=>{
 updateQR()
 saveData()
})

document.addEventListener("change",()=>{
 updateQR()
 saveData()
})





