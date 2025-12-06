#!/usr/bin/env node
/**
 * Seed a coupon into Firestore using Firebase Admin SDK.
 *
 * Usage (PowerShell on Windows):
 *   $env:GOOGLE_APPLICATION_CREDENTIALS="C:\path\to\serviceAccount.json"
 *   node scripts/seedCoupon.mjs --code PROMO20 --type percent --value 20 --active true --location items
 *
 * --location can be one of:
 *   - items    -> writes to settings/coupons/items/{autoId}
 *   - root     -> writes to coupons/{CODE}
 */

import admin from 'firebase-admin';

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { code: '', type: 'percent', value: 0, active: true, location: 'items' };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--code') out.code = String(args[++i] || '').trim();
    else if (a === '--type') out.type = String(args[++i] || 'percent').trim();
    else if (a === '--value') out.value = Number(args[++i] || 0);
    else if (a === '--active') out.active = String(args[++i] || 'true').toLowerCase() !== 'false';
    else if (a === '--location') out.location = String(args[++i] || 'items').trim();
    else if (a === '--minTotal') out.minTotal = Number(args[++i] || 0);
    else if (a === '--expiresAt') out.expiresAt = new Date(args[++i]);
  }
  return out;
}

function requireEnv(pathVar = 'GOOGLE_APPLICATION_CREDENTIALS') {
  const p = process.env[pathVar];
  if (!p) {
    console.error(`[ERROR] ${pathVar} environment variable is not set. Set it to your service account JSON path.`);
    process.exit(1);
  }
  return p;
}

async function main() {
  requireEnv();

  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
    });
  }
  const db = admin.firestore();

  const { code, type, value, active, location, minTotal, expiresAt } = parseArgs();
  if (!code) {
    console.error('[ERROR] --code is required');
    process.exit(1);
  }
  if (!['percent', 'fixed'].includes(type)) {
    console.error('[ERROR] --type must be "percent" or "fixed"');
    process.exit(1);
  }
  if (Number.isNaN(value) || value <= 0) {
    console.error('[ERROR] --value must be a positive number');
    process.exit(1);
  }

  const payload = {
    code: code.toUpperCase(),
    type,
    value,
    active: !!active,
  };
  if (typeof minTotal === 'number') payload.minTotal = minTotal;
  if (expiresAt instanceof Date && !Number.isNaN(expiresAt.getTime())) payload.expiresAt = admin.firestore.Timestamp.fromDate(expiresAt);

  if (location === 'root') {
    await db.collection('coupons').doc(code.toUpperCase()).set(payload, { merge: true });
    console.log(`[OK] Coupon ${code.toUpperCase()} written at coupons/${code.toUpperCase()}`);
  } else {
    // default to settings/coupons/items
    await db.collection('settings').doc('coupons').collection('items').add(payload);
    console.log(`[OK] Coupon ${code.toUpperCase()} added to settings/coupons/items`);
  }
}

main().catch((err) => {
  console.error('[ERROR] Failed to seed coupon:', err?.message || err);
  process.exit(1);
});
