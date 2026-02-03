// ===== GLOBAL VARIABLES =====
let products = [];
let cart = [];
let currentUser = null;
const STORAGE_KEY = 'sneakerhub_users';
const CART_KEY = 'sneakerhub_cart';
const USER_KEY = 'sneakerhub_current_user';

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    loadCart();
    checkUserLogin();
    setupEventListeners();
});

// ===== SETUP EVENT LISTENERS =====
function setupEventListeners() {
    // Login form
    const loginForm = document.getElementById('loginForm');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }

    // Signup form
    const signupForm = document.getElementById('signupForm');
    if (signupForm) {
        signupForm.addEventListener('submit', handleSignup);
    }
}

// ===== LOAD PRODUCTS =====
function loadProducts() {
    const productsData = [
        {"id": 1, "name": "Street Runner X1", "price": 120, "image": "image/arc_raiders.png"},
        {"id": 2, "name": "Urban Glide", "price": 95, "image": "image/avatar.png"},
        {"id": 3, "name": "Classic White Pro", "price": 85, "image": "image/bg3.png"},
        {"id": 4, "name": "Air Jordan Retro High", "price": 180, "image": "image/cs2.png"},
        {"id": 5, "name": "Jordan Mid Shadow", "price": 135, "image": "image/dbd.png"},
        {"id": 6, "name": "Jordan Low Panda", "price": 110, "image": "image/elden_ring.png"},
        {"id": 7, "name": "Yeezy Boost 350 V2 Beluga", "price": 240, "image": "image/fc26.png"},
        {"id": 8, "name": "Yeezy Boost 350 Cream", "price": 220, "image": "image/helldivers2.png"},
        {"id": 9, "name": "Puma RS-X Hyper", "price": 115, "image": "image/kcd2.png"},
        {"id": 10, "name": "Puma RS-X Core", "price": 110, "image": "image/marathon.png"},
        {"id": 11, "name": "Chuck 70 Ox White", "price": 75, "image": "image/nba2k26.png"},
        {"id": 12, "name": "Chuck 70 High Black", "price": 85, "image": "image/poe2.png"},
        {"id": 13, "name": "Chuck 70 High White", "price": 85, "image": "image/shop-photo.jpg"},
        {"id": 14, "name": "Vans Old Skool Black", "price": 65, "image": "image/baldurs_gate_3_logo.png"},
        {"id": 15, "name": "Vans Old Skool Burgundy", "price": 65, "image": "image/elden_ring_logo.png"},
        {"id": 16, "name": "Chuck 70 Parchment", "price": 80, "image": "image/helldivers_2_logo.png"},
        {"id": 17, "name": "Converse All Star Classic", "price": 60, "image": "image/path_of_exile_2_logo.png"},
        {"id": 18, "name": "Vans Skate Old Skool", "price": 75, "image": "image/silent_hill_2_logo.png"},
        {"id": 19, "name": "Neon Dash", "price": 145, "image": "image/starfield_logo.png"},
        {"id": 20, "name": "Gravity Lift", "price": 160, "image": "image/street_fighter_6_logo.png"}
    ];
    products = productsData;
    displayProducts(products);
}

// ===== DISPLAY PRODUCTS =====
function displayProducts(productsToDisplay) {
    const productsGrid = document.getElementById('productsGrid');
    if (!productsGrid) return;

    productsGrid.innerHTML = '';
    
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-price">$${product.price}</p>
                <div class="product-actions">
                    <button class="btn btn-add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
                    <button class="btn btn-buy-now" onclick="buyNow(${product.id})">Buy Now</button>
                </div>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// ===== FILTER PRODUCTS =====
function filterProducts() {
    const filterAll = document.getElementById('filterAll').checked;
    const filterUnder100 = document.getElementById('filterUnder100').checked;
    const filterUnder150 = document.getElementById('filterUnder150').checked;
    const filterOver150 = document.getElementById('filterOver150').checked;

    let filtered = products;

    if (!filterAll) {
        filtered = products.filter(p => {
            if (filterUnder100 && p.price < 100) return true;
            if (filterUnder150 && p.price >= 100 && p.price < 150) return true;
            if (filterOver150 && p.price >= 150) return true;
            return false;
        });
    }

    displayProducts(filtered);
}

// ===== ADD TO CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            quantity: 1
        });
    }

    saveCart();
    updateCartCount();
    alert(`${product.name} added to cart!`);
}

// ===== BUY NOW =====
function buyNow(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    // Clear cart and add only this product
    cart = [{
        ...product,
        quantity: 1
    }];

    saveCart();
    updateCartCount();
    
    // Show success message
    alert('Bought successfully!');
    
    // Redirect to products page after a short delay
    setTimeout(() => {
        switchPage('productsPage');
    }, 500);
}

// ===== CART FUNCTIONS =====
function loadCart() {
    const savedCart = localStorage.getItem(CART_KEY);
    if (savedCart) {
        cart = JSON.parse(savedCart);
    }
    updateCartCount();
    displayCart();
}

function saveCart() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(el => {
        el.textContent = count;
    });
}

