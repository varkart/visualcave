const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 60000,
  retries: 2,
  reporter: [['list'], ['html', { open: 'never', outputFolder: 'tests/report' }]],
  use: {
    baseURL: 'http://localhost:3000',
    screenshot: 'only-on-failure',
    actionTimeout: 45000,
  },
  webServer: {
    command: 'npx serve -s . -p 3000 --no-clipboard',
    port: 3000,
    timeout: 30000,
    reuseExistingServer: !process.env.CI,
  },
});
