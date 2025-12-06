const admin = require('firebase-admin');

let inited = false;
function initAdmin() {
  if (inited) return;
  try {
    if (!admin.apps.length) {
      const projectId = process.env.FIREBASE_PROJECT_ID;
      const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
      let privateKey = process.env.FIREBASE_PRIVATE_KEY;
      if (projectId && clientEmail && privateKey) {
        privateKey = privateKey.replace(/\\n/g, '\n');
        admin.initializeApp({
          credential: admin.credential.cert({ projectId, clientEmail, privateKey })
        });
      } else {
        admin.initializeApp({ credential: admin.credential.applicationDefault() });
      }
    }
    inited = true;
  } catch (e) {
    console.error('Admin init failed:', e && e.message);
    throw e;
  }
}

function checkAuth(req) {
  const token = (req.headers['authorization'] || '').replace(/^Bearer\s+/i, '').trim();
  const expected = (process.env.ADMIN_API_TOKEN || '').trim();
  return expected && token && token === expected;
}

module.exports = async function handler(req, res) {
  try {
    if (!checkAuth(req)) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    initAdmin();
    const db = admin.firestore();

    if (req.method === 'GET') {
      const [ribSnap, ppSnap] = await Promise.all([
        db.collection('rib').doc('default').get(),
        db.collection('paypal').doc('default').get()
      ]);
      const rib = ribSnap.exists ? ribSnap.data() : {};
      const paypal = ppSnap.exists ? ppSnap.data() : {};
      return res.status(200).json({ ok: true, rib, paypal });
    }

    if (req.method === 'POST') {
      const body = req.body || {};
      const rib = body.rib || {};
      const paypal = body.paypal || {};
      await Promise.all([
        db.collection('rib').doc('default').set({
          holder: rib.holder || '',
          iban: rib.iban || '',
          bic: rib.bic || '',
          bank: rib.bank || ''
        }, { merge: true }),
        db.collection('paypal').doc('default').set({
          email: paypal.email || '',
          instructions: paypal.instructions || ''
        }, { merge: true })
      ]);
      return res.status(200).json({ ok: true });
    }

    return res.status(405).json({ error: 'Method Not Allowed' });
  } catch (e) {
    console.error('settings-payments error:', e && e.message);
    return res.status(500).json({ error: 'Internal error', detail: e && e.message });
  }
}
