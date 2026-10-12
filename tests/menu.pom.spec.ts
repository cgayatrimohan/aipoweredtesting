import { test, expect } from '@playwright/test';
import { MenuPage } from './pages/menu.page';

test.describe('Menu', () => {
  test.beforeEach(async ({ page }) => {
    await new MenuPage(page).goto();
  });

  test('page loads with 5 pizza items', async ({ page }) => {
    const menu = new MenuPage(page);
    await expect(menu.menuItems).toHaveCount(5);

    // Each item should have a visible h3 heading
    const headings = menu.menuItems.locator('h3');
    await expect(headings).toHaveCount(5);
    for (const heading of await headings.all()) {
      await expect(heading).toBeVisible();
      await expect(heading).not.toBeEmpty();
    }

    // Each item should have an image
    await expect(menu.menuItems.locator('img')).toHaveCount(5);
  });

  test('cart is initially empty', async ({ page }) => {
    const menu = new MenuPage(page);
    await expect(menu.emptyCartMessage).toBeVisible();
    await expect(menu.totalItems).toHaveText('0');
  });

  test('increment quantity increases item count', async ({ page }) => {
    const menu = new MenuPage(page);
    const quantityDisplay = menu.itemQuantity(0);

    await expect(quantityDisplay).toHaveText('0');
    await menu.incrementItem(0);
    await expect(quantityDisplay).toHaveText('1');
  });

  test('decrement at zero has no effect', async ({ page }) => {
    const menu = new MenuPage(page);
    const quantityDisplay = menu.itemQuantity(0);

    await expect(quantityDisplay).toHaveText('0');
    await menu.decrementItem(0);
    await expect(quantityDisplay).toHaveText('0');
  });

  test('increment then decrement returns count to zero', async ({ page }) => {
    const menu = new MenuPage(page);
    const quantityDisplay = menu.itemQuantity(0);

    await expect(quantityDisplay).toHaveText('0');
    await menu.incrementItem(0);
    await expect(quantityDisplay).toHaveText('1');
    await menu.decrementItem(0);
    await expect(quantityDisplay).toHaveText('0');
  });

  test('cart total reflects added quantities', async ({ page }) => {
    const menu = new MenuPage(page);

    await menu.incrementItem(0);
    await menu.incrementItem(0);
    await menu.incrementItem(1);

    await expect(menu.totalItems).toHaveText('3');
    await expect(menu.emptyCart).not.toBeVisible();
  });
});