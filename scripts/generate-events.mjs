#!/usr/bin/env node
/**
 * Markov-chain e-commerce traffic simulator.
 *
 * Drives Playwright sessions through a probabilistic funnel with
 * device-specific behaviour, referral-source simulation, and realistic
 * drop-off at every stage (~5-8 % overall conversion).
 *
 * Usage:
 *   npx playwright install chromium
 *   node scripts/generate-events.mjs [--base-url https://tea-leafs.com] [--rounds 2]
 */

import { chromium } from 'playwright';

// ---------------------------------------------------------------------------
// CLI args
// ---------------------------------------------------------------------------
const BASE_URL = process.argv.includes('--base-url')
  ? process.argv[process.argv.indexOf('--base-url') + 1]
  : 'https://tea-leafs.com';

const ROUNDS = process.argv.includes('--rounds')
  ? parseInt(process.argv[process.argv.indexOf('--rounds') + 1], 10)
  : 2;

const SESSIONS_PER_ROUND = 20;

// ---------------------------------------------------------------------------
// Customers (cycled for logged-in sessions)
// ---------------------------------------------------------------------------
const CUSTOMERS = [
  { email: 'maya.patel@example.com', first: 'Maya', last: 'Patel' },
  { email: 'jordan.ramirez@example.com', first: 'Jordan', last: 'Ramirez' },
  { email: 'olivia.kim@example.com', first: 'Olivia', last: 'Kim' },
  { email: 'marcus.johnson@example.com', first: 'Marcus', last: 'Johnson' },
  { email: 'zoe.thompson@example.com', first: 'Zoe', last: 'Thompson' },
  { email: 'ethan.nguyen@example.com', first: 'Ethan', last: 'Nguyen' },
];

