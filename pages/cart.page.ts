import { Page, Locator, expect } from '@playwright/test';

export class CartPage {
  private readonly page: Page;

  readonly cartItemNames: Locator;
  readonly checkoutButton: Locator;

  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly postalCodeInput: Locator;
  readonly continueButton: Locator;

  readonly subtotalLabel: Locator;
  readonly taxLabel: Locator;
  readonly totalLabel: Locator;
  readonly finishButton: Locator;

  readonly confirmationHeader: Locator;

  constructor(page: Page) {
    this.page = page;

    this.cartItemNames = page.locator('.inventory_item_name');
    this.checkoutButton = page.getByRole('button', { name: 'Checkout' });

    this.firstNameInput = page.getByPlaceholder('First Name');
    this.lastNameInput = page.getByPlaceholder('Last Name');
    this.postalCodeInput = page.getByPlaceholder('Zip/Postal Code');
    this.continueButton = page.getByRole('button', { name: 'Continue' });

    this.subtotalLabel = page.locator('.summary_subtotal_label');
    this.taxLabel = page.locator('.summary_tax_label');
    this.totalLabel = page.locator('.summary_total_label');
    this.finishButton = page.getByRole('button', { name: 'Finish' });

    this.confirmationHeader = page.locator('.complete-header');
  }

  async assertHasItem(itemName: string) {
    await expect(this.cartItemNames).toContainText([itemName]);
  }

  async startCheckout() {
    await this.checkoutButton.click();
    await expect(this.page).toHaveURL(/checkout-step-one/);
  }

  async enterCheckoutDetails(first: string, last: string, postcode: string) {
    await this.firstNameInput.fill(first);
    await this.lastNameInput.fill(last);
    await this.postalCodeInput.fill(postcode);
    await this.continueButton.click();
    await expect(this.page).toHaveURL(/checkout-step-two/);
  }

  private parseMoney(text: string): number {
    const match = text.match(/\$([0-9]+\.[0-9]{2})/);
    if (!match) throw new Error(`Unable to parse money from: ${text}`);
    return Number(match[1]);
  }

  async getTotals(): Promise<{ itemTotal: number; tax: number; total: number }> {
    const itemTotal = this.parseMoney(await this.subtotalLabel.innerText());
    const tax = this.parseMoney(await this.taxLabel.innerText());
    const total = this.parseMoney(await this.totalLabel.innerText());
    return { itemTotal, tax, total };
  }

  async finish() {
    await this.finishButton.click();
    await expect(this.page).toHaveURL(/checkout-complete/);
  }

  async assertCheckoutComplete() {
    await expect(this.confirmationHeader).toBeVisible();
    await expect(this.confirmationHeader).toContainText('Thank you');
  }
}