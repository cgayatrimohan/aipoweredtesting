import { test, expect } from '@playwright/test';

test.describe('Theme', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => localStorage.clear());
    await page.goto('http://localhost:3000/');
  });

  test('can toggle to dark theme', async ({ page }) => {
    const themeToggle = page.getByRole('button', { name: 'Toggle dark theme' });

    await expect(themeToggle).toHaveText('🌙');
    await themeToggle.click();
    await expect(themeToggle).toHaveText('☀️');
  });
});