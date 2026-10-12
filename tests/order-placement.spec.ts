import { test, expect } from '@playwright/test';

test.describe('Order placement', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('http://localhost:3000/');
    await page.locator('.menu-item').first().waitFor();
  });

  test('Place Order is disabled when the cart is empty', async ({ page }) => {
    await expect(page.getByRole('button', { name: 'Place Order' })).toBeDisabled();
    await expect(page.getByText('Your cart is empty')).toBeVisible();
  });

  test('requires a customer name before placing an order', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();

    const placeOrderButton = page.getByRole('button', { name: 'Place Order' });
    await expect(placeOrderButton).toBeDisabled();
    await expect(page.locator('#total-items')).toHaveText('1');
    await expect(page.getByText('Your cart is empty')).not.toBeVisible();

    await page.getByRole('textbox', { name: 'Your Name:' }).fill('Taylor Tester');
    await expect(placeOrderButton).toBeEnabled();
  });

  test('places an order and displays its receipt and order ID', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByRole('textbox', { name: 'Your Name:' }).fill('Taylor Tester');
    await page.getByRole('button', { name: 'Place Order' }).click();

    const confirmation = page.getByText(/Order placed successfully! Order ID:/i);
    await expect(confirmation).toBeVisible();
    await expect(page.getByText('Taylor Tester', { exact: true })).toBeVisible();
    await expect(page.getByText('RECEIVED', { exact: true })).toBeVisible();

    const confirmationText = await confirmation.textContent();
    const orderId = confirmationText?.match(/order-[\w-]+/)?.[0];
    expect(orderId).toBeTruthy();
    await expect(page.getByText(orderId!, { exact: true })).toBeVisible();
  });

  test('clears the cart after a successful order', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByRole('textbox', { name: 'Your Name:' }).fill('Taylor Tester');
    await page.getByRole('button', { name: 'Place Order' }).click();

    await expect(page.getByText('Your cart is empty')).toBeVisible();
    await expect(page.locator('#total-items')).toHaveText('0');
    await expect(page.locator('.menu-item').first().locator('.quantity-display')).toHaveText('0');
  });
});