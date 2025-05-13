// Order History functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize date pickers
    const today = new Date();
    const lastMonth = new Date();
    lastMonth.setMonth(lastMonth.getMonth() - 1);

    document.querySelector('input[type="date"]').value = lastMonth.toISOString().split('T')[0];
    document.querySelectorAll('input[type="date"]')[1].value = today.toISOString().split('T')[0];

    // Add event listeners for filters
    const statusFilter = document.querySelector('select');
    const dateFilters = document.querySelectorAll('input[type="date"]');

    statusFilter.addEventListener('change', filterOrders);
    dateFilters.forEach(filter => {
        filter.addEventListener('change', filterOrders);
    });
});

// Filter orders based on selected criteria
function filterOrders() {
    const status = document.querySelector('select').value;
    const startDate = new Date(document.querySelectorAll('input[type="date"]')[0].value);
    const endDate = new Date(document.querySelectorAll('input[type="date"]')[1].value);

    const orders = document.querySelectorAll('.order-list .card');
    orders.forEach(order => {
        const orderStatus = order.querySelector('.badge').textContent.trim();
        const orderDate = new Date(order.querySelector('small').textContent.split(': ')[1]);

        let showOrder = true;

        // Filter by status
        if (status && !orderStatus.toLowerCase().includes(status.toLowerCase())) {
            showOrder = false;
        }

        // Filter by date range
        if (orderDate < startDate || orderDate > endDate) {
            showOrder = false;
        }

        order.style.display = showOrder ? 'block' : 'none';
    });
}

// View order details
function viewOrderDetail(orderId) {
    // In a real application, this would fetch order details from a server
    const orderDetails = {
        '12345': {
            items: [
                {
                    name: 'Guitar Acoustic Yamaha F310',
                    price: 3500000,
                    quantity: 1,
                    image: 'images/guitar1.jpg'
                }
            ],
            status: 'Đã hoàn thành',
            date: '15/03/2024',
            total: 3500000,
            shippingAddress: '123 Đường ABC, Quận XYZ, TP.HCM',
            paymentMethod: 'Chuyển khoản ngân hàng'
        },
        '12344': {
            items: [
                {
                    name: 'Piano Điện Yamaha P-45',
                    price: 15000000,
                    quantity: 1,
                    image: 'images/piano1.jpg'
                }
            ],
            status: 'Đang giao hàng',
            date: '10/03/2024',
            total: 15000000,
            shippingAddress: '456 Đường XYZ, Quận ABC, TP.HCM',
            paymentMethod: 'Thanh toán khi nhận hàng'
        }
    };

    const order = orderDetails[orderId];
    if (!order) return;

    // Create modal content
    const modalContent = `
        <div class="modal fade" id="orderDetailModal" tabindex="-1">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title">Chi tiết đơn hàng #${orderId}</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="row mb-4">
                            <div class="col-md-6">
                                <h6>Thông tin đơn hàng</h6>
                                <p class="mb-1">Ngày đặt: ${order.date}</p>
                                <p class="mb-1">Trạng thái: <span class="badge bg-success">${order.status}</span></p>
                                <p class="mb-1">Phương thức thanh toán: ${order.paymentMethod}</p>
                            </div>
                            <div class="col-md-6">
                                <h6>Địa chỉ giao hàng</h6>
                                <p>${order.shippingAddress}</p>
                            </div>
                        </div>

                        <h6>Sản phẩm</h6>
                        <div class="table-responsive">
                            <table class="table">
                                <thead>
                                    <tr>
                                        <th>Sản phẩm</th>
                                        <th>Giá</th>
                                        <th>Số lượng</th>
                                        <th>Tổng</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${order.items.map(item => `
                                        <tr>
                                            <td>
                                                <div class="d-flex align-items-center">
                                                    <img src="${item.image}" alt="${item.name}" style="width: 50px; height: 50px; object-fit: cover; margin-right: 10px;">
                                                    <span>${item.name}</span>
                                                </div>
                                            </td>
                                            <td>${formatPrice(item.price)}</td>
                                            <td>${item.quantity}</td>
                                            <td>${formatPrice(item.price * item.quantity)}</td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                                <tfoot>
                                    <tr>
                                        <td colspan="3" class="text-end"><strong>Tổng cộng:</strong></td>
                                        <td><strong>${formatPrice(order.total)}</strong></td>
                                    </tr>
                                </tfoot>
                            </table>
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Đóng</button>
                        <button type="button" class="btn btn-primary" onclick="reorder('${orderId}')">
                            <i class="fas fa-redo"></i> Mua lại
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Add modal to body and show it
    document.body.insertAdjacentHTML('beforeend', modalContent);
    const modal = new bootstrap.Modal(document.getElementById('orderDetailModal'));
    modal.show();

    // Remove modal from DOM when hidden
    document.getElementById('orderDetailModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Reorder function
function reorder(orderId) {
    // In a real application, this would add items to cart
    alert('Sản phẩm đã được thêm vào giỏ hàng');
    window.location.href = 'cart.html';
}

// Format price
function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
} 