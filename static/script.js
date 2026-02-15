/* =========================================
   1. BASE DE DATOS DE PRODUCTOS
   ========================================= */
const productosData = {
    "straps": {
        nombre: "Straps HardLift",
        precio: 16000,
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_636414-MLA99538854604_122025-F.webp",
        desc: "Straps de algodón reforzado con neopreno para un agarre máximo en pesos muertos."
    },
    "munequeras": {
        nombre: "Muñequeras Pro",
        precio: 16000,
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_793253-MLA72000166758_102023-F.webp",
        desc: "Soporte rígido para proteger tus muñecas en empujes pesados."
    },
    "guantes": {
        nombre: "Guantes Training",
        precio: 26500,
        img: "https://m.media-amazon.com/images/I/713VdnrukHL._AC_SL1500_.jpg",
        desc: "Protección total para tus palmas con ventilación premium."
    },
    "cinturon": {
        nombre: "Cinturón de Cuero",
        precio: 90000,
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_730416-CBT104893262920_012026-F.webp",
        desc: "Cinturón de potencia de 10mm para máxima estabilidad lumbar."
    },
    "rodilleras": {
        nombre: "Rodilleras 7mm",
        precio: 40000,
        img: "https://www.suplementosnutricionalessalta.com.ar/public/images/productos/754-rodillera-negra-7-mm-x-unidad-talle-l.webp",
        desc: "Compresión de neoprene de 7mm para soporte extremo en sentadillas."
    },
    "vendas": {
        nombre: "Vendas Elásticas",
        precio: 30000,
        img: "https://http2.mlstatic.com/D_NQ_NP_2X_734620-MLA98320362338_112025-F.webp",
        desc: "Vendas de alta elasticidad para soporte ajustable en rodillas o codos."
    }
};

let carrito = JSON.parse(localStorage.getItem('cart')) || [];

/* =========================================
   2. FUNCIONES DE INTERFAZ (UI)
   ========================================= */

// Abrir Modal de detalles
function verProducto(id) {
    const p = productosData[id];
    if(!p) return;

    const modal = document.getElementById('product-modal');
    const body = document.getElementById('modal-body');
    
    body.innerHTML = `
        <img src="${p.img}" style="width:100%; border-radius:15px;">
        <h2 style="margin-top:20px; color:white;">${p.nombre}</h2>
        <p style="color:#aaa; margin:15px 0;">${p.desc}</p>
        <h3 style="color:#ff4d4d; font-size:1.8rem;">$${p.precio.toLocaleString()}</h3>
        <button class="btn" style="width:100%" onclick="agregarAlCarrito('${id}')">AGREGAR AL CARRITO</button>
    `;
    modal.style.display = "block";
}

// Agregar producto al carrito
function agregarAlCarrito(id) {
    const p = productosData[id];
    carrito.push(p);
    saveAndRefresh();
    closeModal();
    
    // Abrir carrito con un pequeño delay para feedback visual
    setTimeout(() => toggleCart(), 300);
}

// Actualizar lista visual del carrito
function actualizarCarritoUI() {
    const count = document.getElementById('cart-count');
    const itemsContainer = document.getElementById('cart-items');
    const totalElemento = document.getElementById('cart-total');
    
    count.innerText = carrito.length;
    itemsContainer.innerHTML = "";
    let subtotal = 0;

    carrito.forEach((p, index) => {
        subtotal += p.precio;
        itemsContainer.innerHTML += `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; border-bottom:1px solid #222; padding-bottom:10px;">
                <div style="text-align:left;">
                    <p style="margin:0; font-weight:bold; font-size:0.9rem;">${p.nombre}</p>
                    <p style="margin:0; color:#ff4d4d;">$${p.precio.toLocaleString()}</p>
                </div>
                <button onclick="eliminarProducto(${index})" style="background:none; border:none; color:#555; cursor:pointer; font-size:1.2rem;">&times;</button>
            </div>
        `;
    });

    totalElemento.innerText = `$${subtotal.toLocaleString()}`;
}

// Eliminar producto
function eliminarProducto(index) {
    carrito.splice(index, 1);
    saveAndRefresh();
}

// Guardar en LocalStorage y refrescar UI
function saveAndRefresh() {
    localStorage.setItem('cart', JSON.stringify(carrito));
    actualizarCarritoUI();
}

/* =========================================
   3. FINALIZAR COMPRA (WHATSAPP)
   ========================================= */
document.querySelector('.btn-checkout').onclick = function() {
    if (carrito.length === 0) {
        alert("Tu carrito está vacío. ¡Añade algo de equipo antes de pedir!");
        return;
    }

    const telefono = "5493491507471"; 
    
    let mensaje = "🔥 *NUEVO PEDIDO - HARDLIFT* 🔥\n";
    mensaje += "----------------------------------\n";
    
    let subtotal = 0;
    carrito.forEach((p) => {
        mensaje += `✅ *${p.nombre}* - $${p.precio.toLocaleString()}\n`;
        subtotal += p.precio;
    });

    mensaje += "----------------------------------\n";
    mensaje += `💰 *TOTAL: $${subtotal.toLocaleString()}*\n\n`;
    mensaje += "¿Me confirmas el stock para coordinar el pago? 💪";

    const urlWhatsApp = `https://wa.me/${telefono}?text=${encodeURIComponent(mensaje)}`;
    window.open(urlWhatsApp, '_blank');
};

/* =========================================
   4. CONTROLES DE CIERRE Y APERTURA
   ========================================= */
function toggleCart() { 
    document.getElementById('cart-sidebar').classList.toggle('active'); 
}

function closeModal() { 
    document.getElementById('product-modal').style.display = "none"; 
}

// Cerrar carrito al hacer clic fuera
document.addEventListener('click', (e) => {
    const sidebar = document.getElementById('cart-sidebar');
    const cartBtn = document.querySelector('.cart-btn-container');
    
    if (!sidebar.contains(e.target) && !cartBtn.contains(e.target) && sidebar.classList.contains('active')) {
        toggleCart();
    }
});

// Cerrar modal al hacer clic fuera
window.onclick = (e) => { 
    if(e.target.className === 'modal') closeModal(); 
};

// Iniciar app
actualizarCarritoUI();