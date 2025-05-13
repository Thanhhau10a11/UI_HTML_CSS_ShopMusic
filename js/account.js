// Cập nhật thông tin cá nhân
function updateProfile(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Lưu thông tin vào localStorage
    localStorage.setItem('userProfile', JSON.stringify(data));
    
    // Hiển thị thông báo
    showNotification('Cập nhật thông tin thành công!');
    
    return false;
}

// Đổi mật khẩu
function changePassword(event) {
    event.preventDefault();
    
    const form = event.target;
    const currentPassword = form.querySelector('input[type="password"]').value;
    const newPassword = form.querySelectorAll('input[type="password"]')[1].value;
    const confirmPassword = form.querySelectorAll('input[type="password"]')[2].value;
    
    // Kiểm tra mật khẩu hiện tại
    const storedPassword = localStorage.getItem('userPassword');
    if (currentPassword !== storedPassword) {
        showNotification('Mật khẩu hiện tại không đúng!', 'danger');
        return false;
    }
    
    // Kiểm tra mật khẩu mới
    if (newPassword !== confirmPassword) {
        showNotification('Mật khẩu mới không khớp!', 'danger');
        return false;
    }
    
    // Lưu mật khẩu mới
    localStorage.setItem('userPassword', newPassword);
    
    // Hiển thị thông báo
    showNotification('Đổi mật khẩu thành công!');
    
    return false;
}

// Cập nhật địa chỉ
function updateAddress(event) {
    event.preventDefault();
    
    const form = event.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    
    // Lưu địa chỉ vào localStorage
    localStorage.setItem('userAddress', JSON.stringify(data));
    
    // Hiển thị thông báo
    showNotification('Cập nhật địa chỉ thành công!');
    
    return false;
}

// Xóa sản phẩm khỏi danh sách yêu thích
function removeFromWishlist(productId) {
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    wishlist = wishlist.filter(id => id !== productId);
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
    
    // Xóa phần tử khỏi DOM
    const productElement = document.querySelector(`[data-product-id="${productId}"]`).closest('.col-md-4');
    if (productElement) {
        productElement.remove();
    }
    
    // Hiển thị thông báo
    showNotification('Đã xóa sản phẩm khỏi danh sách yêu thích!');
}

// Thêm sản phẩm vào giỏ hàng từ danh sách yêu thích
function addToCartFromWishlist(productId) {
    // Lấy thông tin sản phẩm
    const productElement = document.querySelector(`[data-product-id="${productId}"]`).closest('.product-card');
    const product = {
        id: productId,
        name: productElement.querySelector('.card-title').textContent,
        price: productElement.querySelector('.card-text').textContent,
        image: productElement.querySelector('img').src,
        quantity: 1
    };
    
    // Lấy giỏ hàng hiện tại
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
    const existingProduct = cart.find(item => item.id === productId);
    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push(product);
    }
    
    // Lưu giỏ hàng
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartCount();
    
    // Hiển thị thông báo
    showNotification('Đã thêm sản phẩm vào giỏ hàng!');
}

// Đăng xuất
function logout() {
    // Xóa thông tin đăng nhập
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userProfile');
    
    // Chuyển hướng về trang đăng nhập
    window.location.href = 'login.html';
}

// Hiển thị thông báo
function showNotification(message, type = 'success') {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="alert alert-${type} alert-dismissible fade show" role="alert">
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert" aria-label="Close"></button>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Tự động ẩn thông báo sau 3 giây
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + parseInt(item.quantity), 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Khởi tạo các sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Kiểm tra đăng nhập
    if (!localStorage.getItem('isLoggedIn')) {
        window.location.href = 'login.html';
        return;
    }
    
    // Cập nhật thông tin người dùng
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    if (userProfile.name) {
        document.querySelector('.card-body h5').textContent = userProfile.name;
    }
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartCount();
    
    // Xử lý sự kiện cho các nút trong danh sách yêu thích
    document.querySelectorAll('.remove-wishlist').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            removeFromWishlist(productId);
        });
    });
    
    document.querySelectorAll('.add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = this.dataset.productId;
            addToCartFromWishlist(productId);
        });
    });
}); 