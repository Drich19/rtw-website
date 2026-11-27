import { defineConfig } from "@playwright/test";
const port = Number(process.env.RTW_TEST_PORT ?? 3147);
const baseURL = "http://127.0.0.1:" + port;
export default defineConfig({
  testDir: "./tests",
  workers: 1,
  timeout: 90000,
  use: {
    channel: "chrome",
    baseURL,
    trace: "retain-on-failure",
  },
  webServer: {
    command: "npm run start -- --hostname 127.0.0.1 --port " + port,
    url: baseURL,
    reuseExistingServer: true,
  },
});
