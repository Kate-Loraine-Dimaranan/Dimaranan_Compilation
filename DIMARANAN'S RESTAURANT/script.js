document.addEventListener("DOMContentLoaded", function() {
    const menuItems = document.querySelectorAll(".detail-card");
    const cartItems = document.querySelector(".cart-items");
    const totalDisplay = document.querySelector(".total");
    const cartDiv = document.querySelector(".main-bills");

    const closeBillsButton = document.querySelector('.close-bills');
    closeBillsButton.addEventListener('click', function() {
        document.querySelector('.main-bills').style.display = 'none';
    });

    let cart = [];

    menuItems.forEach(item => {
        item.addEventListener("click", function() {
            const name = item.querySelector(".detail-name h3").textContent;
            const price = parseFloat(item.querySelector(".price").textContent.replace("P", ""));
            const existingItem = cart.find(cartItem => cartItem.name === name);

            if (existingItem) {
                existingItem.quantity++;
                existingItem.total = existingItem.quantity * price;
            } else {
                cart.push({
                    name: name,
                    price: price,
                    quantity: 1,
                    total: price
                });
            }

            renderCart();
            renderBills();
        });
    });

    function renderCart() {
    cartItems.innerHTML = "";
    let totalPrice = 0;

    cart.forEach(item => {
        const cartItemElement = document.createElement("div");
        cartItemElement.classList.add("cart-item");
        cartItemElement.innerHTML = `
            <p>${item.name}</p>
            <div class="quantity">
                <button class="minus">-</button>
                <span>${item.quantity}</span>
                <button class="add">+</button>
            </div>
            <p>P${item.total.toFixed(2)}</p>
            <button class="remove-item"></button>
        `;
        cartItems.appendChild(cartItemElement);
        totalPrice += item.total;
    });

    totalDisplay.textContent = `Total: P${totalPrice.toFixed(2)}`;

    if (cart.length > 0) {
        cartDiv.style.display = "block";
    } else {
        cartDiv.style.display = "none";
    }
}

    function renderBills() {
        const billsItems = document.querySelector(".bills-items");
        billsItems.innerHTML = "";

        cart.forEach(item => {
            const billItem = document.createElement("div");
            billItem.classList.add("bill-item");
            billItem.innerHTML = `
                <p>${item.name} x ${item.quantity}</p>
                <p>P${item.total.toFixed(2)}</p>
            `;
            billsItems.appendChild(billItem);
        });
    }

    cartItems.addEventListener("click", function(event) {
        if (event.target.classList.contains("add")) {
            const itemName = event.target.parentElement.parentElement.querySelector("p").textContent;
            const selectedItem = cart.find(item => item.name === itemName);
            selectedItem.quantity++;
            selectedItem.total = selectedItem.quantity * selectedItem.price;
            renderCart();
            renderBills();
        }

        if (event.target.classList.contains("minus")) {
            const itemName = event.target.parentElement.parentElement.querySelector("p").textContent;
            const selectedItem = cart.find(item => item.name === itemName);
            if (selectedItem.quantity > 1) {
                selectedItem.quantity--;
                selectedItem.total = selectedItem.quantity * selectedItem.price;
                renderCart();
                renderBills();
            } else {
                cart = cart.filter(item => item.name !== itemName);
                renderCart();
                renderBills();
            }
        }

        if (event.target.classList.contains("remove-item")) {
            const itemName = event.target.parentElement.querySelector("p").textContent;
            cart = cart.filter(item => item.name !== itemName);
            renderCart();
            renderBills();
        }
    });
});
