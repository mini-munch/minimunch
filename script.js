// The complete product list with updated sequence, prices, and Rice at the end
const products = [
    { 
        id: 1, name: "Cake Rusk", img: "4-cr.png",
        variants: [ { weight: "1 KG", price: 2000 } ] // Only 1 option (dropdown will be hidden)
    },
    { 
        id: 2, name: "Almond Nan Khatai", img: "5-nan.png",
        variants: [ { weight: "1 KG", price: 2000 } ] // Only 1 option (dropdown will be hidden)
    },
    { 
        id: 3, name: "Almonds Giri", img: "b3.png",
        variants: [ { weight: "500 g", price: 1800 }, { weight: "1 KG", price: 3600 } ]
    },
    { 
        id: 4, name: "Almonds USA", img: "b1.png",
        variants: [ { weight: "500 g", price: 2100 }, { weight: "1 KG", price: 4200 } ]
    },
    { 
        id: 5, name: "Walnuts Giri", img: "b5.png",
        variants: [ { weight: "500 g", price: 1900 }, { weight: "1 KG", price: 3800 } ]
    },
    { 
        id: 6, name: "Pista Giri", img: "b4.png",
        variants: [ { weight: "250 g", price: 2500 }, { weight: "500 g", price: 5000 } ]
    },
    { 
        id: 7, name: "Kaju", img: "b7.png",
        variants: [ { weight: "500 g", price: 2700 }, { weight: "1 KG", price: 5400 } ]
    },
    { 
        id: 8, name: "Roasted Kaju", img: "b8.png",
        variants: [ { weight: "500 g", price: 2800 }, { weight: "1 KG", price: 5600 } ]
    },
    { 
        id: 9, name: "Mix Dry Fruits", img: "b2.png",
        variants: [ { weight: "1 KG", price: 3600 } ]
    },
    { 
        id: 10, name: "Black Raisins", img: "b9.png",
        variants: [ { weight: "500 g", price: 900 }, { weight: "1 KG", price: 1800 } ]
    },
    { 
        id: 11, name: "Sunder Khani Raisins", img: "b10.png",
        variants: [ { weight: "500 g", price: 1000 }, { weight: "1 KG", price: 2000 } ]
    },
    { 
        id: 12, name: "Dry Apricot", img: "b13.png",
        variants: [ { weight: "500 g", price: 1250 }, { weight: "1 KG", price: 2500 } ]
    },
    { 
        id: 13, name: "Phool Makhanay", img: "b6.png",
        variants: [ { weight: "250 g", price: 1750 }, { weight: "500 g", price: 3500 }, { weight: "1 KG", price: 7000 } ]
    },
    { 
        id: 14, name: "Roasted Chana", img: "b12.png",
        variants: [ { weight: "500 g", price: 450 }, { weight: "1 KG", price: 900 } ]
    },
    { 
        id: 15, name: "Dry Fig", img: "b15.png",
        variants: [ { weight: "500 g", price: 2000 }, { weight: "1 KG", price: 4000 } ]
    },
    { 
        id: 16, name: "Hafizabad Basmati Rice", img: "b14.png", // Moved to the very end
        variants: [ { weight: "25 KG Bag", price: 9000 } ]
    }
];

let cart = [];
const FREE_DELIVERY_THRESHOLD = 3000;
const DELIVERY_CHARGE = 200;

