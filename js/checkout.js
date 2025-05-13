// Load order details when page loads
document.addEventListener('DOMContentLoaded', function() {
    displayOrderItems();
    updateOrderTotal();
});

// Display order items
function displayOrderItems() {
    const cartItems = JSON.parse(localStorage.getItem('cart')) || [];
    const orderItemsContainer = document.getElementById('order-items');
    orderItemsContainer.innerHTML = '';

    // Product database (in real application, this would come from a backend)
    const products = {
        1: {
            name: 'Guitar Acoustic Yamaha F310',
            price: 3500000,
            image: 'images/guitar1.jpg'
        },
        2: {
            name: 'Piano Điện Yamaha P-45',
            price: 15000000,
            image: 'images/piano1.jpg'
        },
        3: {
            name: 'Trống Pearl Export',
            price: 25000000,
            image: 'images/drum1.jpg'
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
        
        const div = document.createElement('div');
        div.className = 'mb-3';
        div.innerHTML = `
            <div class="d-flex justify-content-between align-items-center">
                <div>
                    <h6 class="mb-0">${product.name}</h6>
                    <small class="text-muted">Số lượng: ${quantity}</small>
                </div>
                <span>${formatPrice(total)}</span>
            </div>
        `;
        orderItemsContainer.appendChild(div);
    });

    if (cartItems.length === 0) {
        orderItemsContainer.innerHTML = `
            <p class="text-center">Không có sản phẩm nào trong giỏ hàng</p>
        `;
    }
}

// Update order total
function updateOrderTotal() {
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

    document.getElementById('checkout-subtotal').textContent = formatPrice(subtotal);
    document.getElementById('checkout-total').textContent = formatPrice(total);
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}

// Handle checkout form submission
function handleCheckout(event) {
    event.preventDefault();

    // Get form data
    const formData = {
        firstName: document.getElementById('firstName').value,
        lastName: document.getElementById('lastName').value,
        email: document.getElementById('email').value,
        phone: document.getElementById('phone').value,
        address: document.getElementById('address').value,
        city: document.getElementById('city').value,
        district: document.getElementById('district').value,
        paymentMethod: document.querySelector('input[name="paymentMethod"]:checked').value
    };

    // Validate phone number
    const phoneRegex = /(84|0[3|5|7|8|9])+([0-9]{8})\b/;
    if (!phoneRegex.test(formData.phone)) {
        alert('Vui lòng nhập số điện thoại hợp lệ');
        return false;
    }

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Vui lòng nhập email hợp lệ');
        return false;
    }

    // In a real application, you would send this data to a server
    console.log('Order data:', formData);

    // Show success message
    alert('Đặt hàng thành công! Chúng tôi sẽ liên hệ với bạn sớm.');

    // Clear cart and redirect to home page
    localStorage.removeItem('cart');
    window.location.href = 'index.html';

    return false;
}

// Show/hide bank transfer information
document.getElementById('banking').addEventListener('change', function() {
    const bankingInfo = document.querySelector('.banking-info');
    if (bankingInfo) {
        bankingInfo.style.display = this.checked ? 'block' : 'none';
    }
}); 