// City Electronics Store Management System - Backend Logic
// app.js - Enhanced Version with Product Images
// Developed by TechGen Vendors (PVT) Ltd

// ==================== DATA MODELS ====================

class Product {
    constructor(id, name, category, price, stock, image, icon) {
        this.id = id;
        this.name = name;
        this.category = category;
        this.price = price;
        this.stock = stock;
        this.image = image; // Image URL
        this.icon = icon;   // Emoji icon for display
    }
}

class Order {
    constructor(orderId, customerId, customerName, items, totalAmount) {
        this.orderId = orderId;
        this.customerId = customerId;
        this.customerName = customerName;
        this.items = items;
        this.totalAmount = totalAmount;
        this.status = 'Pending';
        this.orderDate = new Date();
    }
}

class User {
    constructor(username, password, role) {
        this.username = username;
        this.password = password;
        this.role = role;
    }
}

// ==================== STORE MANAGEMENT CLASS ====================

class ElectronicsStore {
    constructor() {
        this.products = [];
        this.orders = [];
        this.users = [];
        this.currentUser = null;
        this.selectedRole = null;
        this.orderCounter = 1;
        this.productCounter = 1;
        this.cart = [];
        this.initializeData();
    }

    initializeData() {
        // Initialize users
        this.users.push(new User('admin', 'admin123', 'admin'));
        this.users.push(new User('customer1', 'pass123', 'customer'));
        this.users.push(new User('john_doe', 'john123', 'customer'));
        
        // Initialize sample products with images
        this.products.push(new Product(this.productCounter++, 'iPhone 15 Pro', 'Smartphones', 450000, 15, 'https://images.unsplash.com/photo-1696446702061-cbd2bb110913?w=400', '📱'));
        this.products.push(new Product(this.productCounter++, 'Samsung Galaxy S24', 'Smartphones', 380000, 20, 'https://images.unsplash.com/photo-1610945415295-d9bbf067e59c?w=400', '📱'));
        this.products.push(new Product(this.productCounter++, 'MacBook Air M3', 'Laptops', 520000, 10, 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400', '💻'));
        this.products.push(new Product(this.productCounter++, 'Dell XPS 15', 'Laptops', 480000, 8, 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=400', '💻'));
        this.products.push(new Product(this.productCounter++, 'Sony WH-1000XM5', 'Audio', 125000, 25, 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=400', '🎧'));
        this.products.push(new Product(this.productCounter++, 'iPad Air', 'Tablets', 280000, 12, 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400', '📱'));
        this.products.push(new Product(this.productCounter++, 'Apple Watch Series 9', 'Wearables', 180000, 18, 'https://images.unsplash.com/photo-1434493789847-2f02dc6ca35d?w=400', '⌚'));
        this.products.push(new Product(this.productCounter++, 'Samsung QLED TV 55"', 'TVs', 350000, 6, 'https://images.unsplash.com/photo-1593784991095-a205069470b6?w=400', '📺'));
        this.products.push(new Product(this.productCounter++, 'AirPods Pro', 'Audio', 95000, 30, 'https://images.unsplash.com/photo-1606841837239-c5a1a4a07af7?w=400', '🎧'));
        this.products.push(new Product(this.productCounter++, 'Canon EOS R6', 'Cameras', 750000, 5, 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=400', '📷'));
    }

    setRole(role) {
        this.selectedRole = role;
    }

    login(username, password) {
        const user = this.users.find(u => u.username === username && u.password === password);
        if (user && user.role === this.selectedRole) {
            this.currentUser = user;
            return { success: true, user: user };
        } else if (user && user.role !== this.selectedRole) {
            return { success: false, message: 'Invalid credentials for selected role' };
        }
        return { success: false, message: 'Invalid username or password' };
    }

    logout() {
        this.currentUser = null;
        this.selectedRole = null;
        this.cart = [];
    }

    getCurrentUser() {
        return this.currentUser;
    }

    addProduct(name, category, price, stock) {
        const icon = this.getIconForCategory(category);
        const product = new Product(this.productCounter++, name, category, parseFloat(price), parseInt(stock), null, icon);
        this.products.push(product);
        return product;
    }

    getIconForCategory(category) {
        const icons = {
            'Smartphones': '📱',
            'Laptops': '💻',
            'Audio': '🎧',
            'Tablets': '📱',
            'Wearables': '⌚',
            'TVs': '📺',
            'Cameras': '📷'
        };
        return icons[category] || '📦';
    }

    updateProduct(id, name, category, price, stock) {
        const product = this.products.find(p => p.id === id);
        if (product) {
            product.name = name;
            product.category = category;
            product.price = parseFloat(price);
            product.stock = parseInt(stock);
            product.icon = this.getIconForCategory(category);
            return true;
        }
        return false;
    }

    deleteProduct(id) {
        const index = this.products.findIndex(p => p.id === id);
        if (index !== -1) {
            this.products.splice(index, 1);
            return true;
        }
        return false;
    }

    getProductById(id) {
        return this.products.find(p => p.id === id);
    }

    getAllProducts() {
        return this.products;
    }

    getAvailableProducts() {
        return this.products.filter(p => p.stock > 0);
    }

    addToCart(productId, quantity) {
        const product = this.products.find(p => p.id === productId);
        if (!product) {
            return { success: false, message: 'Product not found' };
        }
        if (product.stock < quantity) {
            return { success: false, message: `Only ${product.stock} items available` };
        }

        const existingItem = this.cart.find(item => item.productId === productId);
        if (existingItem) {
            const newQuantity = existingItem.quantity + quantity;
            if (newQuantity > product.stock) {
                return { success: false, message: `Only ${product.stock} items available` };
            }
            existingItem.quantity = newQuantity;
        } else {
            this.cart.push({ productId, quantity });
        }
        
        return { success: true, message: 'Item added to cart' };
    }

    removeFromCart(productId) {
        const index = this.cart.findIndex(item => item.productId === productId);
        if (index !== -1) {
            this.cart.splice(index, 1);
            return true;
        }
        return false;
    }

    updateCartQuantity(productId, quantity) {
        const item = this.cart.find(item => item.productId === productId);
        if (item) {
            const product = this.products.find(p => p.id === productId);
            if (quantity > product.stock) {
                return { success: false, message: `Only ${product.stock} items available` };
            }
            if (quantity <= 0) {
                return { success: false, message: 'Quantity must be at least 1' };
            }
            item.quantity = parseInt(quantity);
            return { success: true };
        }
        return { success: false, message: 'Item not in cart' };
    }

    getCart() {
        return this.cart;
    }

    clearCart() {
        this.cart = [];
    }

    getCartTotal() {
        let total = 0;
        for (const item of this.cart) {
            const product = this.products.find(p => p.id === item.productId);
            if (product) {
                total += product.price * item.quantity;
            }
        }
        return total;
    }

    getCartItemCount() {
        return this.cart.reduce((sum, item) => sum + item.quantity, 0);
    }

    placeOrder() {
        if (!this.cart || this.cart.length === 0) {
            return { success: false, message: 'Cart is empty' };
        }

        const orderItems = [];
        let totalAmount = 0;
        
        for (const item of this.cart) {
            const product = this.products.find(p => p.id === item.productId);
            if (!product) {
                return { success: false, message: `Product with ID ${item.productId} not found` };
            }
            if (product.stock < item.quantity) {
                return { success: false, message: `Insufficient stock for ${product.name}. Available: ${product.stock}` };
            }
            
            orderItems.push({
                product: { ...product },
                quantity: item.quantity
            });
            totalAmount += product.price * item.quantity;
        }
        
        for (const item of this.cart) {
            const product = this.products.find(p => p.id === item.productId);
            product.stock -= item.quantity;
        }

        const order = new Order(
            this.orderCounter++,
            this.currentUser.username,
            this.currentUser.username,
            orderItems,
            totalAmount
        );
        
        this.orders.push(order);
        this.cart = [];
        
        return { success: true, order: order };
    }

    getCustomerOrders(customerId) {
        return this.orders.filter(o => o.customerId === customerId);
    }

    getAllOrders() {
        return this.orders;
    }
}

// ==================== GLOBAL STORE INSTANCE ====================
const store = new ElectronicsStore();

// ==================== UTILITY FUNCTIONS ====================

function formatCurrency(amount) {
    return `LKR ${amount.toLocaleString()}`;
}

function showAlert(elementId, type, message) {
    const alertElement = document.getElementById(elementId);
    if (!alertElement) return;
    
    const alertClass = type === 'success' ? 'alert-success' : 
                       type === 'error' ? 'alert-error' : 'alert-info';
    
    alertElement.innerHTML = `<div class="alert ${alertClass}">${message}</div>`;
    
    setTimeout(() => {
        alertElement.innerHTML = '';
    }, 4000);
}

function hideAllSections() {
    const sections = ['manageProducts', 'viewOrders', 'addProduct', 'browseProducts', 'placeOrder', 'trackOrders'];
    sections.forEach(sectionId => {
        const section = document.getElementById(sectionId);
        if (section) {
            section.classList.add('hidden');
        }
    });
}

function showSection(sectionId) {
    hideAllSections();
    const section = document.getElementById(sectionId);
    if (section) {
        section.classList.remove('hidden');
        
        if (sectionId === 'manageProducts') {
            displayProductsList();
        } else if (sectionId === 'viewOrders') {
            displayOrdersList();
        } else if (sectionId === 'browseProducts') {
            displayCustomerProducts();
        } else if (sectionId === 'placeOrder') {
            displayProductsForOrder();
            updateCartDisplay();
        } else if (sectionId === 'trackOrders') {
            displayCustomerOrders();
        }
    }
}

// ==================== ROLE SELECTION ====================

function selectRole(role) {
    store.setRole(role);
    
    document.getElementById('roleSelectionScreen').style.display = 'none';
    document.getElementById('loginScreen').style.display = 'block';
    
    if (role === 'admin') {
        document.getElementById('loginTitle').textContent = 'Administrator Login';
        document.getElementById('credentialsInfo').innerHTML = `
            <h3>🔐 Administrator Credentials</h3>
            <p><strong>Username:</strong> <code>admin</code></p>
            <p><strong>Password:</strong> <code>admin123</code></p>
            <br>
            <p style="font-size: 0.9em; color: #666;">
                <strong>Administrator can:</strong><br>
                • Add, modify, or remove products<br>
                • View and monitor all customer orders<br>
                • Manage product inventory and pricing
            </p>
        `;
    } else {
        document.getElementById('loginTitle').textContent = 'Customer Login';
        document.getElementById('credentialsInfo').innerHTML = `
            <h3>🔐 Customer Credentials</h3>
            <p><strong>Account 1:</strong></p>
            <p>Username: <code>customer1</code> | Password: <code>pass123</code></p>
            <br>
            <p><strong>Account 2:</strong></p>
            <p>Username: <code>john_doe</code> | Password: <code>john123</code></p>
            <br>
            <p style="font-size: 0.9em; color: #666;">
                <strong>Customers can:</strong><br>
                • Browse available electronic devices<br>
                • Place orders with multiple items<br>
                • Adjust quantities and view total amount<br>
                • Track order history
            </p>
        `;
    }
    
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginAlert').innerHTML = '';
}

function backToRoleSelection() {
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('roleSelectionScreen').style.display = 'block';
    store.setRole(null);
    document.getElementById('username').value = '';
    document.getElementById('password').value = '';
    document.getElementById('loginAlert').innerHTML = '';
}

// ==================== AUTHENTICATION FUNCTIONS ====================

function login() {
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();
    
    if (!username || !password) {
        showAlert('loginAlert', 'error', 'Please enter both username and password');
        return;
    }
    
    const result = store.login(username, password);
    
    if (result.success) {
        document.getElementById('loginScreen').style.display = 'none';
        
        const user = result.user;
        if (user.role === 'admin') {
            document.getElementById('adminDashboard').classList.add('active');
            document.getElementById('adminUserInfo').textContent = `👤 Admin Portal - ${username}`;
            updateAdminStats();
            // Automatically show manage products for admin
            showSection('manageProducts');
        } else {
            document.getElementById('customerDashboard').classList.add('active');
            document.getElementById('customerName').textContent = `👤 Customer Portal - ${username}`;
            // Automatically show browse products for customer
            showSection('browseProducts');
        }
        
        document.getElementById('username').value = '';
        document.getElementById('password').value = '';
    } else {
        showAlert('loginAlert', 'error', result.message);
    }
}

function logout() {
    store.logout();
    
    document.getElementById('adminDashboard').classList.remove('active');
    document.getElementById('customerDashboard').classList.remove('active');
    document.getElementById('loginScreen').style.display = 'none';
    document.getElementById('roleSelectionScreen').style.display = 'block';
    
    hideAllSections();
}

// ==================== ADMIN FUNCTIONS ====================

function updateAdminStats() {
    const totalProducts = store.getAllProducts().length;
    const totalOrders = store.getAllOrders().length;
    const totalRevenue = store.getAllOrders().reduce((sum, order) => sum + order.totalAmount, 0);
    
    const statsHTML = `
        <div class="stat-card">
            <h3>${totalProducts}</h3>
            <p>Total Products</p>
        </div>
        <div class="stat-card">
            <h3>${totalOrders}</h3>
            <p>Total Orders</p>
        </div>
        <div class="stat-card">
            <h3>${formatCurrency(totalRevenue)}</h3>
            <p>Total Revenue</p>
        </div>
    `;
    
    document.getElementById('adminStats').innerHTML = statsHTML;
}

function addNewProduct() {
    const name = document.getElementById('productName').value.trim();
    const category = document.getElementById('productCategory').value.trim();
    const price = document.getElementById('productPrice').value;
    const stock = document.getElementById('productStock').value;
    
    if (!name || !category || !price || !stock) {
        showAlert('addProductAlert', 'error', 'All fields are required');
        return;
    }
    
    if (parseFloat(price) <= 0) {
        showAlert('addProductAlert', 'error', 'Price must be greater than 0');
        return;
    }
    
    if (parseInt(stock) < 0) {
        showAlert('addProductAlert', 'error', 'Stock cannot be negative');
        return;
    }
    
    store.addProduct(name, category, price, stock);
    showAlert('addProductAlert', 'success', 'Product added successfully!');
    
    document.getElementById('productName').value = '';
    document.getElementById('productCategory').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productStock').value = '';
    
    updateAdminStats();
}

function displayProductsList() {
    const products = store.getAllProducts();
    
    if (products.length === 0) {
        document.getElementById('productsList').innerHTML = `
            <div class="alert alert-info">No products in inventory</div>
        `;
        return;
    }
    
    let html = `
        <table>
            <thead>
                <tr>
                    <th>ID</th>
                    <th>Name</th>
                    <th>Category</th>
                    <th>Price</th>
                    <th>Stock</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
    `;
    
    products.forEach(product => {
        html += `
            <tr>
                <td>${product.id}</td>
                <td>${product.name}</td>
                <td>${product.category}</td>
                <td>${formatCurrency(product.price)}</td>
                <td>${product.stock}</td>
                <td>
                    <button class="btn btn-warning" onclick="openEditProduct(${product.id})">Edit</button>
                    <button class="btn btn-danger" onclick="deleteProduct(${product.id})">Delete</button>
                </td>
            </tr>
        `;
    });
    
    html += `
            </tbody>
        </table>
    `;
    
    document.getElementById('productsList').innerHTML = html;
}

function openEditProduct(productId) {
    const product = store.getProductById(productId);
    if (!product) return;
    
    document.getElementById('editProductId').value = product.id;
    document.getElementById('editProductName').value = product.name;
    document.getElementById('editProductCategory').value = product.category;
    document.getElementById('editProductPrice').value = product.price;
    document.getElementById('editProductStock').value = product.stock;
    
    document.getElementById('editProductModal').classList.add('active');
}

function saveProductEdit() {
    const id = parseInt(document.getElementById('editProductId').value);
    const name = document.getElementById('editProductName').value.trim();
    const category = document.getElementById('editProductCategory').value.trim();
    const price = document.getElementById('editProductPrice').value;
    const stock = document.getElementById('editProductStock').value;
    
    if (!name || !category || !price || !stock) {
        showAlert('editProductAlert', 'error', 'All fields are required');
        return;
    }
    
    if (parseFloat(price) <= 0) {
        showAlert('editProductAlert', 'error', 'Price must be greater than 0');
        return;
    }
    
    if (parseInt(stock) < 0) {
        showAlert('editProductAlert', 'error', 'Stock cannot be negative');
        return;
    }
    
    if (store.updateProduct(id, name, category, price, stock)) {
        closeModal('editProductModal');
        displayProductsList();
        updateAdminStats();
        showAlert('addProductAlert', 'success', 'Product updated successfully!');
    } else {
        showAlert('editProductAlert', 'error', 'Failed to update product');
    }
}

function deleteProduct(productId) {
    if (confirm('Are you sure you want to delete this product?')) {
        if (store.deleteProduct(productId)) {
            displayProductsList();
            updateAdminStats();
            showAlert('addProductAlert', 'success', 'Product deleted successfully!');
        } else {
            showAlert('addProductAlert', 'error', 'Failed to delete product');
        }
    }
}

function displayOrdersList() {
    const orders = store.getAllOrders();
    
    if (orders.length === 0) {
        document.getElementById('ordersList').innerHTML = `
            <div class="alert alert-info">No orders yet</div>
        `;
        return;
    }
    
    let html = '';
    
    orders.forEach(order => {
        html += `
            <div class="order-details">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <h4>Order #${order.orderId}</h4>
                        <p><strong>Customer:</strong> ${order.customerName}</p>
                        <p><strong>Date:</strong> ${order.orderDate.toLocaleString()}</p>
                        <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 1.5em; font-weight: bold; color: #667eea;">${formatCurrency(order.totalAmount)}</p>
                    </div>
                </div>
                <button class="btn btn-primary" onclick="viewOrderDetails(${order.orderId})">View Details</button>
            </div>
        `;
    });
    
    document.getElementById('ordersList').innerHTML = html;
}

function viewOrderDetails(orderId) {
    const order = store.getAllOrders().find(o => o.orderId === orderId);
    if (!order) return;
    
    let itemsHTML = '';
    order.items.forEach(item => {
        itemsHTML += `
            <div class="order-item">
                <div style="display: flex; justify-content: space-between;">
                    <div>
                        <strong>${item.product.name}</strong><br>
                        <small>${item.product.category}</small>
                    </div>
                    <div style="text-align: right;">
                        <strong>Qty: ${item.quantity}</strong><br>
                        <strong>${formatCurrency(item.product.price * item.quantity)}</strong>
                    </div>
                </div>
            </div>
        `;
    });
    
    const detailsHTML = `
        <div class="order-details">
            <div class="detail-row">
                <span>Order ID:</span>
                <strong>#${order.orderId}</strong>
            </div>
            <div class="detail-row">
                <span>Customer:</span>
                <strong>${order.customerName}</strong>
            </div>
            <div class="detail-row">
                <span>Order Date:</span>
                <strong>${order.orderDate.toLocaleString()}</strong>
            </div>
            <div class="detail-row">
                <span>Status:</span>
                <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
            </div>
            <div class="detail-row">
                <span>Total Amount:</span>
                <strong style="color: #667eea; font-size: 1.3em;">${formatCurrency(order.totalAmount)}</strong>
            </div>
        </div>
        <h3 style="margin-top: 20px; margin-bottom: 10px;">Order Items</h3>
        <div class="order-items-list">
            ${itemsHTML}
        </div>
    `;
    
    document.getElementById('orderDetailsContent').innerHTML = detailsHTML;
    document.getElementById('orderDetailsModal').classList.add('active');
}

// ==================== CUSTOMER FUNCTIONS ====================

function displayCustomerProducts() {
    const products = store.getAvailableProducts();
    
    if (products.length === 0) {
        document.getElementById('customerProductsList').innerHTML = `
            <div class="alert alert-info">No products available at the moment</div>
        `;
        return;
    }
    
    let html = '';
    
    products.forEach(product => {
        const imageHtml = product.image ? 
            `<img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="product-image" style="display:none;">${product.icon}</div>` :
            `<div class="product-image">${product.icon}</div>`;
        
        html += `
            <div class="product-card">
                ${imageHtml}
                <div class="product-content">
                    <h4>${product.name}</h4>
                    <div class="product-info">
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p class="price-tag">${formatCurrency(product.price)}</p>
                        <p><strong>In Stock:</strong> ${product.stock} units available</p>
                    </div>
                    <div class="quantity-input">
                        <label>Quantity:</label>
                        <input type="number" id="browse-qty-${product.id}" min="1" max="${product.stock}" value="1">
                        <button class="btn btn-success" onclick="addToCartFromBrowse(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('customerProductsList').innerHTML = html;
    updateBrowseCartDisplay();
}

function addToCartFromBrowse(productId) {
    const qtyInput = document.getElementById(`browse-qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (quantity <= 0) {
        showAlert('browseProductsAlert', 'error', 'Quantity must be greater than 0');
        return;
    }
    
    const result = store.addToCart(productId, quantity);
    
    if (result.success) {
        showAlert('browseProductsAlert', 'success', result.message);
        qtyInput.value = 1;
        updateBrowseCartDisplay();
    } else {
        showAlert('browseProductsAlert', 'error', result.message);
    }
}

function updateBrowseCartDisplay() {
    const cart = store.getCart();
    const cartSection = document.getElementById('browseCartSection');
    
    if (cart.length === 0) {
        cartSection.classList.add('hidden');
        return;
    }
    
    cartSection.classList.remove('hidden');
    
    let html = '';
    
    cart.forEach(item => {
        const product = store.getProductById(item.productId);
        if (!product) return;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-icon">${product.icon}</div>
                    <div class="cart-item-details">
                        <strong style="font-size: 1.1em;">${product.name}</strong><br>
                        <small style="color: #666;">${formatCurrency(product.price)} each</small>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantityBrowse(${product.id})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantityBrowse(${product.id})">+</button>
                    </div>
                    <div class="item-price">${formatCurrency(product.price * item.quantity)}</div>
                    <button class="btn btn-danger" onclick="removeFromCartBrowse(${product.id})" style="padding: 8px 12px;">Remove</button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('browseCartItems').innerHTML = html;
    
    const itemCount = store.getCartItemCount();
    const totalAmount = store.getCartTotal();
    document.getElementById('browseCartTotal').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="text-align: left;">
                <div style="font-size: 0.9em; opacity: 0.9;">Total Items: ${itemCount}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 0.9em; opacity: 0.9;">Total Amount:</div>
                <div style="font-size: 1.8em;">${formatCurrency(totalAmount)}</div>
            </div>
        </div>
    `;
}

function increaseQuantityBrowse(productId) {
    const product = store.getProductById(productId);
    const cartItem = store.getCart().find(item => item.productId === productId);
    
    if (cartItem && cartItem.quantity < product.stock) {
        const result = store.updateCartQuantity(productId, cartItem.quantity + 1);
        if (result.success) {
            updateBrowseCartDisplay();
        } else {
            showAlert('browseProductsAlert', 'error', result.message);
        }
    } else {
        showAlert('browseProductsAlert', 'error', `Maximum stock available: ${product.stock}`);
    }
}

function decreaseQuantityBrowse(productId) {
    const cartItem = store.getCart().find(item => item.productId === productId);
    
    if (cartItem && cartItem.quantity > 1) {
        const result = store.updateCartQuantity(productId, cartItem.quantity - 1);
        if (result.success) {
            updateBrowseCartDisplay();
        }
    } else {
        showAlert('browseProductsAlert', 'info', 'Minimum quantity is 1. Use Remove to delete item.');
    }
}

function removeFromCartBrowse(productId) {
    if (store.removeFromCart(productId)) {
        showAlert('browseProductsAlert', 'success', 'Item removed from cart');
        updateBrowseCartDisplay();
    }
}

function clearCartFromBrowse() {
    if (confirm('Are you sure you want to clear the cart?')) {
        store.clearCart();
        updateBrowseCartDisplay();
        showAlert('browseProductsAlert', 'success', 'Cart cleared');
    }
}

function confirmOrderFromBrowse() {
    if (store.getCart().length === 0) {
        showAlert('browseProductsAlert', 'error', 'Cart is empty');
        return;
    }
    
    const result = store.placeOrder();
    
    if (result.success) {
        showAlert('browseProductsAlert', 'success', `Order #${result.order.orderId} placed successfully! Total: ${formatCurrency(result.order.totalAmount)}`);
        updateBrowseCartDisplay();
        displayCustomerProducts();
    } else {
        showAlert('browseProductsAlert', 'error', result.message);
    }
}

function displayProductsForOrder() {
    const products = store.getAvailableProducts();
    
    if (products.length === 0) {
        document.getElementById('availableProductsForOrder').innerHTML = `
            <div class="alert alert-info">No products available at the moment</div>
        `;
        return;
    }
    
    let html = '';
    
    products.forEach(product => {
        const imageHtml = product.image ? 
            `<img src="${product.image}" alt="${product.name}" class="product-image" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
             <div class="product-image" style="display:none;">${product.icon}</div>` :
            `<div class="product-image">${product.icon}</div>`;
        
        html += `
            <div class="product-card">
                ${imageHtml}
                <div class="product-content">
                    <h4>${product.name}</h4>
                    <div class="product-info">
                        <p><strong>Category:</strong> ${product.category}</p>
                        <p class="price-tag">${formatCurrency(product.price)}</p>
                        <p><strong>Available:</strong> ${product.stock} units</p>
                    </div>
                    <div class="quantity-input">
                        <label>Quantity:</label>
                        <input type="number" id="qty-${product.id}" min="1" max="${product.stock}" value="1">
                        <button class="btn btn-success" onclick="addToCart(${product.id})">Add to Cart</button>
                    </div>
                </div>
            </div>
        `;
    });
    
    document.getElementById('availableProductsForOrder').innerHTML = html;
}

function addToCart(productId) {
    const qtyInput = document.getElementById(`qty-${productId}`);
    const quantity = parseInt(qtyInput.value);
    
    if (quantity <= 0) {
        showAlert('placeOrderAlert', 'error', 'Quantity must be greater than 0');
        return;
    }
    
    const result = store.addToCart(productId, quantity);
    
    if (result.success) {
        showAlert('placeOrderAlert', 'success', result.message);
        qtyInput.value = 1;
        updateCartDisplay();
    } else {
        showAlert('placeOrderAlert', 'error', result.message);
    }
}

function updateCartDisplay() {
    const cart = store.getCart();
    const cartSection = document.getElementById('cartSection');
    
    if (cart.length === 0) {
        cartSection.classList.add('hidden');
        return;
    }
    
    cartSection.classList.remove('hidden');
    
    let html = '';
    
    cart.forEach(item => {
        const product = store.getProductById(item.productId);
        if (!product) return;
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-icon">${product.icon}</div>
                    <div class="cart-item-details">
                        <strong style="font-size: 1.1em;">${product.name}</strong><br>
                        <small style="color: #666;">${formatCurrency(product.price)} each</small>
                    </div>
                </div>
                <div class="cart-item-controls">
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="decreaseQuantity(${product.id})">-</button>
                        <span class="quantity-display">${item.quantity}</span>
                        <button class="quantity-btn" onclick="increaseQuantity(${product.id})">+</button>
                    </div>
                    <div class="item-price">${formatCurrency(product.price * item.quantity)}</div>
                    <button class="btn btn-danger" onclick="removeFromCart(${product.id})" style="padding: 8px 12px;">Remove</button>
                </div>
            </div>
        `;
    });
    
    document.getElementById('cartItems').innerHTML = html;
    
    const itemCount = store.getCartItemCount();
    const totalAmount = store.getCartTotal();
    document.getElementById('cartTotal').innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <div style="text-align: left;">
                <div style="font-size: 0.9em; opacity: 0.9;">Total Items: ${itemCount}</div>
            </div>
            <div style="text-align: right;">
                <div style="font-size: 0.9em; opacity: 0.9;">Total Amount:</div>
                <div style="font-size: 1.8em;">${formatCurrency(totalAmount)}</div>
            </div>
        </div>
    `;
}

function increaseQuantity(productId) {
    const product = store.getProductById(productId);
    const cartItem = store.getCart().find(item => item.productId === productId);
    
    if (cartItem && cartItem.quantity < product.stock) {
        const result = store.updateCartQuantity(productId, cartItem.quantity + 1);
        if (result.success) {
            updateCartDisplay();
        } else {
            showAlert('placeOrderAlert', 'error', result.message);
        }
    } else {
        showAlert('placeOrderAlert', 'error', `Maximum stock available: ${product.stock}`);
    }
}

function decreaseQuantity(productId) {
    const cartItem = store.getCart().find(item => item.productId === productId);
    
    if (cartItem && cartItem.quantity > 1) {
        const result = store.updateCartQuantity(productId, cartItem.quantity - 1);
        if (result.success) {
            updateCartDisplay();
        }
    } else {
        showAlert('placeOrderAlert', 'info', 'Minimum quantity is 1. Use Remove to delete item.');
    }
}

function updateCartItemQuantity(productId, quantity) {
    const result = store.updateCartQuantity(productId, parseInt(quantity));
    
    if (result.success) {
        updateCartDisplay();
    } else {
        showAlert('placeOrderAlert', 'error', result.message);
        updateCartDisplay();
    }
}

function removeFromCart(productId) {
    if (store.removeFromCart(productId)) {
        showAlert('placeOrderAlert', 'success', 'Item removed from cart');
        updateCartDisplay();
    }
}

function clearCart() {
    if (confirm('Are you sure you want to clear the cart?')) {
        store.clearCart();
        updateCartDisplay();
        showAlert('placeOrderAlert', 'success', 'Cart cleared');
    }
}

function confirmOrder() {
    if (store.getCart().length === 0) {
        showAlert('placeOrderAlert', 'error', 'Cart is empty');
        return;
    }
    
    const result = store.placeOrder();
    
    if (result.success) {
        showAlert('placeOrderAlert', 'success', `Order #${result.order.orderId} placed successfully! Total: ${formatCurrency(result.order.totalAmount)}`);
        updateCartDisplay();
        displayProductsForOrder();
    } else {
        showAlert('placeOrderAlert', 'error', result.message);
    }
}

function displayCustomerOrders() {
    const user = store.getCurrentUser();
    const orders = store.getCustomerOrders(user.username);
    
    if (orders.length === 0) {
        document.getElementById('customerOrdersList').innerHTML = `
            <div class="alert alert-info">You haven't placed any orders yet</div>
        `;
        return;
    }
    
    let html = '';
    
    orders.forEach(order => {
        let itemsHTML = '';
        order.items.forEach(item => {
            itemsHTML += `<li>${item.product.name} x ${item.quantity} - ${formatCurrency(item.product.price * item.quantity)}</li>`;
        });
        
        html += `
            <div class="order-details">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 15px;">
                    <div>
                        <h4>Order #${order.orderId}</h4>
                        <p><strong>Date:</strong> ${order.orderDate.toLocaleString()}</p>
                        <span class="status-badge status-${order.status.toLowerCase()}">${order.status}</span>
                    </div>
                    <div style="text-align: right;">
                        <p style="font-size: 1.5em; font-weight: bold; color: #667eea;">${formatCurrency(order.totalAmount)}</p>
                    </div>
                </div>
                <div style="background: white; padding: 15px; border-radius: 5px; border: 1px solid #ddd;">
                    <strong>Items:</strong>
                    <ul style="margin: 10px 0; padding-left: 20px;">
                        ${itemsHTML}
                    </ul>
                </div>
            </div>
        `;
    });
    
    document.getElementById('customerOrdersList').innerHTML = html;
}

// ==================== MODAL FUNCTIONS ====================

function closeModal(modalId) {
    document.getElementById(modalId).classList.remove('active');
}

window.onclick = function(event) {
    if (event.target.classList.contains('modal')) {
        event.target.classList.remove('active');
    }
}

// ==================== INITIALIZATION ====================

document.addEventListener('DOMContentLoaded', function() {
    const passwordField = document.getElementById('password');
    const usernameField = document.getElementById('username');
    
    if (passwordField) {
        passwordField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
    
    if (usernameField) {
        usernameField.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                login();
            }
        });
    }
    
    console.log('City Electronics Management System Initialized');
    console.log('Total Products:', store.getAllProducts().length);
    console.log('Total Users:', store.users.length);
});