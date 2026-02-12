// --- Product Data Management ---

// Initial "Hardcoded" Data
const initialProducts = [
    {
        id: 1,
        name: "Urban Jungle",
        desc: "Cotton Silk Blend",
        price: 3500,
        image: "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "NEW"
    },
    {
        id: 2,
        name: "Neon Nights",
        desc: "Premium Rayon",
        price: 2950,
        image: "https://images.unsplash.com/photo-1576566588028-4147f3842f27?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: ""
    },
    {
        id: 3,
        name: "Blue Horizon",
        desc: "Linen Blend",
        price: 3800,
        image: "https://images.unsplash.com/photo-1598033129183-c4f50c736f10?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: ""
    },
    {
        id: 4,
        name: "Dark Matter",
        desc: "Pure Cotton",
        price: 3900,
        image: "https://images.unsplash.com/photo-1618354691373-d851c5c3a990?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "SALE"
    },
    {
        id: 5,
        name: "Tropical Vibe",
        desc: "Loose Fit",
        price: 3200,
        image: "https://images.unsplash.com/photo-1542272617-08f086302291?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: ""
    },
    {
        id: 6,
        name: "Retro Wave",
        desc: "Slim Fit",
        price: 4100,
        image: "https://images.unsplash.com/photo-1588359348347-9bc6c5ea37fb?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: ""
    },
    {
        id: 7,
        name: "Classic Paisley",
        desc: "Standard Fit",
        price: 3600,
        image: "https://images.unsplash.com/photo-1552374196-1ab2a1c593e8?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: ""
    },
    {
        id: 8,
        name: "Geometric Noir",
        desc: "Modern Cut",
        price: 4500,
        image: "https://images.unsplash.com/photo-1487222477894-8943e31ef7b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80",
        badge: "HOT"
    }
];

// --- Helpers ---

function getProducts() {
    const stored = localStorage.getItem('kanna_products');
    if (!stored) {
        localStorage.setItem('kanna_products', JSON.stringify(initialProducts));
        return initialProducts;
    }
    return JSON.parse(stored);
}

function getProductById(id) {
    const products = getProducts();
    // Use loose equality to handle string/number mismatches
    return products.find(p => p.id == id);
}

function saveProduct(product) {
    const products = getProducts();
    if (!product.id) product.id = Date.now();
    products.unshift(product);
    localStorage.setItem('kanna_products', JSON.stringify(products));
}

function deleteProduct(id) {
    let products = getProducts();
    products = products.filter(p => p.id != id);
    localStorage.setItem('kanna_products', JSON.stringify(products));
}

// --- Auth Management ---

function getUsers() {
    const stored = localStorage.getItem('kanna_users');
    return stored ? JSON.parse(stored) : [];
}

function saveUser(user) {
    const users = getUsers();
    users.push(user);
    localStorage.setItem('kanna_users', JSON.stringify(users));
}

function getCurrentUser() {
    const stored = localStorage.getItem('kanna_current_user');
    return stored ? JSON.parse(stored) : null;
}

function setCurrentUser(user) {
    localStorage.setItem('kanna_current_user', JSON.stringify(user));
}

function logout() {
    if (confirm("Are you sure you want to log out?")) {
        localStorage.removeItem('kanna_current_user');
        window.location.href = 'index.html';
    }
}

// OTP Globals
let pendingUser = null;
let generatedOtp = null;

function handleRegister(e) {
    e.preventDefault();
    const name = document.getElementById('reg-name').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;
    const confirm = document.getElementById('reg-confirm').value;

    if (password !== confirm) {
        alert("Passwords do not match!");
        return;
    }

    const users = getUsers();
    if (users.find(u => u.email === email)) {
        alert("Email already registered!");
        return;
    }

    // Step 1: Prepare data
    pendingUser = { id: Date.now(), name, email, password };

    // Step 2: Generate OTP
    generatedOtp = Math.floor(100000 + Math.random() * 900000);

    // Step 3: Simulate Email Sending
    console.log(`[EMAIL SIMULATION] To: ${email}, Code: ${generatedOtp}`);
    alert(`(Simulation) Verification code sent to ${email}: ${generatedOtp}`);

    // Step 4: Show Modal
    const modal = document.getElementById('otp-modal');
    if (modal) {
        modal.classList.remove('hidden');
        document.getElementById('otp-input').focus();

        // Show code on screen for demo
        const testDisplay = document.getElementById('otp-display-test');
        if (testDisplay) {
            testDisplay.textContent = `Demo Code: ${generatedOtp}`;
            testDisplay.classList.remove('hidden');
        }
    } else {
        // Fallback
        const code = prompt(`Enter verification code sent to ${email}:`);
        checkOtp(code);
    }
}

function verifyOtp() {
    const input = document.getElementById('otp-input').value;
    checkOtp(input);
}