function displayCart() {
    const cartContent = document.getElementById('cartContent');
    const emptyCart = document.getElementById('emptyCart');
    
    if (!cartContent) return;

    if (cart.length === 0) {
        cartContent.style.display = 'none';
        if (emptyCart) emptyCart.style.display = 'block';
        return;
    }

    cartContent.style.display = 'grid';
    if (emptyCart) emptyCart.style.display = 'none';

    let cartHTML = '<div class="cart-items">';
    
    cart.forEach(item => {
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">$${item.price}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">Remove</button>
                </div>
                <div style="text-align: right; font-weight: bold;">
                    $${(item.price * item.quantity).toFixed(2)}
                </div>
            </div>
        `;
    });

    cartHTML += '</div>';

    // Calculate totals
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const tax = subtotal * 0.1;
    const shipping = 5;
    const total = subtotal + tax + shipping;

    cartHTML += `
        <div class="cart-summary">
            <h2>Order Summary</h2>
            <div class="summary-row">
                <span>Subtotal:</span>
                <span>$${subtotal.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Tax (10%):</span>
                <span>$${tax.toFixed(2)}</span>
            </div>
            <div class="summary-row">
                <span>Shipping:</span>
                <span>$${shipping.toFixed(2)}</span>
            </div>
            <hr style="margin: 15px 0; border: none; border-top: 1px solid #ddd;">
            <div class="summary-row total">
                <span>Total:</span>
                <span>$${total.toFixed(2)}</span>
            </div>
            <button class="btn btn-primary btn-full" onclick="checkout()" style="margin-top: 20px;">Checkout</button>
        </div>
    `;

    cartContent.innerHTML = cartHTML;
}

function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(productId);
        } else {
            saveCart();
            updateCartCount();
            displayCart();
        }
    }
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
}

function checkout() {
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    alert('Bought successfully!');
    cart = [];
    saveCart();
    updateCartCount();
    displayCart();
    switchPage('productsPage');
}

// ===== AUTHENTICATION =====
function handleLogin(e) {
    e.preventDefault();
    
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        currentUser = user;
        switchPage('productsPage');
    } else {
        alert('Invalid email or password!');
    }
}

function handleSignup(e) {
    e.preventDefault();
    
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    const confirm = document.getElementById('signupConfirm').value;

    if (password !== confirm) {
        alert('Passwords do not match!');
        return;
    }

    const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    
    if (users.find(u => u.email === email)) {
        alert('Email already registered!');
        return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
    localStorage.setItem(USER_KEY, JSON.stringify(newUser));
    currentUser = newUser;

    // Clear form
    document.getElementById('signupForm').reset();
    
    switchPage('productsPage');
}

function checkUserLogin() {
    const user = localStorage.getItem(USER_KEY);
    if (user) {
        currentUser = JSON.parse(user);
        switchPage('productsPage');
    }
}

function logout() {
    localStorage.removeItem(USER_KEY);
    currentUser = null;
    cart = [];
    localStorage.removeItem(CART_KEY);
    updateCartCount();
    switchPage('loginPage');
}

// ===== PAGE NAVIGATION =====
function switchPage(pageId) {
    // Hide all pages
    const pages = document.querySelectorAll('.page');
    pages.forEach(page => {
        page.classList.remove('active');
    });

    // Show selected page
    const selectedPage = document.getElementById(pageId);
    if (selectedPage) {
        selectedPage.classList.add('active');
        
        // Reload cart display when switching to cart page
        if (pageId === 'cartPage') {
            displayCart();
        }
        
        // Reload products when switching to products page
        if (pageId === 'productsPage') {
            displayProducts(products);
        }
    }
}

// ===== HANDLE PAGE NAVIGATION FOR SEPARATE FILES =====
// For when using separate HTML files instead of single page
if (document.body.innerHTML.includes('loginForm') && !document.getElementById('productsPage')) {
    // We're on login.html
    document.getElementById('loginForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            localStorage.setItem(USER_KEY, JSON.stringify(user));
            window.location.href = 'products.html';
        } else {
            alert('Invalid email or password!');
        }
    });
}

if (document.body.innerHTML.includes('signupForm') && !document.getElementById('productsPage')) {
    // We're on signup.html
    document.getElementById('signupForm').addEventListener('submit', function(e) {
        e.preventDefault();
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirm = document.getElementById('signupConfirm').value;
        
        if (password !== confirm) {
            alert('Passwords do not match!');
            return;
        }
        
        const users = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
        if (users.find(u => u.email === email)) {
            alert('Email already registered!');
            return;
        }
        
        const newUser = { name, email, password };
        users.push(newUser);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem(USER_KEY, JSON.stringify(newUser));
        window.location.href = 'products.html';
    });
}

if (document.getElementById('productsGrid')) {
    // We're on products.html
    loadProducts();
    loadCart();
    
    // Update cart count on page load
    updateCartCount();
    
    // Check if user is logged in
    const user = localStorage.getItem(USER_KEY);
    if (!user) {
        window.location.href = 'index.html';
    }
}

if (document.getElementById('cartContent')) {
    // We're on cart.html
    loadCart();
    
    // Check if user is logged in
    const user = localStorage.getItem(USER_KEY);
    if (!user) {
        window.location.href = 'index.html';
    }
}
