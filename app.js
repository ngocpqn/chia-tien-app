const tbody = document.querySelector("tbody")

function saveData(){
 const rows=[]
 document.querySelectorAll("tbody tr").forEach(tr=>{
  rows.push({
   name:tr.children[0].firstElementChild.value,
   money:tr.children[1].firstElementChild.value
  })
 })
 localStorage.setItem("chiaTienData",JSON.stringify(rows))
}

function loadData(){
 const data=JSON.parse(localStorage.getItem("chiaTienData")||"[]")

 tbody.innerHTML=""

 if(data.length){
  data.forEach(d=>{
   addRow()
   let last=tbody.lastElementChild
   last.children[0].firstElementChild.value=d.name
   last.children[1].firstElementChild.value=d.money
  })
 }else{
  for(let i=0;i<5;i++) addRow()
 }
}

document.addEventListener("DOMContentLoaded",()=>{
 loadData()
 updateQR()
})

document.addEventListener("input",()=>{
 updateQR()
 saveData()
})