function checkOtp(code) {
    if (code == generatedOtp) {
        // Success
        saveUser(pendingUser);
        setCurrentUser(pendingUser);

        closeOtpModal();
        alert("Email verified! Registration successful.");

        // Redirect logic
        if (localStorage.getItem('kanna_return_to_checkout')) {
            localStorage.removeItem('kanna_return_to_checkout');
            window.location.href = 'index.html?action=cart';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert("Invalid verification code. Please try again.");
    }
}

function closeOtpModal() {
    const modal = document.getElementById('otp-modal');
    if (modal) modal.classList.add('hidden');
    pendingUser = null;
    generatedOtp = null;
    // Clear input
    const input = document.getElementById('otp-input');
    if (input) input.value = '';
}


function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    const users = getUsers();
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
        setCurrentUser(user);
        alert(`Welcome back, ${user.name}!`);

        // Check if we need to return to cart
        if (localStorage.getItem('kanna_return_to_checkout')) {
            localStorage.removeItem('kanna_return_to_checkout');
            window.location.href = 'index.html?action=cart';
        } else {
            window.location.href = 'index.html';
        }
    } else {
        alert("Invalid email or password.");
    }
}


// --- Cart Management ---

function getCart() {
    const stored = localStorage.getItem('kanna_cart');
    return stored ? JSON.parse(stored) : [];
}

function saveCart(cart) {
    localStorage.setItem('kanna_cart', JSON.stringify(cart));
    updateCartIcon();
    renderCartSidebar();
}

function addToCart(id, size = 'M', name = null, price = null, image = null) {
    const cart = getCart();
    let product;

    // Look up by ID if possible
    const existingProduct = getProductById(id);
    if (existingProduct) {
        product = { ...existingProduct }; // Clone it
    } else {
        // Fallback for custom/static items
        product = { id, name, price, image };
    }

    if (!product || !product.price) return;

    // Apply Size Pricing Logic
    const basePrice = parseFloat(product.price);
    const markups = { 'S': 0, 'M': 500, 'L': 1000, 'XL': 1500, 'XXL': 2000 };
    const markup = markups[size] || 0;
    product.price = basePrice + markup;

    // Add size info
    product.selectedSize = size;
    product.cartId = Date.now() + Math.random();

    cart.push(product);
    saveCart(cart);

    toggleCart(true);
    showToast(`${product.name} (Size: ${size}) added!`);
}

function addToCartWithSize(id) {
    const sizeSelector = document.getElementById(`size-${id}`);
    const size = sizeSelector ? sizeSelector.value : 'M';
    addToCart(id, size);
}

function removeFromCart(index) {
    const cart = getCart();
    cart.splice(index, 1);
    saveCart(cart);
}

// Updated Checkout: Redirects to Checkout Page for Address Input
function checkout() {
    const user = getCurrentUser();

    if (!user) {
        if (confirm("You must be logged in to checkout. Go to login page?")) {
            localStorage.setItem('kanna_return_to_checkout', 'true');
            window.location.href = 'login.html';
        }
        return;
    }

    const cart = getCart();
    if (cart.length === 0) {
        alert('Your cart is empty!');
        return;
    }

    // Redirect to Checkout page
    window.location.href = 'checkout.html';
}

// Order Management Helpers
function getOrders() {
    const stored = localStorage.getItem('kanna_orders');
    return stored ? JSON.parse(stored) : [];
}

function saveOrder(order) {
    const orders = getOrders();
    orders.unshift(order);
    localStorage.setItem('kanna_orders', JSON.stringify(orders));
}

function updateOrder(updatedOrder) {
    const orders = getOrders();
    const index = orders.findIndex(o => o.id === updatedOrder.id);
    if (index !== -1) {
        orders[index] = updatedOrder;
        localStorage.setItem('kanna_orders', JSON.stringify(orders));
    }
}

// --- UI Rendering ---


function updateCardPrice(id, basePrice) {
    const select = document.getElementById(`size-${id}`);
    const display = document.getElementById(`price-display-${id}`);
    if (!select || !display) return;

    const size = select.value;
    // Pricing Logic: S=Base, M=+500, L=+1000, XL=+1500, XXL=+2000
    const markups = { 'S': 0, 'M': 500, 'L': 1000, 'XL': 1500, 'XXL': 2000 };
    const markup = markups[size] || 0;

    const finalPrice = parseFloat(basePrice) + markup;
    display.textContent = `Rs. ${finalPrice.toLocaleString()}`;
}

