// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    displayCartItems();
    updateCartTotal();
});

// Display cart items
function displayCartItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const cartItemsContainer = document.getElementById('cart-items');
    cartItemsContainer.innerHTML = '';

    // Product database (in real application, this would come from a backend)
    const products = {
        1: {
            name: 'Guitar Acoustic Yamaha F310',
            price: 3500000,
            image: 'images/piano.jpg'
        },
        2: {
            name: 'Piano Điện Yamaha P-45',
            price: 15000000,
            image: 'images/piano.jpg'
        },
        3: {
            name: 'Trống Pearl Export',
            price: 25000000,
            image: 'images/piano.jpg'
        }
    };

    // Count occurrences of each product
    const productCounts = {};
    cartItems.forEach(id => {
        productCounts[id] = (productCounts[id] || 0) + 1;
    });

    // Display each unique product
    Object.entries(productCounts).forEach(([productId, quantity]) => {
        const product = products[productId];
        if (!product) return;

        const total = product.price * quantity;
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <div class="d-flex align-items-center">
                    <img src="${product.image}" alt="${product.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                    <span>${product.name}</span>
                </div>
            </td>
            <td>${formatPrice(product.price)}</td>
            <td>
                <div class="input-group" style="width: 120px;">
                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${productId}, -1)">-</button>
                    <input type="number" class="form-control text-center" value="${quantity}" min="1" onchange="updateQuantityDirect(${productId}, this.value)">
                    <button class="btn btn-outline-secondary" type="button" onclick="updateQuantity(${productId}, 1)">+</button>
                </div>
            </td>
            <td>${formatPrice(total)}</td>
            <td>
                <button class="btn btn-danger btn-sm" onclick="removeFromCart(${productId})">
                    <i class="fas fa-trash"></i>
                </button>
            </td>
        `;
        cartItemsContainer.appendChild(tr);
    });

    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = `
            <tr>
                <td colspan="5" class="text-center py-4">
                    <p>Giỏ hàng của bạn đang trống</p>
                    <a href="products.html" class="btn btn-primary">Tiếp tục mua sắm</a>
                </td>
            </tr>
        `;
    }
}

// Update quantity
function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const index = cart.indexOf(productId.toString());
    
    if (change > 0) {
        cart.push(productId.toString());
    } else if (index !== -1) {
        cart.splice(index, 1);
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    displayCartItems();
    updateCartTotal();
    updateCartCount();
}

// Update quantity directly
function updateQuantityDirect(productId, newQuantity) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const filteredCart = cart.filter(id => id !== productId.toString());
    
    for (let i = 0; i < parseInt(newQuantity); i++) {
        filteredCart.push(productId.toString());
    }

    localStorage.setItem('cart', JSON.stringify(filteredCart));
    displayCartItems();
    updateCartTotal();
    updateCartCount();
}

// Remove from cart
function removeFromCart(productId) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const filteredCart = cart.filter(id => id !== productId.toString());
    localStorage.setItem('cart', JSON.stringify(filteredCart));
    displayCartItems();
    updateCartTotal();
    updateCartCount();
}

// Update cart total
function updateCartTotal() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const products = {
        1: { price: 3500000 },
        2: { price: 15000000 },
        3: { price: 25000000 }
    };

    const subtotal = cartItems.reduce((total, productId) => {
        return total + (products[productId]?.price || 0);
    }, 0);

    const shipping = cartItems.length > 0 ? 30000 : 0;
    const total = subtotal + shipping;

    document.getElementById('subtotal').textContent = formatPrice(subtotal);
    document.getElementById('total').textContent = formatPrice(total);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Proceed to checkout
function proceedToCheckout() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    if (cart.length === 0) {
        alert('Giỏ hàng của bạn đang trống');
        return;
    }
    window.location.href = 'checkout.html';
} 