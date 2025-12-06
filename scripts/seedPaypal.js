#!/usr/bin/env node
/*
 Seed Firestore collection 'paypal' with document 'default'.
 Usage:
   - Set GOOGLE_APPLICATION_CREDENTIALS to your Firebase service account JSON
   - Provide values via env:
       PAYPAL_EMAIL, PAYPAL_INSTRUCTIONS
     or via CLI flags:
       --email "your-paypal@email" --instructions "Your payment instructions..."
   - Run: node scripts/seedPaypal.js
*/

const admin = require('firebase-admin');

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const key = argv[i];
    if (key.startsWith('--')) {
      const name = key.slice(2);
      const val = argv[i + 1] && !argv[i + 1].startsWith('--') ? argv[++i] : 'true';
      args[name] = val;
    }
  }
  return args;
}

(async () => {
  try {
    if (!admin.apps.length) {
      // Prefer GOOGLE_APPLICATION_CREDENTIALS if set; otherwise use FIREBASE_* envs
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (projectId && clientEmail && privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
        admin.initializeApp({
          credential: admin.credential.cert({ projectId, clientEmail, privateKey })
        });
      } else {
        admin.initializeApp({
          credential: admin.credential.applicationDefault(),
        });
      }
    }
    const db = admin.firestore();

    const args = parseArgs(process.argv);
    const email = args.email || process.env.PAYPAL_EMAIL || '';
    const instructions = args.instructions || process.env.PAYPAL_INSTRUCTIONS || '';

    if (!email) {
      console.error('Missing PAYPAL email. Provide via --email or PAYPAL_EMAIL env.');
      process.exit(1);
    }

    const ref = db.collection('paypal').doc('default');
    await ref.set({ email, instructions }, { merge: true });

    console.log('✔ PayPal info stored in Firestore at paypal/default');
    console.log({ email, instructions });
    process.exit(0);
  } catch (e) {
    console.error('✖ Failed to seed PayPal info:', e.message || e);
    process.exit(1);
  }
})();