function renderShopPage(filter = 'all') {
    const grid = document.getElementById('product-grid');
    if (!grid) return;

    let products = getProducts();

    // Filtering Logic
    if (filter === 'NEW') {
        products = products.filter(p => p.badge === 'NEW');
    } else if (filter === 'HOT') {
        products = products.filter(p => p.badge === 'HOT');
    } else if (filter !== 'all') {
        products = products.filter(p =>
            p.desc.toLowerCase().includes(filter.toLowerCase()) ||
            (p.category && p.category.toLowerCase() === filter.toLowerCase())
        );
    }

    grid.innerHTML = '';

    if (products.length === 0) {
        grid.innerHTML = '<div class="col-span-full py-20 text-center text-gray-500">No products found in this category.</div>';
        return;
    }

    const markups = { 'S': 0, 'M': 500, 'L': 1000, 'XL': 1500, 'XXL': 2000 };

    products.forEach(p => {
        const card = document.createElement('div');
        card.className = 'group animate-fade-in';

        let badgeHtml = '';
        if (p.badge) {
            let color = 'bg-brand-accent text-brand-dark';
            if (p.badge === 'SALE') color = 'bg-red-500 text-white';
            if (p.badge === 'HOT') color = 'bg-orange-500 text-white';
            badgeHtml = `<div class="absolute top-2 right-2 ${color} text-xs font-bold px-2 py-1 rounded shadow-lg z-10">${p.badge}</div>`;
        }

        const basePrice = parseFloat(p.price);
        const sizes = p.sizes || ['S', 'M', 'L', 'XL', 'XXL'];
        const initialSize = sizes.includes('M') ? 'M' : sizes[0];
        const initialPrice = basePrice + (markups[initialSize] || 0);

        let sizesHtml = '';
        sizes.forEach(s => {
            sizesHtml += `<option value="${s}" ${s === initialSize ? 'selected' : ''}>Size: ${s}</option>`;
        });

        card.innerHTML = `
            <div class="relative w-full h-80 bg-brand-gray rounded-lg overflow-hidden mb-4 shadow-lg">
                <img src="${p.image}" alt="${p.name}" loading="lazy" 
                     class="w-full h-full object-cover object-center group-hover:scale-110 transition-transform duration-700">
                ${badgeHtml}
                
                <div class="absolute top-3 left-3 z-10">
                    <select id="size-${p.id}" onchange="updateCardPrice('${p.id}', ${basePrice})" 
                            class="bg-black/70 text-white text-xs border border-white/20 rounded px-2 py-1 focus:outline-none focus:border-brand-accent backdrop-blur-sm cursor-pointer hover:bg-black/90 transition-colors">
                        ${sizesHtml}
                    </select>
                </div>

                <div class="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300 bg-gradient-to-t from-black/80 to-transparent">
                    <button onclick="addToCartWithSize('${p.id}')" 
                            class="w-full bg-white text-black font-bold py-2 rounded-full shadow-lg hover:bg-brand-accent transition-colors transform hover:-translate-y-1">
                        Add to Cart
                    </button>
                </div>
            </div>
            <div class="flex justify-between items-start px-1">
                <div>
                    <h3 class="text-lg font-bold text-white group-hover:text-brand-accent transition-colors truncate w-40">${p.name}</h3>
                    <p class="text-xs text-gray-500 uppercase tracking-wide">${p.desc}</p>
                </div>
                <span id="price-display-${p.id}" class="text-brand-accent font-serif text-lg font-bold">Rs. ${initialPrice.toLocaleString()}</span>
            </div>
        `;
        grid.appendChild(card);
    });
}

function filterShop(category, btn) {
    const buttons = btn.parentElement.querySelectorAll('button');
    buttons.forEach(b => {
        b.classList.remove('bg-white', 'text-black', 'font-bold');
        b.classList.add('bg-brand-gray', 'text-gray-300', 'font-medium');
    });

    btn.classList.remove('bg-brand-gray', 'text-gray-300', 'font-medium');
    btn.classList.add('bg-white', 'text-black', 'font-bold');

    renderShopPage(category);
}

