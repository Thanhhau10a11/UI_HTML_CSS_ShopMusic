// Handle login form submission
function handleLogin(event) {
    event.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const rememberMe = document.getElementById('rememberMe').checked;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Vui lòng nhập email hợp lệ');
        return false;
    }

    // Validate password
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return false;
    }

    // In a real application, you would send this data to a server
    console.log('Login data:', { email, password, rememberMe });

    // Simulate successful login
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userEmail', email);

    // Show success message and redirect
    alert('Đăng nhập thành công!');
    window.location.href = 'index.html';

    return false;
}

// Handle register form submission
function handleRegister(event) {
    event.preventDefault();

    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('registerEmail').value;
    const password = document.getElementById('registerPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    const agreeTerms = document.getElementById('agreeTerms').checked;

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Vui lòng nhập email hợp lệ');
        return false;
    }

    // Validate password
    if (password.length < 6) {
        alert('Mật khẩu phải có ít nhất 6 ký tự');
        return false;
    }

    // Validate password confirmation
    if (password !== confirmPassword) {
        alert('Xác nhận mật khẩu không khớp');
        return false;
    }

    // Validate terms agreement
    if (!agreeTerms) {
        alert('Vui lòng đồng ý với điều khoản sử dụng');
        return false;
    }

    // In a real application, you would send this data to a server
    console.log('Register data:', { firstName, lastName, email, password });

    // Show success message and switch to login tab
    alert('Đăng ký thành công! Vui lòng đăng nhập.');
    document.getElementById('login-tab').click();

    return false;
}

// Toggle password visibility
function togglePassword(inputId) {
    const input = document.getElementById(inputId);
    const icon = input.nextElementSibling.querySelector('i');

    if (input.type === 'password') {
        input.type = 'text';
        icon.classList.remove('fa-eye');
        icon.classList.add('fa-eye-slash');
    } else {
        input.type = 'password';
        icon.classList.remove('fa-eye-slash');
        icon.classList.add('fa-eye');
    }
}

// Handle social login
function socialLogin(provider) {
    // In a real application, you would implement OAuth login
    console.log(`Logging in with ${provider}`);
    alert(`Tính năng đăng nhập bằng ${provider} đang được phát triển`);
}

// Check login status
document.addEventListener('DOMContentLoaded', function() {
    const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
    const userEmail = localStorage.getItem('userEmail');

    if (isLoggedIn && userEmail) {
        // Update UI for logged in user
        const loginButton = document.querySelector('a[href="login.html"]');
        if (loginButton) {
            loginButton.innerHTML = `
                <div class="dropdown">
                    <button class="btn btn-primary dropdown-toggle" type="button" data-bs-toggle="dropdown">
                        ${userEmail}
                    </button>
                    <ul class="dropdown-menu">
                        <li><a class="dropdown-item" href="profile.html">Tài khoản</a></li>
                        <li><a class="dropdown-item" href="orders.html">Đơn hàng</a></li>
                        <li><hr class="dropdown-divider"></li>
                        <li><a class="dropdown-item" href="#" onclick="logout()">Đăng xuất</a></li>
                    </ul>
                </div>
            `;
        }
    }
});

// Logout function
function logout() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userEmail');
    window.location.href = 'index.html';
}

// Password strength indicator
document.getElementById('registerPassword')?.addEventListener('input', function() {
    const password = this.value;
    let strength = 0;

    // Length check
    if (password.length >= 8) strength++;

    // Contains number
    if (/\d/.test(password)) strength++;

    // Contains letter
    if (/[a-zA-Z]/.test(password)) strength++;

    // Contains special character
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    const strengthBar = this.parentElement.querySelector('.strength-bar');
    if (!strengthBar) {
        const bar = document.createElement('div');
        bar.className = 'strength-bar progress mt-2';
        bar.innerHTML = '<div class="progress-bar" role="progressbar"></div>';
        this.parentElement.appendChild(bar);
    }

    const progressBar = this.parentElement.querySelector('.progress-bar');
    progressBar.style.width = `${strength * 25}%`;
    
    switch(strength) {
        case 0:
        case 1:
            progressBar.className = 'progress-bar bg-danger';
            progressBar.textContent = 'Yếu';
            break;
        case 2:
            progressBar.className = 'progress-bar bg-warning';
            progressBar.textContent = 'Trung bình';
            break;
        case 3:
            progressBar.className = 'progress-bar bg-info';
            progressBar.textContent = 'Khá';
            break;
        case 4:
            progressBar.className = 'progress-bar bg-success';
            progressBar.textContent = 'Mạnh';
            break;
    }
}); 