import { chromium } from "@playwright/test";
import { writeFile } from "node:fs/promises";
const browser = await chromium.launch({ channel: "chrome" });
try {
  const page = await browser.newPage({
    viewport: { width: 390, height: 844 },
    deviceScaleFactor: 2,
    isMobile: true,
    hasTouch: true,
  });
  const external = [];
  await page.route("**/*", (route) => {
    if (new URL(route.request().url()).hostname === "127.0.0.1")
      return route.continue();
    external.push(route.request().url());
    return route.abort();
  });
  const cdp = await page.context().newCDPSession(page);
  await cdp.send("Network.enable");
  await cdp.send("Network.setCacheDisabled", { cacheDisabled: true });
  await cdp.send("Network.emulateNetworkConditions", {
    offline: false,
    latency: 80,
    downloadThroughput: 1250000,
    uploadThroughput: 375000,
  });
  await cdp.send("Emulation.setCPUThrottlingRate", { rate: 4 });
  let bytes = 0;
  cdp.on("Network.loadingFinished", (event) => {
    bytes += event.encodedDataLength;
  });
  await page.addInitScript(() => {
    window.mobileMetrics = { lcp: 0, cls: 0 };
    new PerformanceObserver((list) => {
      for (const e of list.getEntries()) window.mobileMetrics.lcp = e.startTime;
    }).observe({ type: "largest-contentful-paint", buffered: true });
    new PerformanceObserver((list) => {
      for (const e of list.getEntries())
        if (!e.hadRecentInput) window.mobileMetrics.cls += e.value;
    }).observe({ type: "layout-shift", buffered: true });
  });
  await page.goto("http://127.0.0.1:3147/");
  await page.waitForLoadState("networkidle");
  await page.waitForTimeout(1000);
  const metrics = await page.evaluate(() => window.mobileMetrics);
  const report = {
    browser: browser.version(),
    profile:
      "390x844 DPR 2, 10 Mbps down, 80 ms latency, 4x CPU slowdown, fresh browser cache, localhost production",
    bytes,
    ...metrics,
    external,
  };
  await page.getByLabel("Show Knit Polo", { exact: true }).click();
  if ((await page.locator(".dossier h2").textContent()) !== "Knit Polo")
    throw Error("Selection failed");
  await writeFile(
    "evidence/focus-performance.json",
    JSON.stringify(report, null, 2),
  );
  console.log(report);
} finally {
  await browser.close();
}