function toggleCart(forceOpen = null) {
    const sidebar = document.getElementById('cart-sidebar');
    const overlay = document.getElementById('cart-overlay');
    if (!sidebar || !overlay) return;

    const isOpen = !sidebar.classList.contains('translate-x-full');
    const shouldOpen = forceOpen !== null ? forceOpen : !isOpen;

    if (shouldOpen) {
        sidebar.classList.remove('translate-x-full');
        overlay.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
        renderCartSidebar();
    } else {
        sidebar.classList.add('translate-x-full');
        overlay.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

function renderCartSidebar() {
    const cartContainer = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    if (!cartContainer || !totalEl) return;

    const cart = getCart();
    cartContainer.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        cartContainer.innerHTML = '<p class="text-gray-500 text-center py-10">Your cart is empty.</p>';
        totalEl.textContent = 'Rs. 0';
        return;
    }

    cart.forEach((item, index) => {
        total += parseFloat(item.price);
        const div = document.createElement('div');
        div.className = 'flex items-center gap-4 bg-white/5 p-3 rounded-lg mb-3 border border-white/5';
        div.innerHTML = `
            <img src="${item.image}" class="w-16 h-16 object-cover rounded bg-gray-800" alt="item">
            <div class="flex-1">
                <h4 class="text-white font-bold text-sm line-clamp-1">${item.name}</h4>
                <p class="text-xs text-gray-400">Size: <span class="text-white font-bold">${item.selectedSize || 'M'}</span></p>
                <p class="text-brand-accent text-sm">Rs. ${parseFloat(item.price).toLocaleString()}</p>
            </div>
            <button onclick="removeFromCart(${index})" class="text-gray-500 hover:text-red-500 p-2">
                <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
            </button>
        `;
        cartContainer.appendChild(div);
    });

    totalEl.textContent = 'Rs. ' + total.toLocaleString();
}

function updateCartIcon() {
    const cart = getCart();
    const count = cart.length;
    const cartBadges = document.querySelectorAll('.cart-count-badge');

    cartBadges.forEach(badge => {
        badge.textContent = count;
        if (count > 0) {
            badge.classList.remove('scale-0');
            badge.classList.add('scale-100');
            badge.classList.remove('bg-brand-accent');
            void badge.offsetWidth;
            badge.classList.add('bg-brand-accent');
        } else {
            badge.classList.add('scale-0');
            badge.classList.remove('scale-100');
        }
    });
}


// --- Common Interactions ---

function toggleMobileMenu() {
    const menu = document.getElementById('mobile-menu');
    menu.classList.toggle('hidden');
}

window.addEventListener('scroll', function () {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    if (window.scrollY > 50) {
        navbar.classList.add('shadow-lg');
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    } else {
        navbar.classList.remove('shadow-lg');
        if (!navbar.classList.contains('glass')) {
            navbar.style.background = 'transparent';
        }
    }
});

function showToast(message) {
    let container = document.getElementById('toast-container');
    if (!container) {
        container = document.createElement('div');
        container.id = 'toast-container';
        container.className = 'fixed bottom-5 right-5 z-[60] flex flex-col gap-2';
        document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'bg-white text-black px-6 py-3 rounded-lg shadow-2xl transform transition-all duration-300 translate-y-10 opacity-0 flex items-center font-bold border-l-4 border-brand-accent';
    toast.innerHTML = `
        <svg class="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path></svg>
        ${message}
    `;

    container.appendChild(toast);

    setTimeout(() => {
        toast.classList.remove('translate-y-10', 'opacity-0');
    }, 10);

    setTimeout(() => {
        toast.classList.add('translate-y-10', 'opacity-0');
        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 3000);
}

// --- Language Translation Logic ---

const translations = {
    si: {
        "Home": "මුල් පිටුව",
        "Collection": "ඇඳුම් එකතුව",
        "Our Story": "අපේ කතාව",
        "Contact": "සම්බන්ධ වන්න",
        "Shop Collection": "ඇඳුම් මිලදී ගන්න",
        "EMBRACE": "වැළඳගන්න",
        "ELEGANCE.": "අභිමානය.",
        "New Summer Collection '26": "නව ගිම්හාන එකතුව '26",
        "Discover the intersection of contemporary island vibe and premium craftsmanship. Printed for the bold, tailored for you.": "නවීන දූපත් විලාසිතා සහ උසස් නිමවුම් වල එකතුව සොයා ගන්න. නිර්භීත ඔබ වෙනුවෙන්ම නිමවා ඇත.",
        "OUR STORY": "අපේ කතාව",
        "Trending Collection": "නවතම විලාසිතා",
        "Handpicked for you": "ඔබ වෙනුවෙන්ම තෝරාගත්",
        "Quick Add": "කූඩයට එක් කරන්න",
        "Why Kanna?": "ඇයි Kanna?",
        "Premium Cotton & Silk Blends": "උසස් කපු සහ සිල්ක් මිශ්‍රණ",
        "Exclusive Limited Edition Prints": "සීමිත සුවිශේෂී මුද්‍රණ",
        "Island-wide Fast Delivery": "දිවයින පුරා වේගවත් බෙදාහැරීම",
        "24/7 Customer Support": "24/7 පාරිභෝගික සහාය",
        "Join the Kanna Club": "Kanna ක්ලබ් එකට එකතු වන්න",
        "Subscribe to get exclusive offers and be the first to know about new drops.": "සුවිශේෂී දීමනා සහ අලුත් විලාසිතා ගැන දැනගැනීමට අප හා එක්වන්න.",
        "Subscribe": "එකතු වන්න",
        "Your email address": "ඔබේ ඊමේල් ලිපිනය",
        "All Shirts": "සියලුම ඇඳුම්",
        "New Arrivals": "අලුත් විලාසිතා",
        "Best Sellers": "වැඩිපුරම අලෙවි වූ",
        "Support": "සහාය",
        "Size Guide": "ප්‍රමාණ මගපෙන්වීම",
        "Shipping & Returns": "බෙදාහැරීම් සහ ආපසු ලබාගැනීම්",
        "Follow Us": "අපව අනුගමනය කරන්න",
        "Your Cart": "ඔබේ කූඩය",
        "Total": "එකතුව",
        "Checkout Now": "මිලදී ගන්න",
        "Search shirts...": "සොයන්න...",
        "Login": "ඇතුල් වන්න",
        "Sign Up": "ලියාපදිංචි වන්න",
        "My Profile": "මගේ ගිණුම",
        "Sign out": "ඉවත් වන්න",
        "Shirt Size Guide": "ෂර්ට් ප්‍රමාණයන් පිළිබඳ මගපෙන්වීම",
        "How to find your perfect fit?": "ඔබේ නිවැරදි ප්‍රමාණය සොයාගන්නේ කෙසේද?",
        "Chest": "පපුව",
        "Shoulder": "උරහිස",
        "Length": "දිග",
        "Crafting Confidence": "විශ්වාසය ගොඩනැගීම",
        "The journey of Kanna began with a simple idea: To create printed shirts that are as unique as the people who wear them.": "Kanna හි ගමන ආරම්භ වූයේ සරල අදහසකිනි: ඒවා අඳින පුද්ගලයින් මෙන් සුවිශේෂී වූ මුද්‍රිත ෂර්ට් නිර්මාණය කිරීම.",
        "The Kanna Standard": "Kanna ප්‍රමිතිය",
        "In a world of fast fashion, we choose detail. Every Kanna shirt is a result of meticulous craftsmanship, from sourcing the finest breathable fabrics to curating prints that stand out from the crowd.": "වේගවත් විලාසිතා ලෝකයක, අපි සියුම් විස්තර තෝරා ගනිමු. සෑම Kanna ෂර්ට් එකක්ම ඉතා ඉහළ නිමවුමක ප්‍රතිඵලයකි.",
        "We believe that a shirt is more than just clothing—it's an expression of personality. Whether you're bold and adventurous or subtle and sophisticated, there's a Kanna print designed just for you.": "ෂර්ට් එකක් යනු හුදෙක් ඇඳුමකට වඩා වැඩි යමක් බව අපි විශ්වාස කරමු - එය පෞරුෂයේ ප්‍රකාශනයකි.",
        "Years of Excellence": "විශිෂ්ටත්වයේ වසර",
        "Happy Customers": "සතුටුදායක පාරිභෝගිකයන්",
        "Get in Touch": "අප හා සම්බන්ධ වන්න",
        "Have questions? We're here to help.": "ප්‍රශ්න තිබේද? ඔබට උදව් කිරීමට අපි මෙහි සිටිමු.",
        "Visit Us": "අප වෙත පැමිණෙන්න",
        "Email Us": "ඊමේල් කරන්න",
        "Call Us": "අමතන්න",
        "Mon - Fri, 9am - 6pm": "සඳුදා - සිකුරාදා, පෙ.ව 9 - ප.ව 6",
        "Send Message": "පණිවිඩය යවන්න",
        "How can we help you?": "අපට ඔබට උදව් කළ හැකි කෙසේද?",
        "Full Name": "සම්පූර්ණ නම",
        "Welcome Back.": "නැවත සාදරයෙන් පිළිගනිමු.",
        "Join the Kanna community and get exclusive access to new drops.": "Kanna ප්‍රජාවට එකතු වී නව විලාසිතා සඳහා සුවිශේෂී ප්‍රවේශයක් ලබා ගන්න.",
        "Back to Home": "මුල් පිටුවට",
        "Email Address": "ඊමේල් ලිපිනය",
        "Password": "මුරපදය",
        "Remember me": "මතක තබා ගන්න",
        "Forgot password?": "මුරපදය අමතකද?",
        "Confirm Password": "මුරපදය තහවුරු කරන්න",
        "Create Account": "ගිණුමක් සාදන්න",
        "Verify Your Email": "ඊමේල් එක තහවුරු කරන්න",
        "We've sent a 6-digit code to your email. Please enter it below.": "අපි ඔබේ ඊමේල් ලිපිනයට අංක 6ක කේතයක් එවා ඇත. කරුණාකර එය පහතින් ඇතුළත් කරන්න.",
        "Verify Code": "කේතය තහවුරු කරන්න",
        "Cancel": "අවලංගු කරන්න",
        "Latest Collection": "නවතම එකතුව",
        "Explore our range of premium printed shirts designed for every occasion.": "සෑම අවස්ථාවකටම ගැලපෙන අපගේ උසස් මුද්‍රිත ෂර්ට් එකතුව පරීක්ෂා කර බලන්න.",
        "All Items": "සියලුම අයිතම",
        "Sort by:": "පිළිවෙලට සකසන්න:",
        "Featured": "විශේෂිත",
        "Price: Low to High": "මිල: අඩු සිට වැඩි දක්වා",
        "Price: High to Low": "මිල: වැඩි සිට අඩු දක්වා",
        "Newest": "අලුත්ම",
        "Load More": "තව බලන්න",
        "Order History": "ඇණවුම් ඉතිහාසය",
        "Order ID": "ඇණවුම් අංකය",
        "Items": "අයිතම",
        "Status": "තත්වය",
        "You haven't placed any orders yet.": "ඔබ තවමත් කිසිදු ඇණවුමක් කර නොමැත.",
        "Shipping Details": "බෙදාහැරීමේ විස්තර",
        "First Name": "පළමු නම",
        "Last Name": "වාසගම",
        "Phone Number": "දුරකථන අංකය",
        "Shipping Address": "බෙදාහැරීමේ ලිපිනය",
        "City": "නගරය",
        "Zip Code": "තැපැල් කේතය",
        "Confirm Order": "ඇණවුම තහවුරු කරන්න",
        "By placing this order, you agree to our Terms of Service.": "මෙම ඇණවුම කිරීමෙන් ඔබ අපගේ සේවා කොන්දේසි වලට එකඟ වේ.",
        "Order Summary": "ඇණවුම් සාරාංශය",
        "Subtotal": "අනු එකතුව",
        "Shipping": "බෙදාහැරීම",
        "Free": "නොමිලේ",
        "Cancel & Return": "අවලංගු කර ආපසු යන්න"
    }
};

function toggleLanguage() {
    const currentLang = localStorage.getItem('kanna_lang') === 'si' ? 'en' : 'si';
    localStorage.setItem('kanna_lang', currentLang);
    location.reload();
}

function applyTranslations() {
    const lang = localStorage.getItem('kanna_lang');
    if (lang !== 'si') return;

    const translateElement = (el) => {
        const text = el.textContent.trim();
        if (translations.si[text]) {
            el.textContent = translations.si[text];
        }

        // Handle placeholders
        if (el.placeholder && translations.si[el.placeholder]) {
            el.placeholder = translations.si[el.placeholder];
        }
    };

    // Common UI elements
    const selectors = 'a, button, h1, h2, h3, h4, p, span, li, label, input';
    document.querySelectorAll(selectors).forEach(translateElement);
}

// Update UI Injection to include Language Toggle
function injectUserInterface() {
    const user = getCurrentUser();
    const currentLang = localStorage.getItem('kanna_lang') || 'en';

    // Desktop Injection
    const navContainer = document.querySelector('nav .hidden.md\\:flex.items-center.space-x-4');
    if (navContainer && !document.getElementById('auth-btn-desktop')) {
        const btnContainer = document.createElement('div');
        btnContainer.id = 'auth-btn-desktop';
        btnContainer.className = 'mr-4 flex items-center gap-4';

        const langBtnHtml = `
            <button onclick="toggleLanguage()" class="flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 hover:border-brand-accent transition-all text-[10px] font-bold tracking-widest uppercase">
                <span class="${currentLang === 'en' ? 'text-brand-accent' : 'text-gray-500'}">EN</span>
                <span class="text-gray-700">|</span>
                <span class="${currentLang === 'si' ? 'text-brand-accent' : 'text-gray-500'}">සිං</span>
            </button>
        `;

        const authHtml = user ? `
            <div class="group relative z-50">
                <a href="profile.html" class="text-white hover:text-brand-accent font-bold flex items-center gap-2 transition-colors py-2">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                    ${user.name.split(' ')[0]}
                </a>
                <div class="absolute right-0 mt-2 w-48 bg-brand-gray rounded-md shadow-lg py-1 opacity-0 pointer-events-none group-hover:opacity-100 group-hover:pointer-events-auto transition-opacity duration-200 border border-white/10">
                    <div class="px-4 py-2 border-b border-white/10 text-xs text-gray-500">Signed in as <br><span class="text-white font-bold">${user.email}</span></div>
                    <a href="profile.html" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white border-b border-white/5">My Profile</a>
                    <a href="#" onclick="logout(); return false;" class="block px-4 py-2 text-sm text-gray-300 hover:bg-white/10 hover:text-white">Sign out</a>
                </div>
            </div>
        ` : `
            <div class="flex items-center gap-3">
                <a href="login.html" class="text-gray-300 hover:text-white font-medium transition-colors">Login</a>
                <span class="text-gray-600">|</span>
            </div>
        `;

        btnContainer.innerHTML = langBtnHtml + authHtml;
        navContainer.insertBefore(btnContainer, navContainer.firstChild);
    }

    // Mobile Injection
    const mobileMenu = document.querySelector('#mobile-menu .space-y-1');
    if (mobileMenu && !document.getElementById('auth-btn-mobile')) {
        const mobileAuth = document.createElement('div');
        mobileAuth.id = 'auth-btn-mobile';
        mobileAuth.className = 'pt-4 mt-4 border-t border-white/10 space-y-4';

        const langToggleMobile = `
            <div class="px-3 flex items-center justify-between mb-4">
                <span class="text-xs text-gray-500 font-bold uppercase tracking-widest">Language / භාෂාව</span>
                <button onclick="toggleLanguage()" class="flex items-center gap-2 px-3 py-1 rounded-lg bg-white/5 border border-white/10">
                    <span class="${currentLang === 'en' ? 'text-brand-accent' : 'text-gray-500'} text-[10px] font-bold">EN</span>
                    <span class="${currentLang === 'si' ? 'text-brand-accent' : 'text-gray-500'} text-[10px] font-bold">සිංහල</span>
                </button>
            </div>
        `;

        const authMobile = user ? `
            <div class="px-3 flex items-center justify-between">
                <a href="profile.html" class="text-white font-bold hover:text-brand-accent transition-colors">${user.name}</a>
                <button onclick="logout()" class="text-sm text-red-400 hover:text-red-300">Sign Out</button>
            </div>
        ` : `
            <a href="login.html" class="text-brand-accent hover:text-white block px-3 py-2 rounded-md text-base font-bold">Login / Sign Up</a>
        `;

        mobileAuth.innerHTML = langToggleMobile + authMobile;
        mobileMenu.appendChild(mobileAuth);
    }

    applyTranslations();
}

// Update initialization to ensure translations apply
document.addEventListener('DOMContentLoaded', () => {
    // Other init code...
    injectUserInterface();
    // ... rest of DOMContentLoaded
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check if we need to open cart immediately (e.g. after login)
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('action') === 'cart') {
        setTimeout(() => toggleCart(true), 500);
        // Clean URL
        window.history.replaceState({}, document.title, window.location.pathname);
    }

    const grid = document.getElementById('product-grid');
    if (grid) {
        renderShopPage();
    }

    updateCartIcon();
    injectUserInterface();

    const cartBtns = document.querySelectorAll('.cart-btn-toggle');
    cartBtns.forEach(btn => {
        btn.onclick = () => toggleCart(true);
    });

    // --- Scroll Reveal Logic ---
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    revealElements.forEach(el => revealObserver.observe(el));

    // --- Dynamic Navbar Background ---
    window.addEventListener('scroll', () => {
        const nav = document.getElementById('navbar');
        if (nav) {
            const glass = nav.querySelector('.glass');
            if (glass) {
                if (window.scrollY > 20) {
                    glass.style.background = 'rgba(10, 10, 10, 0.9)';
                    glass.style.borderBottom = '1px solid rgba(255, 215, 0, 0.2)';
                } else {
                    glass.style.background = 'rgba(15, 15, 15, 0.75)';
                    glass.style.borderBottom = '1px solid rgba(255, 255, 255, 0.08)';
                }
            }
        }
    });
});

// --- Club & Comments ---

function handleSubscribe(e) {
    e.preventDefault();
    const emailInput = e.target.querySelector('input[type="email"]');
    if (emailInput && emailInput.value) {
        // Save subscriber (simulated)
        const subscribers = JSON.parse(localStorage.getItem('kanna_subscribers') || '[]');
        if (!subscribers.includes(emailInput.value)) {
            subscribers.push(emailInput.value);
            localStorage.setItem('kanna_subscribers', JSON.stringify(subscribers));
        }

        alert('Thank you for subscribing! Redirecting to Kanna Club...');
        window.location.href = 'club.html';
    }
}


// Star Rating Logic
function updateStarRating(rating) {
    const input = document.getElementById('comment-rating');
    if (input) input.value = rating;

    const btns = document.querySelectorAll('.star-btn');
    btns.forEach((btn, index) => {
        if (index < rating) {
            btn.classList.add('text-brand-accent');
            btn.classList.remove('text-gray-600');
        } else {
            btn.classList.remove('text-brand-accent');
            btn.classList.add('text-gray-600');
        }
    });
}

function handlePostComment(e) {
    e.preventDefault();
    const name = document.getElementById('comment-name').value;
    const email = document.getElementById('comment-email').value;
    const text = document.getElementById('comment-text').value;
    const rating = document.getElementById('comment-rating') ? document.getElementById('comment-rating').value : 5;

    if (!name || !text) return;

    const user = getCurrentUser();
    const authorEmail = user ? user.email : email;

    const newComment = {
        id: Date.now(),
        name: name,
        email: authorEmail,
        text: text,
        rating: parseInt(rating),
        date: new Date().toLocaleDateString()
    };

    const comments = JSON.parse(localStorage.getItem('kanna_comments') || '[]');
    comments.unshift(newComment);
    localStorage.setItem('kanna_comments', JSON.stringify(comments));

    e.target.reset();
    updateStarRating(5); // Reset stars
    renderComments();
}

function renderComments() {
    const container = document.getElementById('comments-container');
    if (!container) return;

    let comments = JSON.parse(localStorage.getItem('kanna_comments') || '[]');

    if (comments.length === 0) {
        const dummyComments = [
            { id: 1, name: "Sarah J.", email: "sarah@example.com", text: "Absolutely love the silk blend shirts! Need more designs.", rating: 5, date: "2/10/2026" },
            { id: 2, name: "Mark D.", email: "mark@example.com", text: "The fit is perfect. Kanna never disappoints.", rating: 4, date: "2/08/2026" },
            { id: 3, name: "Kavi P.", email: "kavi@example.com", text: "Waiting for the new summer collection! 🔥", rating: 5, date: "2/05/2026" }
        ];
        comments = dummyComments;
        localStorage.setItem('kanna_comments', JSON.stringify(comments));
    }

    container.innerHTML = '';
    const items = comments.length > 0 ? comments : [];
    const currentUser = getCurrentUser();

    items.forEach(c => {
        const div = document.createElement('div');
        div.className = 'bg-brand-gray p-6 rounded-lg border border-white/5 animate-fade-in mb-4 shadow group relative';

        let actions = '';
        if (currentUser && currentUser.email === c.email) {
            actions = `
                <div class="flex gap-3 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onclick="editComment(${c.id})" class="text-xs text-blue-400 hover:text-white bg-black/50 px-2 py-1 rounded">Edit</button>
                    <button onclick="deleteComment(${c.id})" class="text-xs text-red-500 hover:text-white bg-black/50 px-2 py-1 rounded">Delete</button>
                </div>
            `;
        }

        // Generate Star HTML
        let starsHtml = '';
        const userRating = c.rating || 5;
        for (let i = 0; i < 5; i++) {
            starsHtml += `<span class="${i < userRating ? 'text-brand-accent' : 'text-gray-600'} text-sm">★</span>`;
        }

        div.innerHTML = `
            ${actions}
            <div class="flex justify-between items-start mb-2">
                <div>
                    <h4 class="text-white font-bold flex items-center gap-2">
                        ${c.name}
                        <div class="flex gap-0.5">${starsHtml}</div>
                    </h4>
                    <span class="text-xs text-gray-500">${c.email ? c.email.split('@')[0] + ' @...' : ''}</span>
                </div>
                <span class="text-xs text-brand-accent font-mono">${c.date}</span>
            </div>
            <p class="text-gray-300 leading-relaxed">${c.text}</p>
        `;
        container.appendChild(div);
    });
}

function deleteComment(id) {
    if (!confirm("Delete this comment?")) return;
    let comments = JSON.parse(localStorage.getItem('kanna_comments') || '[]');
    comments = comments.filter(c => c.id !== id);
    localStorage.setItem('kanna_comments', JSON.stringify(comments));
    renderComments();
}

function editComment(id) {
    let comments = JSON.parse(localStorage.getItem('kanna_comments') || '[]');
    const comment = comments.find(c => c.id === id);
    if (!comment) return;

    const newText = prompt("Edit your comment:", comment.text);
    if (newText !== null && newText.trim() !== "") {
        comment.text = newText;
        // Update in array
        const index = comments.findIndex(c => c.id === id);
        if (index !== -1) comments[index] = comment;

        localStorage.setItem('kanna_comments', JSON.stringify(comments));
        renderComments();
    }
}

// --- Size Guide Logic ---

function toggleSizeGuide(show) {
    let modal = document.getElementById('size-guide-modal');
    if (!modal && show) {
        // Create modal if it doesn't exist
        modal = document.createElement('div');
        modal.id = 'size-guide-modal';
        modal.className = 'fixed inset-0 z-[100] bg-black/90 flex items-center justify-center backdrop-blur-md p-4 animate-fade-in';
        modal.innerHTML = `
            <div class="bg-brand-gray w-full max-w-2xl rounded-2xl border border-white/10 overflow-hidden shadow-2xl overflow-y-auto max-h-[90vh]">
                <div class="p-6 border-b border-white/10 flex justify-between items-center sticky top-0 bg-brand-gray z-10">
                    <h2 class="text-2xl font-serif font-bold text-white uppercase tracking-tighter text-glow">Shirt Size Guide</h2>
                    <button onclick="toggleSizeGuide(false)" class="text-gray-400 hover:text-brand-accent p-2 transition-colors">
                        <svg class="w-7 h-7" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
                <div class="p-8">
                    <div class="mb-10 text-center">
                        <p class="text-gray-300 text-lg leading-relaxed max-w-lg mx-auto">
                            Find your perfect fit with our comprehensive guide. All measurements are provided in <span class="text-brand-accent font-bold italic">inches</span>.
                        </p>
                    </div>
                    
                    <div class="overflow-x-auto mb-12 bg-black/40 rounded-2xl border border-white/10 shadow-inner">
                        <table class="w-full text-left border-collapse">
                            <thead>
                                <tr class="text-gray-500 text-[10px] uppercase font-black tracking-[0.2em] border-b border-white/10 bg-white/5">
                                    <th class="py-5 px-8">Size Tag</th>
                                    <th class="py-5 px-8">Chest (inches)</th>
                                    <th class="py-5 px-8">Shoulder (inches)</th>
                                    <th class="py-5 px-8">Length (inches)</th>
                                </tr>
                            </thead>
                            <tbody class="text-white divide-y divide-white/5">
                                <tr class="hover:bg-brand-accent/5 transition-colors group">
                                    <td class="py-5 px-8 font-black text-brand-accent">S</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">38"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">17.5"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">27"</td>
                                </tr>
                                <tr class="hover:bg-brand-accent/5 transition-colors group border-white/5">
                                    <td class="py-5 px-8 font-black text-brand-accent">M</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">40"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">18.5"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">28"</td>
                                </tr>
                                <tr class="hover:bg-brand-accent/5 transition-colors group border-white/5">
                                    <td class="py-5 px-8 font-black text-brand-accent">L</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">42"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">19.5"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">29"</td>
                                </tr>
                                <tr class="hover:bg-brand-accent/5 transition-colors group border-white/5">
                                    <td class="py-5 px-8 font-black text-brand-accent">XL</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">44"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">20.5"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">30"</td>
                                </tr>
                                <tr class="hover:bg-brand-accent/5 transition-colors group border-white/5">
                                    <td class="py-5 px-8 font-black text-brand-accent">XXL</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">46"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">21.5"</td>
                                    <td class="py-5 px-8 font-mono text-sm group-hover:text-white transition-colors">31"</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                    <div class="premium-gradient p-8 rounded-2xl border border-brand-accent/20 shadow-xl">
                        <h3 class="text-white text-xl font-serif font-bold mb-6 flex items-center gap-3">
                            <span class="w-8 h-8 rounded-full bg-brand-accent text-brand-dark flex items-center justify-center text-sm font-black">?</span>
                            How to find your perfect fit?
                        </h3>
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
                            <div class="flex flex-col gap-2">
                                <h4 class="text-brand-accent text-[10px] font-black uppercase tracking-widest">01. Chest</h4>
                                <p class="text-xs text-gray-400 leading-relaxed">Measure the circumference under your arms at the fullest part of your chest. Keep the tape horizontal.</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <h4 class="text-brand-accent text-[10px] font-black uppercase tracking-widest">02. Shoulder</h4>
                                <p class="text-xs text-gray-400 leading-relaxed">Measure from one shoulder seam across the back to the other shoulder seam.</p>
                            </div>
                            <div class="flex flex-col gap-2">
                                <h4 class="text-brand-accent text-[10px] font-black uppercase tracking-widest">03. Length</h4>
                                <p class="text-xs text-gray-400 leading-relaxed">From the highest shoulder point down to where you want the shirt to end.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modal);
    }

    if (show) {
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else if (modal) {
        modal.classList.add('hidden');
        document.body.style.overflow = '';
    }
}

// Global click event to catch any "Size Guide" link clicks
document.addEventListener('click', (e) => {
    const link = e.target.closest('a');
    if (link && link.textContent.trim().toLowerCase() === 'size guide') {
        e.preventDefault();
        toggleSizeGuide(true);
    }
});
