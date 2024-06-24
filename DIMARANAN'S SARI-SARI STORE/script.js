function initializeStockCounts() {
    let products = document.querySelectorAll('.detail-card');
    
    products.forEach(product => {
        let productId = product.getAttribute('id');
        let stockCount = localStorage.getItem(`stock_${productId}`);
        
        if (stockCount === null) {
            stockCount = 10;
        } else {
            stockCount = parseInt(stockCount);
        }
        
        let stockSpan = product.querySelector('.stock span');
        if (stockSpan) {
            stockSpan.textContent = stockCount;
        }
        
        let addStockButton = product.querySelector('.add-to-stock');
        if (addStockButton) {
            addStockButton.addEventListener('click', handleAddStock);
        }
        
        let addToCartButton = product.querySelector('.add-to-cart');
        if (addToCartButton) {
            addToCartButton.addEventListener('click', function() {
                handleAddToCart(productId, stockSpan);
                updateCartUI(); 
            });
        }
    });
}

function handleAddStock() {
    let productCard = this.closest('.detail-card');
    let productId = productCard.getAttribute('id');
    
    let stockSpan = productCard.querySelector('.stock span');
    let currentStock = parseInt(stockSpan.textContent);
    let newStock = currentStock + 1;
    
    stockSpan.textContent = newStock;
    
    localStorage.setItem(`stock_${productId}`, newStock.toString());
}

function handleAddToCart(productId, stockSpan) {
    let currentStock = parseInt(stockSpan.textContent);
    
    if (currentStock > 0) {
        let newStock = currentStock - 1;
        
        stockSpan.textContent = newStock;
        
        localStorage.setItem(`stock_${productId}`, newStock.toString());
        
        addToCart(productId);

        updateCartUI();
    } else {
        alert('Out of stock!');
    }
}

function addToCart(productId) {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    if (cart[productId]) {
        cart[productId]++;
    } else {
        cart[productId] = 1;
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
}

function updateCartUI() {
    let cart = JSON.parse(localStorage.getItem('cart')) || {};
    let cartSection = document.querySelector('.main-bills .cart');
    
    cartSection.innerHTML = '';
    
    Object.keys(cart).forEach(productId => {
        let item = document.createElement('div');
        item.textContent = `Product ${productId}: Quantity ${cart[productId]}`;
        cartSection.appendChild(item);
    });
}

document.addEventListener('DOMContentLoaded', function() {
    initializeStockCounts();
    updateCartUI(); 
});

document.addEventListener('DOMContentLoaded', function () {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    const cartItemsContainer = document.querySelector('.cart-items');
    const billsItemsContainer = document.querySelector('.bills-items');
    const totalReceipt = document.querySelector('.total-receipt');
    const calculateChangeBtn = document.querySelector('.calculate-change');
    const paymentInput = document.getElementById('payment');
    const closeBillsBtn = document.querySelector('.close-bills');
    const discountSelect = document.getElementById('discount-select');

    let cartItems = [];

    function updateCartView() {
        cartItemsContainer.innerHTML = '';
        cartItems.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.classList.add('cart-item');
            cartItem.innerHTML = `
                <p>${item.name}</p>
                <p>Price: P${item.price.toFixed(2)}</p>
                <p>Quantity: ${item.quantity}</p>
                <hr>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const detailCard = button.closest('.detail-card');
            const itemName = detailCard.querySelector('.detail-name h3').textContent.trim();
            const itemPrice = parseFloat(detailCard.querySelector('.price').textContent.replace('P', '').trim());
            const itemQuantity = 1; 

            const existingItem = cartItems.find(item => item.name === itemName);
            if (existingItem) {
                existingItem.quantity += itemQuantity; 
            } else {
                cartItems.push({ name: itemName, price: itemPrice, quantity: itemQuantity });
            }

            updateCartView();
        });
    });

    calculateChangeBtn.addEventListener('click', () => {
        const totalAmount = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
        const paymentAmount = parseFloat(paymentInput.value);

        if (isNaN(paymentAmount)) {
            alert('Please enter a valid payment amount.');
            return;
        }

        const selectedDiscount = parseFloat(discountSelect.value);
        const discountAmount = totalAmount * selectedDiscount;
        const discountedTotal = totalAmount - discountAmount;

        const changeAmount = paymentAmount - discountedTotal;

        totalReceipt.textContent = `Total: P${discountedTotal.toFixed(2)}`;
        document.querySelector('.discount-receipt').textContent = `Discount: P${discountAmount.toFixed(2)}`;
        document.querySelector('.change-receipt').textContent = `Change: P${changeAmount.toFixed(2)}`;
    });

    closeBillsBtn.addEventListener('click', () => {
        cartItems = []; 
        updateCartView(); 
        paymentInput.value = '';
        totalReceipt.textContent = 'Total: P0.00';
        document.querySelector('.discount-receipt').textContent = 'Discount: P0.00';
        document.querySelector('.change-receipt').textContent = 'Change: P0.00';
    });
});
