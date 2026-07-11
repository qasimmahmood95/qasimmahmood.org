import { defineConfig, devices } from "@playwright/test";

// Run against a deployed site with e.g.:
//   BASE_URL=https://qasimmahmood-org.pages.dev npm test
const baseURL = process.env.BASE_URL || "http://localhost:8123";

export default defineConfig({
  testDir: "tests",
  fullyParallel: true,
  reporter: "list",
  use: {
    baseURL,
  },
  webServer: process.env.BASE_URL ? undefined : {
    command: "npx -y serve -l 8123 .",
    url: "http://localhost:8123",
    reuseExistingServer: true,
  },
  projects: [
    { name: "chromium", use: { ...devices["Desktop Chrome"] } },
    { name: "firefox", use: { ...devices["Desktop Firefox"] } },
    { name: "webkit", use: { ...devices["Desktop Safari"] } },
  ],
});
