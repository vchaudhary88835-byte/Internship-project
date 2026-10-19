const products=[
 {id:1,name:"Wireless Headphones",price:1499,icon:"🎧",desc:"Comfortable sound for everyday use."},
 {id:2,name:"Smart Watch",price:2199,icon:"⌚",desc:"A simple style for your daily routine."},
 {id:3,name:"Travel Backpack",price:999,icon:"🎒",desc:"Room for your everyday essentials."},
 {id:4,name:"Running Shoes",price:1799,icon:"👟",desc:"Lightweight shoes for active days."},
 {id:5,name:"Desk Lamp",price:699,icon:"💡",desc:"A warm light for your study desk."},
 {id:6,name:"Water Bottle",price:399,icon:"🥤",desc:"Reusable bottle for work and travel."},
 {id:7,name:"Sunglasses",price:599,icon:"🕶️",desc:"A classic look for sunny days."},
 {id:8,name:"Coffee Mug",price:249,icon:"☕",desc:"Your favourite drink, your favourite mug."}
];
const $=id=>document.getElementById(id);
const read=(key,fallback)=>{try{return JSON.parse(localStorage.getItem(key))??fallback}catch{return fallback}};
let cart=read("shopease-cart",[]);
function money(n){return "₹"+n.toLocaleString("en-IN")}
function renderProducts(filter=""){const grid=$("product-grid");const list=products.filter(p=>(p.name+" "+p.desc).toLowerCase().includes(filter.toLowerCase()));grid.innerHTML=list.map(p=>`<article class="product-card"><div class="product-art">${p.icon}</div><h3>${p.name}</h3><p>${p.desc}</p><div class="price">${money(p.price)}</div><button class="button" data-add="${p.id}">Add to cart</button></article>`).join("")||"<p>No products found. Try another search.</p>";}
function saveCart(){localStorage.setItem("shopease-cart",JSON.stringify(cart));renderCart()}
function renderCart(){const box=$("cart-items");$("cart-count").textContent=cart.reduce((s,i)=>s+i.qty,0);if(!cart.length){box.innerHTML='<p class="muted">Your cart is empty. Add a product to get started.</p>'}else{box.innerHTML=cart.map(i=>{const p=products.find(p=>p.id===i.id);return `<div class="cart-row"><div><strong>${p.name}</strong><p>${money(p.price)} each · Subtotal ${money(p.price*i.qty)}</p></div><div class="qty"><button data-change="${p.id}" data-delta="-1" aria-label="Decrease quantity">−</button><span>${i.qty}</span><button data-change="${p.id}" data-delta="1" aria-label="Increase quantity">+</button><button class="button secondary" data-remove="${p.id}">Remove</button></div></div>`}).join("")}const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);$("cart-total").textContent="Total: "+money(total)}
$("product-grid").addEventListener("click",e=>{const b=e.target.closest("[data-add]");if(!b)return;const id=Number(b.dataset.add),item=cart.find(i=>i.id===id);item?item.qty++:cart.push({id,qty:1});saveCart();});
$("cart-items").addEventListener("click",e=>{const change=e.target.closest("[data-change]"),remove=e.target.closest("[data-remove]");if(change){const id=Number(change.dataset.change),item=cart.find(i=>i.id===id);item.qty+=Number(change.dataset.delta);if(item.qty<=0)cart=cart.filter(i=>i.id!==id)}if(remove)cart=cart.filter(i=>i.id!==Number(remove.dataset.remove));saveCart()});
$("search").addEventListener("input",e=>renderProducts(e.target.value));
$("clear-cart").addEventListener("click",()=>{cart=[];saveCart()});
$("checkout").addEventListener("click",()=>{if(!cart.length){alert("Your cart is empty.");return}const total=cart.reduce((s,i)=>s+products.find(p=>p.id===i.id).price*i.qty,0);const order={id:"DEMO-"+Date.now(),date:new Date().toLocaleString(),items:cart,total};const orders=read("shopease-orders",[]);orders.push(order);localStorage.setItem("shopease-orders",JSON.stringify(orders));cart=[];saveCart();alert(`Demo order placed! Reference: ${order.id}\nTotal: ${money(total)}\nThis is a local demo only.`)});
$("account-form").addEventListener("submit",e=>{e.preventDefault();const name=$("display-name").value.trim();if(!name)return;localStorage.setItem("shopease-demo-user",JSON.stringify({name}));$("account-message").textContent=`Demo profile saved for ${name}.`;});
$("logout").addEventListener("click",()=>{localStorage.removeItem("shopease-demo-user");$("display-name").value="";$("account-message").textContent="Demo profile cleared from this browser."});
const savedUser=read("shopease-demo-user",null);if(savedUser){$("display-name").value=savedUser.name;$("account-message").textContent=`Welcome back, ${savedUser.name}.`}renderProducts();renderCart();