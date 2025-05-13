const script = document.createElement('script');
    script.src = 'https://app.preny.ai/embed-global.js';
    script.async = true;
    script.defer = true;
    script.dataset.prenyBotId = '67f542f560a3a78c1ae4dbe4';
    script.dataset.buttonStyle = 'width:200px;height:200px';
    document.body.appendChild(script);



// Dữ liệu sản phẩm mẫu (trong thực tế sẽ lấy từ database)
const products = [
    {
        id: 1,
        name: 'Guitar Acoustic Yamaha F310',
        price: '3.500.000đ',
        image: 'images/piano.jpg',
        description: 'Guitar acoustic chất lượng cao, phù hợp cho người mới bắt đầu.'
    },
    {
        id: 2,
        name: 'Piano Điện Yamaha P-45',
        price: '15.000.000đ',
        image: 'images/piano.jpg',
        description: 'Piano điện với âm thanh chân thực, phù hợp cho học tập và biểu diễn.'
    },
    {
        id: 3,
        name: 'Trống Pearl Export',
        price: '25.000.000đ',
        image: 'images/piano.jpg',
        description: 'Bộ trống chất lượng cao, phù hợp cho biểu diễn chuyên nghiệp.'
    }
];

// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add animation class to elements
    const animatedElements = document.querySelectorAll('.product-card, .banner');
    animatedElements.forEach(element => {
        element.classList.add('fade-in');
    });

    // Xử lý form tìm kiếm
    const searchForm = document.querySelector('.search-form');
    if (searchForm) {
        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[name="q"]');
            const searchQuery = searchInput.value.trim();
            
            if (searchQuery) {
                // Tìm kiếm sản phẩm
                const searchResults = products.filter(product => 
                    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    product.description.toLowerCase().includes(searchQuery.toLowerCase())
                );

                // Hiển thị kết quả
                const productsContainer = document.querySelector('.row');
                if (searchResults.length > 0) {
                    productsContainer.innerHTML = searchResults.map(product => `
                        <div class="col-md-4 mb-4">
                            <div class="product-card">
                                <a href="product-detail.html?id=${product.id}">
                                    <img src="${product.image}" alt="${product.name}">
                                    <div class="card-body">
                                        <h5 class="card-title">${product.name}</h5>
                                        <p class="card-text">${product.description}</p>
                                        <div class="d-flex justify-content-between align-items-center">
                                            <span class="price">${product.price}</span>
                                            <button class="btn btn-primary add-to-cart" data-product-id="${product.id}">
                                                <i class="fas fa-cart-plus"></i> Thêm vào giỏ
                                            </button>
                                        </div>
                                    </div>
                                </a>
                            </div>
                        </div>
                    `).join('');
                } else {
                    productsContainer.innerHTML = `
                        <div class="col-12 text-center py-5">
                            <i class="fas fa-search fa-3x text-muted mb-3"></i>
                            <h3>Không tìm thấy sản phẩm nào</h3>
                            <p class="text-muted">Vui lòng thử lại với từ khóa khác</p>
                        </div>
                    `;
                }
            }
        });
    }

    // Xử lý sắp xếp sản phẩm
    const sortSelect = document.querySelector('.form-select');
    if (sortSelect) {
        sortSelect.addEventListener('change', function() {
            const sortValue = this.value;
            const productsContainer = document.querySelector('.row');
            const productCards = Array.from(productsContainer.children);

            productCards.sort((a, b) => {
                const priceA = parseInt(a.querySelector('.price').textContent.replace(/[^\d]/g, ''));
                const priceB = parseInt(b.querySelector('.price').textContent.replace(/[^\d]/g, ''));
                const nameA = a.querySelector('.card-title').textContent;
                const nameB = b.querySelector('.card-title').textContent;

                switch (sortValue) {
                    case 'Giá tăng dần':
                        return priceA - priceB;
                    case 'Giá giảm dần':
                        return priceB - priceA;
                    case 'Tên A-Z':
                        return nameA.localeCompare(nameB);
                    default:
                        return 0;
                }
            });

            productsContainer.innerHTML = '';
            productCards.forEach(card => productsContainer.appendChild(card));
        });
    }

    // Xử lý thêm vào giỏ hàng
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            const productId = this.dataset.productId;
            const product = products.find(p => p.id === parseInt(productId));
            
            if (product) {
                // Lấy giỏ hàng từ localStorage
                let cart = JSON.parse(localStorage.getItem('cart')) || [];
                
                // Kiểm tra xem sản phẩm đã có trong giỏ hàng chưa
                const existingItem = cart.find(item => item.id === product.id);
                
                if (existingItem) {
                    existingItem.quantity += 1;
                } else {
                    cart.push({
                        id: product.id,
                        name: product.name,
                        price: product.price,
                        image: product.image,
                        quantity: 1
                    });
                }
                
                // Lưu giỏ hàng vào localStorage
                localStorage.setItem('cart', JSON.stringify(cart));
                
                // Cập nhật số lượng sản phẩm trong giỏ hàng
                updateCartCount();
                
                // Hiển thị thông báo
                showNotification('Đã thêm sản phẩm vào giỏ hàng!');
            }
        });
    });
});

// Cập nhật số lượng sản phẩm trong giỏ hàng
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
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

// Form validation
function validateForm(form) {
    const inputs = form.querySelectorAll('input[required]');
    let isValid = true;

    inputs.forEach(input => {
        if (!input.value.trim()) {
            isValid = false;
            input.classList.add('is-invalid');
        } else {
            input.classList.remove('is-invalid');
        }
    });

    return isValid;
} 