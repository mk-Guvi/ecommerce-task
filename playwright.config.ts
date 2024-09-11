import { defineConfig } from 'playwright/test';

export default defineConfig({
  testDir: './tests',
  timeout: 30000,
  use: {
    headless: false, // Set to true if you want to run tests in headless mode
    baseURL: 'http://localhost:3000', // Update this to your local dev server
    viewport: { width: 1280, height: 620 },
  },
});
