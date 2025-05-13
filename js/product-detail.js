// Xử lý thay đổi ảnh chính khi click vào ảnh nhỏ
function changeMainImage(src) {
    document.querySelector('.main-image img').src = src;
}

// Xử lý tăng/giảm số lượng sản phẩm
function increaseQuantity() {
    const input = document.getElementById('quantity');
    input.value = parseInt(input.value) + 1;
}

function decreaseQuantity() {
    const input = document.getElementById('quantity');
    if (parseInt(input.value) > 1) {
        input.value = parseInt(input.value) - 1;
    }
}

// Xử lý thêm vào giỏ hàng
function addToCart() {
    const productId = new URLSearchParams(window.location.search).get('id');
    const quantity = parseInt(document.getElementById('quantity').value);
    // Lấy thông tin sản phẩm từ DOM
    const name = document.querySelector('.product-detail h1').textContent;
    const price = parseInt(document.querySelector('.product-detail h2').textContent.replace(/[^\d]/g, ''));
    const image = document.querySelector('.main-image img').src;
    const product = {
        id: productId,
        name: name,
        price: price,
        image: image
    };
    // Sử dụng class Cart để thêm sản phẩm với số lượng đúng
    const cart = new Cart();
    cart.addItem(product, quantity);
}

// Xử lý thêm vào danh sách yêu thích
function addToWishlist() {
    const productId = window.location.pathname.split('/').pop().split('.')[0];
    
    // Lấy danh sách yêu thích từ localStorage
    let wishlist = JSON.parse(localStorage.getItem('wishlist')) || [];
    
    // Kiểm tra xem sản phẩm đã có trong danh sách yêu thích chưa
    if (!wishlist.includes(productId)) {
        wishlist.push(productId);
        localStorage.setItem('wishlist', JSON.stringify(wishlist));
        showNotification('Đã thêm vào danh sách yêu thích!');
    } else {
        showNotification('Sản phẩm đã có trong danh sách yêu thích!');
    }
}

// Xử lý gửi đánh giá
function submitReview(event) {
    event.preventDefault();
    
    const form = event.target;
    const rating = form.querySelector('.rating-input .fas').dataset.rating;
    const title = form.querySelector('input[type="text"]').value;
    const content = form.querySelector('textarea').value;
    
    // Lưu đánh giá vào localStorage hoặc gửi lên server
    const review = {
        rating: rating,
        title: title,
        content: content,
        date: new Date().toLocaleDateString('vi-VN'),
        user: 'Người dùng' // Thay bằng tên người dùng thực tế
    };
    
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Hiển thị thông báo
    showNotification('Cảm ơn bạn đã đánh giá sản phẩm!');
    
    // Reset form
    form.reset();
    
    // Cập nhật danh sách đánh giá
    updateReviewsList();
}

// Cập nhật danh sách đánh giá
function updateReviewsList() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewsList = document.querySelector('.reviews-list');
    
    if (reviewsList) {
        reviewsList.innerHTML = reviews.map(review => `
            <div class="review-item mb-4">
                <div class="d-flex justify-content-between mb-2">
                    <div>
                        <h6 class="mb-0">${review.user}</h6>
                        <small class="text-muted">${review.date}</small>
                    </div>
                    <div class="rating">
                        ${Array(5).fill().map((_, i) => `
                            <i class="fas fa-star ${i < review.rating ? 'text-warning' : 'text-muted'}"></i>
                        `).join('')}
                    </div>
                </div>
                <h6>${review.title}</h6>
                <p>${review.content}</p>
            </div>
        `).join('');
    }
}

