// Kane's Corner Store logic
// v2 (19 Nov 2026): coupon bug FIXED — Kane run 1 failed on it
// ("Total remains $29.99 despite SAVE10"), fix applied per Kane's
// failing-step remark: updateTotalDisplay() is now called from
// applyCoupon() after setting discountAmount, and updateCartDisplay()
// routes through updateTotalDisplay(). Total after SAVE10: $26.99.

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
    cart.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `<span>Product ${item.id}</span><span>$${item.price.toFixed(2)}</span>`;
        itemsDiv.appendChild(div);
    });
    // v2 fix: total display goes through updateTotalDisplay(),
    // the single source of truth that subtracts discountAmount.
    updateTotalDisplay();
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
        // v2 fix (Kane run 1 remark): recalculate the displayed total
        // now that discountAmount is set, so Total drops to $26.99.
        updateTotalDisplay();
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