// ---------------------------------------------------------------------------
// Device profiles (tagged with type for matrix selection)
// ---------------------------------------------------------------------------
const DEVICE_PROFILES = [
  { name: 'Desktop Chrome', type: 'desktop', viewport: { width: 1920, height: 1080 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
  { name: 'Desktop Safari', type: 'desktop', viewport: { width: 1440, height: 900 }, userAgent: 'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_3) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Safari/605.1.15' },
  { name: 'Laptop 1366', type: 'desktop', viewport: { width: 1366, height: 768 }, userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36' },
  { name: 'iPhone 14', type: 'mobile', viewport: { width: 390, height: 844 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
  { name: 'iPhone 14 Pro Max', type: 'mobile', viewport: { width: 428, height: 926 }, userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
  { name: 'Pixel 8', type: 'mobile', viewport: { width: 412, height: 915 }, userAgent: 'Mozilla/5.0 (Linux; Android 14; Pixel 8) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36' },
  { name: 'Samsung Galaxy S24', type: 'mobile', viewport: { width: 360, height: 800 }, userAgent: 'Mozilla/5.0 (Linux; Android 14; SM-S921B) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.6261.64 Mobile Safari/537.36' },
  { name: 'iPad Pro', type: 'mobile', viewport: { width: 1024, height: 1366 }, userAgent: 'Mozilla/5.0 (iPad; CPU OS 17_4 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.4 Mobile/15E148 Safari/604.1' },
];

const DESKTOP_DEVICES = DEVICE_PROFILES.filter((d) => d.type === 'desktop');
const MOBILE_DEVICES = DEVICE_PROFILES.filter((d) => d.type === 'mobile');

// ---------------------------------------------------------------------------
// Products
// ---------------------------------------------------------------------------
const PRODUCTS = [
  'dragon-well', 'gyokuro-supreme', 'earl-grey-royal', 'golden-yunnan',
  'iron-goddess', 'milk-oolong', 'silver-needle', 'moonlight-white',
  'chamomile-dreams', 'aged-pu-erh-reserve',
];

// ---------------------------------------------------------------------------
// Traffic sources
// ---------------------------------------------------------------------------
const TRAFFIC_SOURCES = [
  {
    name: 'Google Organic',
    weight: 0.35,
    utmParams: '',
    referer: 'https://www.google.com/',
    entryPoints: { HOMEPAGE: 0.30, PRODUCT_DETAIL: 0.55, PRODUCTS: 0.15 },
  },
  {
    name: 'Direct',
    weight: 0.25,
    utmParams: '',
    referer: '',
    entryPoints: { HOMEPAGE: 0.70, PRODUCT_DETAIL: 0.20, PRODUCTS: 0.10 },
  },
  {
    name: 'Facebook',
    weight: 0.15,
    utmParams: '?utm_source=facebook&utm_medium=paid_social&utm_campaign=spring_collection',
    referer: 'https://www.facebook.com/',
    entryPoints: { HOMEPAGE: 0.30, PRODUCT_DETAIL: 0.50, PRODUCTS: 0.20 },
  },
  {
    name: 'Instagram',
    weight: 0.10,
    utmParams: '?utm_source=instagram&utm_medium=paid_social&utm_campaign=spring_stories',
    referer: 'https://l.instagram.com/',
    entryPoints: { HOMEPAGE: 0.30, PRODUCT_DETAIL: 0.55, PRODUCTS: 0.15 },
  },
  {
    name: 'Email',
    weight: 0.10,
    utmParams: '?utm_source=email&utm_medium=email&utm_campaign=weekly_newsletter',
    referer: '',
    entryPoints: { HOMEPAGE: 0.15, PRODUCT_DETAIL: 0.70, PRODUCTS: 0.15 },
  },
  {
    name: 'Google Ads',
    weight: 0.05,
    utmParams: '?utm_source=google&utm_medium=cpc&utm_campaign=spring_tea_sale',
    referer: 'https://www.google.com/',
    entryPoints: { HOMEPAGE: 0.20, PRODUCT_DETAIL: 0.65, PRODUCTS: 0.15 },
  },
];

// ---------------------------------------------------------------------------
// Transition matrices — keyed by deviceType_loginStatus
// ---------------------------------------------------------------------------
const TRANSITIONS = {
  desktop_anonymous: {
    HOMEPAGE:       { PRODUCTS: 0.65, EXIT: 0.35 },
    PRODUCTS:       { PRODUCT_DETAIL: 0.70, EXIT: 0.30 },
    PRODUCT_DETAIL: { ADD_TO_CART: 0.28, PRODUCT_DETAIL: 0.18, PRODUCTS: 0.10, EXIT: 0.44 },
    ADD_TO_CART:    { CART: 0.65, PRODUCT_DETAIL: 0.35 },
    CART:           { CHECKOUT: 0.38, PRODUCT_DETAIL: 0.12, EXIT: 0.50 },
    CHECKOUT:       { CONVERTED: 0.60, EXIT: 0.40 },
  },
  desktop_loggedIn: {
    HOMEPAGE:          { PRODUCTS: 0.70, EXIT: 0.30 },
    PRODUCTS:          { PRODUCT_DETAIL: 0.72, EXIT: 0.28 },
    PRODUCT_DETAIL:    { ADD_TO_CART: 0.24, INSTANT_CHECKOUT: 0.12, PRODUCT_DETAIL: 0.18, PRODUCTS: 0.08, EXIT: 0.38 },
    ADD_TO_CART:       { CART: 0.65, PRODUCT_DETAIL: 0.35 },
    CART:              { CHECKOUT: 0.42, PRODUCT_DETAIL: 0.10, EXIT: 0.48 },
    CHECKOUT:          { CONVERTED: 0.65, EXIT: 0.35 },
    INSTANT_CHECKOUT:  { CONVERTED: 0.85, EXIT: 0.15 },
  },
  mobile_anonymous: {
    HOMEPAGE:       { PRODUCTS: 0.52, EXIT: 0.48 },
    PRODUCTS:       { PRODUCT_DETAIL: 0.62, EXIT: 0.38 },
    PRODUCT_DETAIL: { ADD_TO_CART: 0.30, PRODUCT_DETAIL: 0.15, PRODUCTS: 0.08, EXIT: 0.47 },
    ADD_TO_CART:    { CART: 0.60, PRODUCT_DETAIL: 0.40 },
    CART:           { CHECKOUT: 0.25, PRODUCT_DETAIL: 0.10, EXIT: 0.65 },
    CHECKOUT:       { CONVERTED: 0.45, EXIT: 0.55 },
  },
  mobile_loggedIn: {
    HOMEPAGE:          { PRODUCTS: 0.55, EXIT: 0.45 },
    PRODUCTS:          { PRODUCT_DETAIL: 0.65, EXIT: 0.35 },
    PRODUCT_DETAIL:    { ADD_TO_CART: 0.26, INSTANT_CHECKOUT: 0.10, PRODUCT_DETAIL: 0.15, PRODUCTS: 0.07, EXIT: 0.42 },
    ADD_TO_CART:       { CART: 0.60, PRODUCT_DETAIL: 0.40 },
    CART:              { CHECKOUT: 0.30, PRODUCT_DETAIL: 0.08, EXIT: 0.62 },
    CHECKOUT:          { CONVERTED: 0.50, EXIT: 0.50 },
    INSTANT_CHECKOUT:  { CONVERTED: 0.80, EXIT: 0.20 },
  },
};

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

const wait = (ms) => new Promise((r) => setTimeout(r, ms));

/** Pick a state from { STATE: probability } using weighted random selection. */
function weightedRandom(options) {
  const r = Math.random();
  let cumulative = 0;
  for (const [state, prob] of Object.entries(options)) {
    cumulative += prob;
    if (r <= cumulative) return state;
  }
  // Floating-point fallback — return last key
  const keys = Object.keys(options);
  return keys[keys.length - 1];
}

/** Pick an item from an array using a weight function. */
function pickWeighted(items, weightFn) {
  const totalWeight = items.reduce((sum, item) => sum + weightFn(item), 0);
  let r = Math.random() * totalWeight;
  for (const item of items) {
    r -= weightFn(item);
    if (r <= 0) return item;
  }
  return items[items.length - 1];
}

// ---------------------------------------------------------------------------
// State handlers
// ---------------------------------------------------------------------------

async function handleHomepage(page, ctx) {
  const url = ctx.baseUrl + ctx.utmSuffix;
  const gotoOptions = {};
  if (ctx.referer) gotoOptions.referer = ctx.referer;
  await page.goto(url, gotoOptions);
  await wait(500);
}

async function handleLogin(page, ctx) {
  await page.goto(`${ctx.baseUrl}/account`);
  await page.getByRole('textbox', { name: 'Email Address' }).fill(ctx.customer.email);
  await page.getByRole('textbox', { name: 'First Name' }).fill(ctx.customer.first);
  await page.getByRole('textbox', { name: 'Last Name' }).fill(ctx.customer.last);
  await page.getByRole('button', { name: 'Sign In' }).click();
  await wait(500);
}

async function handleProducts(page, ctx) {
  const url = ctx.isFirstNavigation
    ? ctx.baseUrl + '/products' + ctx.utmSuffix
    : ctx.baseUrl + '/products';
  const gotoOptions = {};
  if (ctx.isFirstNavigation && ctx.referer) gotoOptions.referer = ctx.referer;
  await page.goto(url, gotoOptions);
  ctx.isFirstNavigation = false;
  await wait(400);
}

async function handleProductDetail(page, ctx) {
  const slug = ctx.shuffledProducts[ctx.productIndex % ctx.shuffledProducts.length];
  ctx.productIndex++;
  ctx.currentSlug = slug;

  const url = ctx.isFirstNavigation
    ? `${ctx.baseUrl}/products/${slug}${ctx.utmSuffix}`
    : `${ctx.baseUrl}/products/${slug}`;
  const gotoOptions = {};
  if (ctx.isFirstNavigation && ctx.referer) gotoOptions.referer = ctx.referer;
  await page.goto(url, gotoOptions);
  ctx.isFirstNavigation = false;
  await wait(400);
}

async function handleAddToCart(page) {
  await page.getByRole('button', { name: 'Add to Cart' }).click();
  // Wait for "Added!" confirmation text
  await page.getByRole('button', { name: /added/i }).waitFor({ timeout: 3000 }).catch(() => {});
  await wait(300);
}

async function handleCart(page, ctx) {
  await page.goto(`${ctx.baseUrl}/cart`);
  await wait(400);
}

async function handleCheckout(page, ctx) {
  await page.goto(`${ctx.baseUrl}/checkout`);
  await wait(400);
  // Step 1: Shipping
  await page.getByRole('button', { name: 'Fill Demo Data' }).click();
  await wait(300);
  await page.getByRole('button', { name: 'Continue to Payment' }).click();
  await wait(400);
  // Step 2: Payment
  await page.getByRole('button', { name: 'Fill Demo Data' }).click();
  await wait(300);
  await page.getByRole('button', { name: 'Continue to Review' }).click();
  await wait(400);
  // Step 3: Place order
  await page.getByRole('button', { name: 'Place Order' }).click();
  await wait(500);
}

async function handleInstantCheckout(page) {
  // "Buy Now" on the current product page → instant checkout
  await page.getByRole('button', { name: 'Buy Now' }).click();
  await wait(500);
  await page.getByRole('button', { name: 'Place Order' }).click();
  await wait(500);
}

// ---------------------------------------------------------------------------
// Markov chain walker
// ---------------------------------------------------------------------------
const MAX_PRODUCT_DETAIL_VISITS = 5;

function walkMarkovChain(transitions, startState) {
  const path = [startState];
  let current = startState;
  let productDetailVisits = current === 'PRODUCT_DETAIL' ? 1 : 0;

  while (current !== 'CONVERTED' && current !== 'EXIT') {
    const options = transitions[current];
    if (!options) break;

    // If we've hit the product detail cap, remove PRODUCT_DETAIL from options
    let filteredOptions = { ...options };
    if (productDetailVisits >= MAX_PRODUCT_DETAIL_VISITS) {
      delete filteredOptions['PRODUCT_DETAIL'];
      // Renormalise
      const total = Object.values(filteredOptions).reduce((s, v) => s + v, 0);
      if (total > 0) {
        for (const key of Object.keys(filteredOptions)) {
          filteredOptions[key] /= total;
        }
      }
    }

    const next = weightedRandom(filteredOptions);
    path.push(next);
    current = next;

    if (current === 'PRODUCT_DETAIL') productDetailVisits++;
  }

  return path;
}

// ---------------------------------------------------------------------------
// Session simulator
// ---------------------------------------------------------------------------
let customerIndex = 0;

async function simulateSession(browser) {
  // Pick device: 60% mobile, 40% desktop
  const isMobile = Math.random() < 0.60;
  const devicePool = isMobile ? MOBILE_DEVICES : DESKTOP_DEVICES;
  const device = devicePool[Math.floor(Math.random() * devicePool.length)];

  // Pick traffic source
  const source = pickWeighted(TRAFFIC_SOURCES, (s) => s.weight);

  // Pick entry point from source
  const entryState = weightedRandom(source.entryPoints);

  // Decide login (30% chance)
  const isLoggedIn = Math.random() < 0.30;
  const customer = isLoggedIn ? CUSTOMERS[customerIndex++ % CUSTOMERS.length] : null;

  // Select transition matrix
  const matrixKey = `${device.type}_${isLoggedIn ? 'loggedIn' : 'anonymous'}`;
  const transitions = TRANSITIONS[matrixKey];

  // Walk the chain
  const chainPath = walkMarkovChain(transitions, entryState);

  // Build label
  const label = customer ? `${customer.first} ${customer.last}` : 'Anonymous';

  // Create browser context
  const context = await browser.newContext({
    viewport: device.viewport,
    userAgent: device.userAgent,
  });
  const page = await context.newPage();

  const ctx = {
    baseUrl: BASE_URL,
    customer,
    shuffledProducts: shuffle(PRODUCTS),
    productIndex: 0,
    currentSlug: null,
    utmSuffix: source.utmParams,
    referer: source.referer,
    isFirstNavigation: true,
  };

  let total = null;
  let converted = false;

  try {
    // If logged in, login after the first navigation
    let loginDone = false;

    for (const state of chainPath) {
      switch (state) {
        case 'HOMEPAGE':
          await handleHomepage(page, ctx);
          if (isLoggedIn && !loginDone) {
            await handleLogin(page, ctx);
            loginDone = true;
          }
          break;
        case 'PRODUCTS':
          await handleProducts(page, ctx);
          if (isLoggedIn && !loginDone) {
            await handleLogin(page, ctx);
            loginDone = true;
          }
          break;
        case 'PRODUCT_DETAIL':
          await handleProductDetail(page, ctx);
          if (isLoggedIn && !loginDone) {
            await handleLogin(page, ctx);
            loginDone = true;
            // Navigate back to product page so ADD_TO_CART / INSTANT_CHECKOUT work
            await page.goto(`${ctx.baseUrl}/products/${ctx.currentSlug}`);
            await wait(400);
          }
          break;
        case 'ADD_TO_CART':
          await handleAddToCart(page);
          break;
        case 'CART':
          await handleCart(page, ctx);
          break;
        case 'CHECKOUT':
          await handleCheckout(page, ctx);
          break;
        case 'INSTANT_CHECKOUT':
          await handleInstantCheckout(page);
          break;
        case 'CONVERTED': {
          const url = page.url();
          const match = url.match(/total=([^&]+)/);
          total = match ? decodeURIComponent(match[1]) : '?';
          converted = true;
          break;
        }
        case 'EXIT':
          break;
      }
    }

    const pathStr = chainPath.map((s) => s.toLowerCase()).join(' → ');
    const suffix = converted ? ` (${total})` : '';
    console.log(`  ✓ ${label} on ${device.name} (${source.name}) — ${pathStr}${suffix}`);
  } catch (err) {
    const pathStr = chainPath.map((s) => s.toLowerCase()).join(' → ');
    console.error(`  ✗ ${label} on ${device.name} (${source.name}) — ${pathStr} — ERROR: ${err.message}`);
  } finally {
    await context.close();
  }

  return { converted, total, device, source, label };
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
async function main() {
  console.log(`Generating events on ${BASE_URL}`);
  console.log(`Rounds: ${ROUNDS}, Sessions per round: ${SESSIONS_PER_ROUND}\n`);

  const browser = await chromium.launch({ headless: true });
  const allResults = [];

  for (let round = 1; round <= ROUNDS; round++) {
    console.log(`--- Round ${round}/${ROUNDS} ---`);

    for (let i = 0; i < SESSIONS_PER_ROUND; i++) {
      const result = await simulateSession(browser);
      allResults.push(result);
    }

    const roundResults = allResults.slice(-SESSIONS_PER_ROUND);
    const roundConverted = roundResults.filter((r) => r.converted).length;
    console.log(`  Round ${round}: ${roundConverted}/${SESSIONS_PER_ROUND} converted (${((roundConverted / SESSIONS_PER_ROUND) * 100).toFixed(1)}%)\n`);
  }

  await browser.close();

  // Final summary
  const totalSessions = allResults.length;
  const totalConverted = allResults.filter((r) => r.converted).length;
  const desktopResults = allResults.filter((r) => r.device.type === 'desktop');
  const mobileResults = allResults.filter((r) => r.device.type === 'mobile');
  const desktopConverted = desktopResults.filter((r) => r.converted).length;
  const mobileConverted = mobileResults.filter((r) => r.converted).length;

  // Source counts
  const sourceCounts = {};
  for (const r of allResults) {
    sourceCounts[r.source.name] = (sourceCounts[r.source.name] || 0) + 1;
  }
  const sourceStr = Object.entries(sourceCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([name, count]) => `${name} ${count}`)
    .join(', ');

  console.log(`Done! ${totalSessions} sessions: ${totalConverted} converted (${((totalConverted / totalSessions) * 100).toFixed(1)}%), ${totalSessions - totalConverted} exited`);
  console.log(`  Desktop: ${desktopResults.length} sessions, ${desktopConverted} converted (${desktopResults.length ? ((desktopConverted / desktopResults.length) * 100).toFixed(1) : 0}%)`);
  console.log(`  Mobile: ${mobileResults.length} sessions, ${mobileConverted} converted (${mobileResults.length ? ((mobileConverted / mobileResults.length) * 100).toFixed(1) : 0}%)`);
  console.log(`  Sources: ${sourceStr}`);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
