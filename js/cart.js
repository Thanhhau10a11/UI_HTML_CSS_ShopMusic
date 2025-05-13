// Cart functionality
class Cart {
    constructor() {
        // Load and sanitize cart data
        let items = JSON.parse(localStorage.getItem('cart')) || [];
        // Ensure price is always a number (fix old data)
        items = items.map(item => ({
            ...item,
            price: Number(String(item.price).replace(/[^\d]/g, '')),
            quantity: Number(item.quantity) || 1
        }));
        this.items = items;
        this.saveCart(); // Save back sanitized data
        this.updateCartCount();
    }

    // Add item to cart (with quantity)
    addItem(product, quantity = 1) {
        const existingItem = this.items.find(item => String(item.id) === String(product.id));
        if (existingItem) {
            existingItem.quantity += quantity;
        } else {
            this.items.push({
                id: product.id,
                name: product.name,
                price: Number(product.price), // always a number
                image: product.image,
                quantity: quantity
            });
        }
        this.saveCart();
        this.updateCartCount();
        this.showNotification('Đã thêm sản phẩm vào giỏ hàng!');
    }

    // Remove item from cart (fix: compare as string)
    removeItem(productId) {
        this.items = this.items.filter(item => String(item.id) !== String(productId));
        this.saveCart();
        this.updateCartCount();
        this.loadCartItems(); // Reload cart display
    }

    // Update item quantity
    updateQuantity(productId, quantity) {
        const item = this.items.find(item => String(item.id) === String(productId));
        if (item) {
            item.quantity = parseInt(quantity);
            if (item.quantity <= 0) {
                this.removeItem(productId);
            } else {
                this.saveCart();
                this.loadCartItems();
            }
        }
    }

    // Save cart to localStorage
    saveCart() {
        localStorage.setItem('cart', JSON.stringify(this.items));
    }

    // Update cart count in header
    updateCartCount() {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            const totalItems = this.items.reduce((sum, item) => sum + item.quantity, 0);
            cartCount.textContent = totalItems;
        }
    }

    // Calculate cart total
    calculateTotal() {
        return this.items.reduce((total, item) => {
            const itemTotal = item.price * item.quantity;
            return total + (isNaN(itemTotal) ? 0 : itemTotal);
        }, 0);
    }

    // Load cart items in cart page
    loadCartItems() {
        const cartContainer = document.getElementById('cart-items');
        if (!cartContainer) return;

        if (this.items.length === 0) {
            cartContainer.innerHTML = '<p class="text-center">Giỏ hàng trống</p>';
            return;
        }

        const total = this.calculateTotal();
        const cartHTML = this.items.map(item => {
            const itemTotal = item.price * item.quantity;
            return `
                <div class="cart-item mb-3">
                    <div class="row align-items-center">
                        <div class="col-md-2">
                            <img src="${item.image}" alt="${item.name}" class="img-fluid">
                        </div>
                        <div class="col-md-4">
                            <h5>${item.name}</h5>
                        </div>
                        <div class="col-md-2">
                            <span>${item.price.toLocaleString('vi-VN')}đ</span>
                        </div>
                        <div class="col-md-2">
                            <input type="number" class="form-control quantity-input" 
                                value="${item.quantity}" min="1" 
                                data-product-id="${item.id}">
                        </div>
                        <div class="col-md-2">
                            <button class="btn btn-danger remove-item" data-product-id="${item.id}">
                                <i class="fas fa-trash"></i>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        }).join('');

        cartContainer.innerHTML = cartHTML + `
            <div class="cart-total text-end mt-3">
                <h4>Tổng cộng: ${total.toLocaleString('vi-VN')}đ</h4>
                <button class="btn btn-primary checkout-btn">Thanh toán</button>
            </div>
        `;

        // Add event listeners
        this.addCartEventListeners();
    }

    // Add event listeners for cart functionality
    addCartEventListeners() {
        // Quantity change
        document.querySelectorAll('.quantity-input').forEach(input => {
            input.addEventListener('change', (e) => {
                const productId = e.target.dataset.productId;
                const quantity = e.target.value;
                this.updateQuantity(productId, quantity);
            });
        });

        // Remove item
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', (e) => {
                const productId = e.target.closest('.remove-item').dataset.productId;
                this.removeItem(productId);
            });
        });

        // Checkout
        const checkoutBtn = document.querySelector('.checkout-btn');
        if (checkoutBtn) {
            checkoutBtn.addEventListener('click', () => this.checkout());
        }
    }

    // Show notification
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'alert alert-success notification';
        notification.textContent = message;
        document.body.appendChild(notification);

        setTimeout(() => {
            notification.remove();
        }, 3000);
    }

    // Checkout process
    checkout() {
        if (this.items.length === 0) {
            alert('Giỏ hàng trống!');
            return;
        }

        const orderData = {
            items: this.items,
            total: this.calculateTotal(),
            date: new Date().toISOString()
        };

        // Save order to localStorage
        const orders = JSON.parse(localStorage.getItem('orders')) || [];
        orders.push(orderData);
        localStorage.setItem('orders', JSON.stringify(orders));

        // Clear cart
        this.items = [];
        this.saveCart();
        this.updateCartCount();
        this.loadCartItems();

        alert('Đặt hàng thành công!');
        window.location.href = 'order-history.html';
    }
}

// Initialize cart
const cart = new Cart();

// Add to cart buttons
document.querySelectorAll('.add-to-cart').forEach(button => {
    button.addEventListener('click', (e) => {
        e.preventDefault();
        const productCard = e.target.closest('.product-card');
        const product = {
            id: button.dataset.productId,
            name: productCard.querySelector('.card-title').textContent,
            price: parseInt(productCard.querySelector('.price').textContent.replace(/[^\d]/g, '')),
            image: productCard.querySelector('img').src
        };
        cart.addItem(product, 1);
    });
});

// Load cart items if on cart page
if (document.getElementById('cart-items')) {
    cart.loadCartItems();
} 