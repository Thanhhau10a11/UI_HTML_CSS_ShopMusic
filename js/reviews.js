// Xử lý đánh giá sao
function initializeRating() {
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
}

// Xử lý gửi đánh giá
function submitReview(event) {
    event.preventDefault();
    
    // Kiểm tra đăng nhập
    if (!localStorage.getItem('isLoggedIn')) {
        showNotification('Vui lòng đăng nhập để đánh giá sản phẩm!', 'warning');
        window.location.href = 'login.html';
        return false;
    }
    
    const form = event.target;
    const rating = form.querySelector('.rating-input .fas')?.dataset.rating || 0;
    const title = form.querySelector('input[type="text"]').value;
    const content = form.querySelector('textarea').value;
    const images = form.querySelector('input[type="file"]').files;
    
    // Kiểm tra dữ liệu
    if (rating === 0) {
        showNotification('Vui lòng chọn số sao đánh giá!', 'warning');
        return false;
    }
    
    if (images.length > 3) {
        showNotification('Chỉ được tải lên tối đa 3 ảnh!', 'warning');
        return false;
    }
    
    // Lấy thông tin người dùng
    const userProfile = JSON.parse(localStorage.getItem('userProfile')) || {};
    const userName = userProfile.name || 'Người dùng';
    
    // Tạo đánh giá mới
    const review = {
        id: Date.now(),
        user: userName,
        rating: rating,
        title: title,
        content: content,
        date: new Date().toLocaleDateString('vi-VN'),
        images: [],
        helpful: 0,
        comments: 0
    };
    
    // Xử lý ảnh
    if (images.length > 0) {
        const reader = new FileReader();
        reader.onload = function(e) {
            review.images.push(e.target.result);
            saveReview(review);
        };
        reader.readAsDataURL(images[0]);
    } else {
        saveReview(review);
    }
    
    return false;
}

// Lưu đánh giá
function saveReview(review) {
    // Lấy danh sách đánh giá hiện tại
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    
    // Thêm đánh giá mới
    reviews.unshift(review);
    
    // Lưu vào localStorage
    localStorage.setItem('reviews', JSON.stringify(reviews));
    
    // Hiển thị thông báo
    showNotification('Cảm ơn bạn đã đánh giá sản phẩm!');
    
    // Reset form
    document.getElementById('reviewForm').reset();
    
    // Cập nhật danh sách đánh giá
    updateReviewsList();
}

// Cập nhật danh sách đánh giá
function updateReviewsList() {
    const reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const reviewsList = document.querySelector('.reviews-list');
    
    if (reviewsList) {
        reviewsList.innerHTML = reviews.map(review => `
            <div class="card mb-4">
                <div class="card-body">
                    <div class="d-flex justify-content-between mb-3">
                        <div>
                            <h6 class="mb-1">${review.user}</h6>
                            <small class="text-muted">${review.date}</small>
                        </div>
                        <div class="rating">
                            ${Array(5).fill().map((_, i) => `
                                <i class="fas fa-star ${i < review.rating ? 'text-warning' : 'text-muted'}"></i>
                            `).join('')}
                        </div>
                    </div>
                    <h5>${review.title}</h5>
                    <p>${review.content}</p>
                    ${review.images.length > 0 ? `
                        <div class="review-images mt-3">
                            ${review.images.map(image => `
                                <img src="${image}" alt="Review Image" class="img-thumbnail me-2" style="width: 100px; height: 100px; object-fit: cover;">
                            `).join('')}
                        </div>
                    ` : ''}
                    <div class="mt-3">
                        <button class="btn btn-sm btn-outline-primary me-2" onclick="markHelpful(${review.id})">
                            <i class="fas fa-thumbs-up"></i> Hữu ích (${review.helpful})
                        </button>
                        <button class="btn btn-sm btn-outline-secondary" onclick="showComments(${review.id})">
                            <i class="fas fa-comment"></i> Bình luận (${review.comments})
                        </button>
                    </div>
                </div>
            </div>
        `).join('');
    }
}

// Đánh dấu đánh giá hữu ích
function markHelpful(reviewId) {
    let reviews = JSON.parse(localStorage.getItem('reviews')) || [];
    const review = reviews.find(r => r.id === reviewId);
    
    if (review) {
        review.helpful += 1;
        localStorage.setItem('reviews', JSON.stringify(reviews));
        updateReviewsList();
        showNotification('Cảm ơn bạn đã đánh giá hữu ích!');
    }
}

// Hiển thị bình luận
function showComments(reviewId) {
    // TODO: Implement comment functionality
    showNotification('Tính năng bình luận đang được phát triển!', 'info');
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

// Khởi tạo các sự kiện khi trang được tải
document.addEventListener('DOMContentLoaded', function() {
    // Khởi tạo rating input
    initializeRating();
    
    // Cập nhật danh sách đánh giá
    updateReviewsList();
}); 