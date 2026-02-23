import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { InventoryPage } from '../pages/inventory.page';
import { CartPage } from '../pages/cart.page';

test.describe('Sauce Demo - Purchase flow', () => {

  const USER = 'standard_user';
  const PASS = 'secret_sauce';
  const ITEM = 'Sauce Labs Backpack';

  test('Given valid credentials, when logging in, then Products page is shown', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);

    await login.goto();
    await login.login(USER, PASS);

    await expect(page).toHaveURL(/inventory/);
    await inventory.assertLoaded();
  });

  test('Given invalid credentials, when logging in, then an error is displayed', async ({ page }) => {
    const login = new LoginPage(page);

    await login.goto();
    await login.login(USER, 'wrong_password');

    await login.assertLoginFailed();
  });

  test('Given a logged-in user, when adding an item, then cart count updates', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await login.goto();
    await login.login(USER, PASS);

    await inventory.addItemToCart(ITEM);
    await inventory.assertCartCount(1);

    await inventory.openCart();
    await cart.assertHasItem(ITEM);
  });

  test('Given an item in cart, when viewing checkout overview, then totals are correct', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await login.goto();
    await login.login(USER, PASS);

    const itemPrice = await inventory.getItemPrice(ITEM);

    await inventory.addItemToCart(ITEM);
    await inventory.openCart();

    await cart.startCheckout();
    await cart.enterCheckoutDetails('Bob', 'Michael', 'SK9 0RL');

    const { itemTotal, tax, total } = await cart.getTotals();

    expect(itemTotal).toBe(itemPrice);
    expect(Number((itemTotal + tax).toFixed(2))).toBe(total);
  });

  test('Given checkout overview, when finishing, then confirmation is shown', async ({ page }) => {
    const login = new LoginPage(page);
    const inventory = new InventoryPage(page);
    const cart = new CartPage(page);

    await login.goto();
    await login.login(USER, PASS);

    await inventory.addItemToCart(ITEM);
    await inventory.openCart();

    await cart.startCheckout();
    await cart.enterCheckoutDetails('Bob', 'Michael', 'SK9 0RL');

    await cart.finish();
    await cart.assertCheckoutComplete();
  });

});