import { Page, Locator, expect } from '@playwright/test';

export class InventoryPage {
  private readonly page: Page;

  readonly pageTitle: Locator;
  readonly cartBadge: Locator;

  constructor(page: Page) {
    this.page = page;

    this.pageTitle = page.getByText('Products');
    this.cartBadge = page.locator('.shopping_cart_badge');
  }

  async assertLoaded() {
    await expect(this.pageTitle).toBeVisible();
  }

  async addItemToCart(itemName: string) {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.getByText(itemName),
    });

    await item.getByRole('button', { name: 'Add to cart' }).click();
  }

  async assertCartCount(count: number) {
    await expect(this.cartBadge).toHaveText(String(count));
  }

  async openCart() {
    await this.page.locator('.shopping_cart_link').click();
  }

  async getItemPrice(itemName: string): Promise<number> {
    const item = this.page.locator('.inventory_item').filter({
      has: this.page.getByText(itemName),
    });

    const priceText = await item.locator('.inventory_item_price').innerText();
    return Number(priceText.replace('$', ''));
  }
}