// Render Products (With smart hiding of dropdowns for single-option items)
const productsGrid = document.getElementById('products-grid');
products.forEach(product => {
    let selectorHtml = '';

    if (product.variants.length > 1) {
        // Show dropdown if there are multiple options
        let optionsHtml = '';
        product.variants.forEach((v, index) => {
            let isSelected = (index === 0) ? "selected" : "";
            optionsHtml += `<option value="${index}" ${isSelected}>${v.weight} - Rs ${v.price}</option>`;
        });
        selectorHtml = `<select id="variant-${product.id}" class="variant-select">${optionsHtml}</select>`;
    } else {
        // If only 1 option, hide the dropdown and show a nice badge instead!
        selectorHtml = `
            <div style="margin: 8px auto; padding: 7px; font-weight: bold; font-size: 0.9rem; color: #e64a19; background: #fff4f1; border-radius: 6px; width: 90%; box-sizing: border-box;">
                ${product.variants[0].weight} - Rs ${product.variants[0].price}
            </div>
            <input type="hidden" id="variant-${product.id}" value="0">
        `;
    }

    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-img" onerror="this.src='https://via.placeholder.com/220x190?text=${product.name}'">
        <h3 class="product-name">${product.name}</h3>
        ${selectorHtml}
        <button class="add-to-cart" onclick="addToCart(${product.id}, this)">Add to Cart 🛒</button>
    `;
    productsGrid.appendChild(card);
});

// Cart Logic
function addToCart(productId, btnElement) {
    const product = products.find(p => p.id === productId);
    const selectElement = document.getElementById(`variant-${productId}`);
    const selectedVariantIndex = selectElement.value;
    const selectedVariant = product.variants[selectedVariantIndex];
    const cartItemId = `${product.id}-${selectedVariantIndex}`;
    const existingItem = cart.find(item => item.cartItemId === cartItemId);

    if (existingItem) {
        existingItem.qty++;
    } else {
        cart.push({ cartItemId: cartItemId, name: product.name, weight: selectedVariant.weight, price: selectedVariant.price, qty: 1 });
    }
    updateCartUI();
    
    const originalText = btnElement.innerText;
    btnElement.innerText = "Added! ✔️";
    btnElement.style.backgroundColor = "#2e7d32";
    setTimeout(() => {
        btnElement.innerText = originalText;
        btnElement.style.backgroundColor = "#ff5722";
    }, 1000);
}

function updateQty(cartItemId, change) {
    const item = cart.find(i => i.cartItemId === cartItemId);
    if (!item) return;
    item.qty += change;
    if (item.qty <= 0) {
        cart = cart.filter(i => i.cartItemId !== cartItemId);
    }
    updateCartUI();
}

function updateCartUI() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const promoBanner = document.getElementById('delivery-promo');
    const cartSummary = document.getElementById('cart-summary');
    
    cartItemsContainer.innerHTML = '';
    let subtotal = 0;
    let count = 0;

    cart.forEach(item => {
        subtotal += item.price * item.qty;
        count += item.qty;
        cartItemsContainer.innerHTML += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <h4>${item.name} (${item.weight})</h4>
                    <p>Rs ${item.price}</p>
                </div>
                <div class="cart-qty-controls">
                    <button type="button" onclick="updateQty('${item.cartItemId}', -1)">-</button>
                    <span>${item.qty}</span>
                    <button type="button" onclick="updateQty('${item.cartItemId}', 1)">+</button>
                </div>
            </div>
        `;
    });

    cartCount.innerText = count;

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color:#777; margin:20px 0;">Your cart is empty.</p>';
        promoBanner.style.display = 'none';
        cartSummary.style.display = 'none';
        document.getElementById('show-checkout-btn').style.display = 'none';
        document.getElementById('checkout-form').classList.add('hidden');
    } else {
        let deliveryFee = subtotal >= FREE_DELIVERY_THRESHOLD ? 0 : DELIVERY_CHARGE;
        let grandTotal = subtotal + deliveryFee;

        promoBanner.style.display = 'block';
        if (deliveryFee === 0) {
            promoBanner.innerHTML = "🎉 Congratulations! You qualified for <strong>FREE Delivery!</strong>";
            promoBanner.style.background = "#d4edda"; promoBanner.style.color = "#155724"; promoBanner.style.borderColor = "#c3e6cb";
        } else {
            let needed = FREE_DELIVERY_THRESHOLD - subtotal;
            promoBanner.innerHTML = `🚚 Add <strong>Rs ${needed}</strong> more for <strong>FREE Delivery!</strong>`;
            promoBanner.style.background = "#fff3cd"; promoBanner.style.color = "#856404"; promoBanner.style.borderColor = "#ffeeba";
        }

        document.getElementById('cart-subtotal').innerText = `Rs ${subtotal}`;
        document.getElementById('cart-delivery').innerText = deliveryFee === 0 ? 'FREE' : `Rs ${deliveryFee}`;
        document.getElementById('cart-grand-total').innerText = `Rs ${grandTotal}`;
        
        cartSummary.style.display = 'block';
        document.getElementById('show-checkout-btn').style.display = 'block';
    }
}

function toggleCart() {
    document.getElementById('cart-modal').classList.toggle('hidden');
    document.getElementById('checkout-form').classList.add('hidden');
    if(cart.length > 0) document.getElementById('show-checkout-btn').style.display = 'block';
}

function showCheckoutForm() {
    document.getElementById('show-checkout-btn').style.display = 'none';
    document.getElementById('checkout-form').classList.remove('hidden');
}

function closeSuccess() { document.getElementById('success-modal').classList.add('hidden'); }

// Submit Order
function submitOrder(event) {
    event.preventDefault();
    if (cart.length === 0) return alert("Your cart is empty!");

    const name = document.getElementById('cust-name').value;
    const phone = document.getElementById('cust-phone').value;
    const address = document.getElementById('cust-address').value;
    const paymentMethod = document.getElementById('cust-payment').value; 
    
    let orderDetails = cart.map(item => `${item.qty}x ${item.name} (${item.weight})`).join('\n');
    let grandTotal = document.getElementById('cart-grand-total').innerText;
    let deliveryStatus = document.getElementById('cart-delivery').innerText;
    
    orderDetails += `\n[Delivery: ${deliveryStatus}]`;
    orderDetails += `\n[Payment: ${paymentMethod}]`;

    document.getElementById('submit-btn').style.display = 'none';
    document.getElementById('loading-msg').classList.remove('hidden');

    const scriptURL = 'https://script.google.com/macros/s/AKfycbwFaEaOS0EEWAXRyoGk0ZvJlkPLmFuHJJKaZfMQYVGy7-IUWhX7Ahu0gJdnYuH4Ha-t/exec'; // <--- PUT YOUR GOOGLE SCRIPT LINK HERE

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('address', address);
    formData.append('order', orderDetails);
    formData.append('payment', paymentMethod);
    formData.append('total', grandTotal);
    formData.append('cartData', JSON.stringify(cart));

    fetch(scriptURL, { method: 'POST', body: formData, mode: 'no-cors' })
        .then(response => {
            document.getElementById('cart-modal').classList.add('hidden');
            document.getElementById('success-modal').classList.remove('hidden');
            
            cart = [];
            updateCartUI();
            document.getElementById('checkout-form').reset();
            document.getElementById('submit-btn').style.display = 'block';
            document.getElementById('loading-msg').classList.add('hidden');
        })
        .catch(error => {
            alert('Check your internet connection and try again.');
            document.getElementById('submit-btn').style.display = 'block';
            document.getElementById('loading-msg').classList.add('hidden');
        });
}

updateCartUI();
