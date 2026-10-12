import type { Locator, Page } from '@playwright/test';

export class MenuPage {
  readonly page: Page;
  readonly menuItems: Locator;
  readonly totalItems: Locator;
  readonly emptyCartMessage: Locator;
  readonly emptyCart: Locator;

  constructor(page: Page) {
    this.page = page;
    this.menuItems = page.locator('.menu-item');
    this.totalItems = page.locator('#total-items');
    this.emptyCartMessage = page.getByText('Your cart is empty');
    this.emptyCart = page.locator('.empty-cart');
  }

  async goto() {
    await this.page.addInitScript(() => localStorage.clear());
    await this.page.goto('http://localhost:3000/');
    await this.menuItems.first().waitFor();
  }

  itemQuantity(index: number) {
    return this.menuItems.nth(index).locator('.quantity-display');
  }

  async incrementItem(index: number) {
    await this.menuItems.nth(index).getByRole('button', { name: '+' }).click();
  }

  async decrementItem(index: number) {
    await this.menuItems.nth(index).getByRole('button', { name: '−' }).click();
  }
}