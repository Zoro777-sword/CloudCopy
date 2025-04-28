// script.js
document.addEventListener('DOMContentLoaded', () => {
    const loginButton = document.getElementById('loginButton');
    const popup = document.getElementById('loginPopup');
    let hasShownInitialPopup = false;

    // Show login popup after 7 seconds if it hasn't been shown yet
    setTimeout(() => {
        if (!hasShownInitialPopup) {
            showLoginPopup();
            hasShownInitialPopup = true;
        }
    }, 7000);

    // Button click handler with 1-second animation
    loginButton.addEventListener('click', () => {
        showLoginPopup();
        hasShownInitialPopup = true;
    });
});

function showLoginPopup() {
    const popup = document.getElementById('loginPopup');
    popup.style.display = 'flex';
    // Allow DOM to update before adding active class for animation
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
}

function closeLoginPopup() {
    const popup = document.getElementById('loginPopup');
    popup.classList.remove('active');
    // Wait for fade out animation before hiding
    setTimeout(() => {
        popup.style.display = 'none';
    }, 300);
}

function handleLogin(event) {
    event.preventDefault();
    
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    // Here you would typically send these credentials to your server
    console.log('Login attempt:', { username, password });
    
    // For demo purposes, show success message and close popup
    alert('Login successful!');
    closeLoginPopup();
}

// Close popup when clicking outside the login container
document.getElementById('loginPopup').addEventListener('click', (event) => {
    if (event.target.id === 'loginPopup') {
        closeLoginPopup();
    }
});