import { test, expect } from "@playwright/test";
import { store } from "../lib/store"; // Update this path if necessary
import { LANG } from "@/constants";

// Reset the store before each test
test.beforeEach(() => {
  store.clearCart();
});

test("addToCart should add a new item to the cart", async ({ page }) => {
  await page.route("**/products/1", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 1,
        title: "Test Product",
        price: 9.99,
        stock: 5,
        images: [],
      }),
    })
  );

  await store.addToCart(1, 2);
  const cartDetails = store.getCartDetails();

  expect(cartDetails.carts).toHaveLength(1);
  expect(cartDetails.carts[0].product.id).toBe(1);
  expect(cartDetails.carts[0].quantity).toBe(2);
  expect(cartDetails.total).toBeCloseTo(19.98, 2);
});

test("addToCart should update quantity if item already exists", async ({
  page,
}) => {
  await page.route("**/products/1", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 1,
        title: "Test Product",
        price: 9.99,
        stock: 5,
        images: [],
      }),
    })
  );

  await store.addToCart(1, 2);
  await store.addToCart(1, 1);
  const cartDetails = store.getCartDetails();

  expect(cartDetails.carts).toHaveLength(1);
  expect(cartDetails.carts[0].quantity).toBe(3);
  expect(cartDetails.total).toBeCloseTo(29.97, 2);
});

test("addToCart should throw an error if quantity exceeds stock", async ({
  page,
}) => {
  await page.route("**/products/1", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 1,
        title: "Test Product",
        price: 10,
        stock: 5,
        images: [],
      }),
    })
  );

  await expect(store.addToCart(1, 6)).rejects.toThrow(
    LANG.QUANTITY_EXCEEDED_ERR_MESSAGE
  );
});

test("removeFromCart should remove an item from the cart", async ({ page }) => {
  await page.route("**/products/1", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 1,
        title: "Test Product",
        price: 10,
        stock: 5,
        images: [],
      }),
    })
  );

  await store.addToCart(1, 2);
  const result = store.removeFromCart(1);

  expect(result.type).toBe("success");
  expect(store.getCartDetails().carts).toHaveLength(0);
});

test("clearCart should empty the cart", async ({ page }) => {
  await page.route("**/products/1", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 1,
        title: "Test Product",
        price: 10,
        stock: 5,
        images: [],
      }),
    })
  );

  await store.addToCart(1, 2);
  store.clearCart();

  expect(store.getCartDetails().carts).toHaveLength(0);
  expect(store.getCartDetails().total).toBe(0);
});

test("checkout should create an order and clear the cart", async ({ page }) => {
  await page.route("**/products/1", (route) =>
    route.fulfill({
      status: 200,
      body: JSON.stringify({
        id: 1,
        title: "Test Product",
        price: 9.99,
        stock: 5,
        images: [],
      }),
    })
  );

  await store.addToCart(1, 2);
  const order = store.checkout();

  expect(order.items).toHaveLength(1);
  expect(order.total).toBeCloseTo(19.98, 2);
  expect(store.getCartDetails().carts).toHaveLength(0);
});

