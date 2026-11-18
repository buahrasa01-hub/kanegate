// Kane's Corner Store logic
// SEEDED BUG (v1, intentional — Kane run 1 must FAIL on it):
// applying coupon SAVE10 shows the success message and the discount line,
// but the cart total is NEVER reduced. The fix (v2) is to call
// updateTotalDisplay() from applyCoupon() after setting discountAmount,
// and to route updateCartDisplay() through updateTotalDisplay() too.

const cart = [];
let couponApplied = false;
let discountAmount = 0;

// Product add to cart
function addToCart(event) {
    const product = event.target.closest('.product');
    const id = product.dataset.id;
    const price = parseFloat(product.dataset.price);
    cart.push({ id, price });
    updateCartDisplay();
}

// Update cart display
function updateCartDisplay() {
    const itemsDiv = document.getElementById('cart-items');
    itemsDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        total += item.price;
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span>Product ${item.id}</span><span>$${item.price.toFixed(2)}</span>`;
        itemsDiv.appendChild(div);
    });
    // BUG (v1): total display ignores discountAmount — always the raw sum.
    document.getElementById('cart-total').textContent = `Total: $${total.toFixed(2)}`;
}

// Apply coupon
function applyCoupon() {
    const couponInput = document.getElementById('coupon');
    const couponMessage = document.getElementById('coupon-message');
    const discountDisplay = document.getElementById('discount-display');
    const code = couponInput.value.trim();

    if (code === 'SAVE10' && !couponApplied) {
        couponApplied = true;
        // Calculate discount (10% off total)
        const total = cart.reduce((sum, item) => sum + item.price, 0);
        discountAmount = total * 0.1;
        // Show success message
        couponMessage.textContent = 'Coupon SAVE10 applied';
        couponMessage.classList.remove('hidden');
        // Show discount line with the real discount amount
        discountDisplay.textContent = `Discount: -$${discountAmount.toFixed(2)}`;
        discountDisplay.classList.remove('hidden');
        // BUG (v1): updateTotalDisplay() is deliberately NOT called here,
        // so the total stays at the raw sum even though the discount line shows.
    } else if (code === '' && couponApplied) {
        // Reset coupon
        couponApplied = false;
        discountAmount = 0;
        couponMessage.classList.add('hidden');
        discountDisplay.classList.add('hidden');
        updateTotalDisplay();
    } else if (code !== 'SAVE10') {
        couponMessage.classList.add('hidden');
    }
}

// Helper: the single source of truth for the total display (used by the v2 fix).
function updateTotalDisplay() {
    const total = cart.reduce((sum, item) => sum + item.price, 0);
    const finalTotal = total - discountAmount;
    document.getElementById('cart-total').textContent = `Total: $${finalTotal.toFixed(2)}`;
}

// Checkout
function checkout() {
    if (cart.length === 0) return;
    document.getElementById('cart').classList.add('hidden');
    document.getElementById('confirmation').classList.remove('hidden');
}

// Event listeners
document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.add-to-cart').forEach(btn => {
        btn.addEventListener('click', addToCart);
    });
    document.getElementById('apply-coupon').addEventListener('click', applyCoupon);
    document.getElementById('checkout').addEventListener('click', checkout);
});
