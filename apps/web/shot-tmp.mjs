import { chromium } from "@playwright/test";
const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1280, height: 800 } });
await p.goto("http://localhost:3000/fa");
await p.locator("section", { has: p.locator("#how-it-works-title") }).screenshot({ path: "/private/tmp/claude-501/-Users-arminbasirian-projects-mafan-studio/ab810c5b-dae2-48af-af4e-424086404086/scratchpad/fa-d-how2.png" });
await p.close();
