import { test, expect } from '@playwright/test';

test.describe('Order lookup', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('http://localhost:3000/');
    await page.getByRole('heading', { name: 'Order Management' }).waitFor();
  });

  test('looks up a valid order ID and displays the order details', async ({ page }) => {
    await page.locator('.menu-item').first().getByRole('button', { name: '+' }).click();
    await page.getByRole('textbox', { name: 'Your Name:' }).fill('Lookup Tester');
    await page.getByRole('button', { name: 'Place Order' }).click();

    const confirmation = page.getByText(/Order placed successfully! Order ID:/i);
    await expect(confirmation).toBeVisible();
    const orderId = (await confirmation.textContent())?.match(/order-[\w-]+/)?.[0];
    expect(orderId).toBeTruthy();

    await page.getByRole('textbox', { name: 'Order ID:' }).fill(orderId!);
    await page.getByRole('button', { name: 'Look Up Order' }).click();

    await expect(page.getByText('Order found', { exact: true })).toBeVisible();
    await expect(page.getByText(orderId!, { exact: true })).toBeVisible();
    await expect(page.getByText('Lookup Tester', { exact: true })).toBeVisible();
    await expect(page.getByText('RECEIVED', { exact: true })).toBeVisible();
    await expect(page.getByText('Margherita Pizza', { exact: true }).first()).toBeVisible();
  });

  test('shows a not-found message for an unknown order ID', async ({ page }) => {
    await page.getByRole('textbox', { name: 'Order ID:' }).fill('order-does-not-exist');
    await page.getByRole('button', { name: 'Look Up Order' }).click();

    await expect(
      page.getByText("Order not found: Order with ID 'order-does-not-exist' not found", {
        exact: true,
      }),
    ).toBeVisible();
  });

  test('shows a validation message when the order ID is empty', async ({ page }) => {
    await page.getByRole('button', { name: 'Look Up Order' }).click();

    await expect(page.getByText('Please enter an order ID', { exact: true })).toBeVisible();
  });
});