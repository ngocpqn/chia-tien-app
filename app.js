const BIN="970422"
const ACC="0934612989"
const NAME="PHAM QUANG NGOC"

const tbody=document.querySelector("tbody")

function addRow(){
 let tr=document.createElement("tr")
 tr.innerHTML=`
 <td><input></td>
 <td><input type=number value=0></td>
 <td><canvas></canvas></td>`
 tbody.appendChild(tr)
}

for(let i=0;i<5;i++) addRow()

function vietQR(amount,content){
 function f(id,val){return id+String(val.length).padStart(2,"0")+val}
 let payload=
 f("00","01")+
 f("01","12")+
 f("38",
   f("00","A000000727")+
   f("01",BIN)+
   f("02",ACC)+
   f("03","QRIBFTTA")
 )+
 f("53","704")+
 f("54",amount)+
 f("58","VN")+
 f("62",f("08",content))
 let crc=crc16(payload+"6304")
 return payload+"6304"+crc
}

function crc16(str){
 let crc=0xFFFF
 for(let c of str){
  crc ^= c.charCodeAt(0)<<8
  for(let i=0;i<8;i++)
   crc = crc & 0x8000 ? (crc<<1)^0x1021 : crc<<1
 }
 return (crc & 0xFFFF).toString(16).toUpperCase().padStart(4,"0")
}

function updateQR(){
 document.querySelectorAll("tbody tr").forEach(tr=>{
  let name=tr.children[0].firstElementChild.value || "ThanhToan"
  let money=tr.children[1].firstElementChild.value
  let canvas=tr.children[2].firstElementChild
  let data=vietQR(money,name)
  QRCode.toCanvas(canvas,data,{width:120})
 })
}

setInterval(updateQR,1000)

function split(){
 let total=Number(document.getElementById("total").value)
 let rows=document.querySelectorAll("tbody tr")
 let each=Math.floor(total/rows.length)
 rows.forEach(r=> r.children[1].firstElementChild.value=each)
}