// Hiển thị thông báo
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <div class="alert alert-success alert-dismissible fade show" role="alert">
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
    // Lấy ID sản phẩm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const productId = urlParams.get('id');

    // Giả lập dữ liệu sản phẩm (trong thực tế sẽ lấy từ database)
    const products = {
        1: {
            id: 1,
            name: 'Guitar Acoustic Yamaha F310',
            price: '3.500.000đ',
            images: ['images/piano.jpg', 'images/piano.jpg', 'images/piano.jpg'],
            description: 'Guitar Acoustic Yamaha F310 là một trong những cây đàn guitar acoustic phổ biến nhất của Yamaha, được thiết kế dành cho người mới bắt đầu và người chơi trung cấp.',
            specs: {
                brand: 'Yamaha',
                model: 'F310',
                type: 'Acoustic',
                body: 'Gỗ thông',
                top: 'Gỗ thông',
                neck: 'Gỗ nato',
                fretboard: 'Gỗ hồng mộc',
                warranty: '12 tháng'
            }
        },
        2: {
            id: 2,
            name: 'Piano Điện Yamaha P-45',
            price: '15.000.000đ',
            images: ['images/piano.jpg', 'images/piano.jpg', 'images/piano.jpg'],
            description: 'Piano điện với âm thanh chân thực, phù hợp cho học tập và biểu diễn.',
            specs: {
                brand: 'Yamaha',
                model: 'P-45',
                type: 'Piano điện',
                keys: '88 phím',
                weight: '11.5 kg',
                dimensions: '1326 x 295 x 154 mm',
                warranty: '12 tháng'
            }
        },
        3: {
            id: 3,
            name: 'Trống Pearl Export',
            price: '25.000.000đ',
            images: ['images/piano.jpg', 'images/piano.jpg', 'images/piano.jpg'],
            description: 'Bộ trống chất lượng cao, phù hợp cho biểu diễn chuyên nghiệp.',
            specs: {
                brand: 'Pearl',
                model: 'Export',
                type: 'Acoustic Drum Set',
                shells: 'Gỗ Poplar',
                sizes: '22" Bass, 12" Tom, 13" Tom, 16" Floor Tom, 14" Snare',
                warranty: '12 tháng'
            }
        }
    };

    if (productId && products[productId]) {
        const product = products[productId];
        
        // Cập nhật thông tin sản phẩm
        document.title = `${product.name} - Music Store`;
        document.querySelector('h1').textContent = product.name;
        document.querySelector('.text-primary').textContent = product.price;
        document.querySelector('.product-description p').textContent = product.description;

        // Cập nhật hình ảnh
        const mainImage = document.querySelector('.main-image img');
        const thumbnails = document.querySelector('.thumbnail-images');
        
        mainImage.src = product.images[0];
        mainImage.alt = product.name;
        
        thumbnails.innerHTML = product.images.map((img, index) => `
            <img src="${img}" alt="Thumbnail ${index + 1}" class="img-thumbnail" 
                 style="width: 80px; height: 80px; object-fit: cover;"
                 onclick="changeMainImage('${img}')">
        `).join('');

        // Cập nhật thông số kỹ thuật
        const specsTable = document.querySelector('#specs table tbody');
        specsTable.innerHTML = Object.entries(product.specs).map(([key, value]) => `
            <tr>
                <th>${key.charAt(0).toUpperCase() + key.slice(1)}</th>
                <td>${value}</td>
            </tr>
        `).join('');
    }

    // Khởi tạo rating input
    const ratingInput = document.querySelector('.rating-input');
    if (ratingInput) {
        const stars = ratingInput.querySelectorAll('.far');
        stars.forEach(star => {
            star.addEventListener('click', function() {
                const rating = this.dataset.rating;
                stars.forEach(s => {
                    if (s.dataset.rating <= rating) {
                        s.classList.remove('far');
                        s.classList.add('fas');
                    } else {
                        s.classList.remove('fas');
                        s.classList.add('far');
                    }
                });
            });
        });
    }
    
    // Cập nhật số lượng sản phẩm trong giỏ hàng
    updateCartCount();
    
    // Cập nhật danh sách đánh giá
    updateReviewsList();

    // Initialize cart
    const cart = new Cart();

    // Quantity controls
    function decreaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        const currentValue = parseInt(quantityInput.value);
        if (currentValue > 1) {
            quantityInput.value = currentValue - 1;
        }
    }

    function increaseQuantity() {
        const quantityInput = document.getElementById('quantity');
        const currentValue = parseInt(quantityInput.value);
        quantityInput.value = currentValue + 1;
    }

    // Add to cart
    function addToCart() {
        const quantity = parseInt(document.getElementById('quantity').value);
        const product = {
            id: productId,
            name: document.querySelector('.product-detail h1').textContent,
            price: parseInt(document.querySelector('.product-detail h2').textContent.replace(/[^\d]/g, '')),
            image: document.querySelector('.main-image img').src,
            quantity: quantity
        };

        // Add to cart multiple times based on quantity
        for (let i = 0; i < quantity; i++) {
            cart.addItem(product);
        }
    }

    // Buy now
    function buyNow() {
        addToCart();
        window.location.href = 'cart.html';
    }

    // Make functions globally available
    window.decreaseQuantity = decreaseQuantity;
    window.increaseQuantity = increaseQuantity;
    window.addToCart = addToCart;
    window.buyNow = buyNow;
}); 