# RTW Archive

A classroom ready-to-wear storefront built with Next.js, React, TypeScript, Tailwind CSS and shadcn/ui components. Browse ten garments, explore the Archive Rack and Four in Frame lookbook, choose a size, and complete a simulated checkout. The bag is stored in the current browser.

## Run locally

Use Node 24 and npm. On Windows, run these commands from the project folder:

```powershell
npm.cmd ci
npm.cmd run dev
```

Open the local URL printed by Next.js. For a production build, run `npm.cmd run build`, then `npm.cmd start`.

## Classroom campaign images

The download includes all ten garment images in `public/images` and all four finished lookbook images in `public/campaign`. On the classroom PC, extract the ZIP, open the folder containing `package.json`, and follow the two commands above.

Font and component notices are in `public/licenses`. Dependency versions are pinned in `package-lock.json`. All accounts and orders are simulated. Use fictional details.

## Verify

Use `npm.cmd run lint` and `npm.cmd run typecheck`. For browser tests, install Google Chrome, run `npm.cmd run build`, then `npm.cmd test`. The tests use port 3147 by default. Choose a free port using `RTW_TEST_PORT` if needed.

## Phone development preview

On a trusted Wi-Fi network, `npm.cmd run dev:lan` serves the app on port 3148. Open the computer's private Wi-Fi IPv4 address using HTTP from the phone. For hot reload on a different classroom network, update the specific LAN address in `allowedDevOrigins` in `next.config.mjs`.
