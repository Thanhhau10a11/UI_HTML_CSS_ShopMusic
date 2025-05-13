// Handle contact form submission
function handleContactSubmit(event) {
    event.preventDefault();

    // Get form data
    const formData = {
        name: document.getElementById('name').value,
        email: document.getElementById('email').value,
        subject: document.getElementById('subject').value,
        message: document.getElementById('message').value
    };

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
        alert('Vui lòng nhập email hợp lệ');
        return false;
    }

    // In a real application, you would send this data to a server
    console.log('Contact form data:', formData);

    // Show success message
    alert('Cảm ơn bạn đã liên hệ! Chúng tôi sẽ phản hồi sớm nhất có thể.');

    // Clear form
    document.getElementById('contact-form').reset();

    return false;
}

// Add input validation
document.querySelectorAll('#contact-form input, #contact-form textarea').forEach(input => {
    input.addEventListener('invalid', function(event) {
        if (event.target.validity.valueMissing) {
            event.target.setCustomValidity('Vui lòng điền thông tin này');
        }
    });

    input.addEventListener('input', function(event) {
        event.target.setCustomValidity('');
    });
});

// Character counter for message
const messageTextarea = document.getElementById('message');
if (messageTextarea) {
    messageTextarea.addEventListener('input', function() {
        const maxLength = 1000;
        const remaining = maxLength - this.value.length;
        
        let counter = this.parentElement.querySelector('.character-counter');
        if (!counter) {
            counter = document.createElement('small');
            counter.className = 'character-counter text-muted';
            this.parentElement.appendChild(counter);
        }
        
        counter.textContent = `${remaining} ký tự còn lại`;
        
        if (remaining < 50) {
            counter.classList.add('text-danger');
        } else {
            counter.classList.remove('text-danger');
        }
    });
}

// Social media share buttons
document.querySelectorAll('.social-media a').forEach(link => {
    link.addEventListener('click', function(event) {
        event.preventDefault();
        const social = this.querySelector('i').className;
        let url = '';

        switch(true) {
            case social.includes('facebook'):
                url = `https://www.facebook.com/sharer/sharer.php?u=${window.location.href}`;
                break;
            case social.includes('twitter'):
                url = `https://twitter.com/intent/tweet?url=${window.location.href}`;
                break;
            case social.includes('instagram'):
                url = 'https://www.instagram.com/musicstore';
                break;
            case social.includes('youtube'):
                url = 'https://www.youtube.com/musicstore';
                break;
        }

        if (url) {
            window.open(url, '_blank', 'width=600,height=400');
        }
    });
}); 