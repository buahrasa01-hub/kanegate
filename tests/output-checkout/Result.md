---
test: ../checkout_test.md
status: passed
started: 2026-11-18T12:24:41.112Z
duration_s: 159
session_id: fe98b746-f465-4507-8c67-5c3bf9b87525
---

# Checkout Test — Result

## Step 1: Open the store ✓ passed (0.87s)
md5: def4b640b78c1a8db1bad183e982c25e
Open http://localhost:4173 and verify the page loads with the store title visible.

## Step 2: Add product to cart ✓ passed (1.28s)
md5: b62520e8de027b35ed4b36b0fd0a8968
Click "Add to Cart" on the first product (Product 1) and confirm it appears in the cart list.

## Step 3: Apply coupon ✓ passed (45.3s)
md5: 68fa645ff538af0d3b2366a5b19445cc
Enter "SAVE10" in the coupon code field and click "Apply". Verify the success message "Coupon SAVE10 applied" appears and the discount line is shown.

## Step 4: Verify discount ✓ passed (30.6s)
md5: a173a78e9554a78cc77c601b06f15f36
Read the 'Total:' line in the cart. Confirm it reads exactly $26.99 (the original $29.99 minus 10%). The total must be $26.99, not $29.99 — do not infer the discount from the discount line alone; check the Total value itself.

## Step 5: Proceed to checkout ✓ passed (21.7s)
md5: 287a1d77a5d43d0c24325ed7870041f9
Click the "Checkout" button and verify the confirmation section becomes visible.

## Step 6: Verify confirmation ✓ passed (18.4s)
md5: 7c1a08393ef0d6a30c2da0cdb45bea57
Confirm the order confirmation message "Order Confirmed!" and "Thank you for your purchase." are displayed.
