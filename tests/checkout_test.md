# Checkout Test

## Step 1: Open the store
Open http://localhost:4173 and verify the page loads with the store title visible.

## Step 2: Add product to cart
Click "Add to Cart" on the first product (Product 1) and confirm it appears in the cart list.

## Step 3: Apply coupon
Enter "SAVE10" in the coupon code field and click "Apply". Verify the success message "Coupon SAVE10 applied" appears and the discount line is shown.

## Step 4: Verify discount
Read the 'Total:' line in the cart. Confirm it reads exactly $26.99 (the original $29.99 minus 10%). The total must be $26.99, not $29.99 — do not infer the discount from the discount line alone; check the Total value itself.

## Step 5: Proceed to checkout
Click the "Checkout" button and verify the confirmation section becomes visible.

## Step 6: Verify confirmation
Confirm the order confirmation message "Order Confirmed!" and "Thank you for your purchase." are displayed.
