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
    },
    {
        id: 4,
        name: 'Trống Pearl Export',
        price: '25.000.000đ',
        image: 'images/piano.jpg',
        description: 'Bộ trống chất lượng cao, phù hợp cho biểu diễn chuyên nghiệp.'
    },
    {
        id: 5,
        name: 'Trống Pearl Export',
        price: '25.000.000đ',
        image: 'images/piano.jpg',
        description: 'Bộ trống chất lượng cao, phù hợp cho biểu diễn chuyên nghiệp.'
    },
    {
        id: 6,
        name: 'Trống Pearl Export',
        price: '25.000.000đ',
        image: 'images/piano.jpg',
        description: 'Bộ trống chất lượng cao, phù hợp cho biểu diễn chuyên nghiệp.'
    }

];

// Xử lý khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Lấy từ khóa tìm kiếm từ URL
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('q');

    if (searchQuery) {
        // Hiển thị từ khóa tìm kiếm
        const searchQueryElement = document.getElementById('search-query');
        if (searchQueryElement) {
            searchQueryElement.textContent = searchQuery;
        }

        // Tìm kiếm sản phẩm
        const searchResults = products.filter(product => 
            product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            product.description.toLowerCase().includes(searchQuery.toLowerCase())
        );

        // Hiển thị kết quả
        const resultsContainer = document.getElementById('search-results');
        const noResults = document.querySelector('.no-results');

        if (searchResults.length > 0) {
            resultsContainer.innerHTML = searchResults.map(product => `
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
            noResults.classList.remove('d-none');
        }
    }
}); 