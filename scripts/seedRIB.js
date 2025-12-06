#!/usr/bin/env node
/*
 Seed Firestore collection 'rib' with document 'default'.
 Usage:
   - Set GOOGLE_APPLICATION_CREDENTIALS to your service account JSON
   - Provide values via env:
       RIB_HOLDER, RIB_IBAN, RIB_BIC, RIB_BANK
     or via CLI flags:
       --holder "..." --iban "..." --bic "..." --bank "..."
   - Run: node scripts/seedRIB.js
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
      admin.initializeApp({
        credential: admin.credential.applicationDefault(),
      });
    }
    const db = admin.firestore();

    const args = parseArgs(process.argv);
    const holder = args.holder || process.env.RIB_HOLDER || '';
    const iban = args.iban || process.env.RIB_IBAN || '';
    const bic = args.bic || process.env.RIB_BIC || '';
    const bank = args.bank || process.env.RIB_BANK || '';

    if (!holder || !iban || !bic || !bank) {
      console.error('Missing required fields. Provide holder, iban, bic, bank via env or CLI flags.');
      process.exit(1);
    }

    const ref = db.collection('rib').doc('default');
    await ref.set({ holder, iban, bic, bank }, { merge: true });

    console.log('✔ RIB stored in Firestore at rib/default');
    console.log({ holder, iban, bic, bank });
    process.exit(0);
  } catch (e) {
    console.error('✖ Failed to seed RIB:', e.message || e);
    process.exit(1);
  }
})();
