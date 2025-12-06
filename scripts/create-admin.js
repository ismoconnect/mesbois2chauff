/**
 * Script pour créer un utilisateur administrateur dans Firebase
 * 
 * Usage:
 *   node scripts/create-admin.js email@example.com motdepasse
 * 
 * Ce script va:
 * 1. Créer un utilisateur dans Firebase Authentication
 * 2. Ajouter l'utilisateur à la collection 'admins' dans Firestore
 */

const admin = require('firebase-admin');

// Configuration Firebase Admin SDK
const serviceAccount = {
    projectId: process.env.FIREBASE_PROJECT_ID || 'mesbois-2',
    clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n')
};

// Initialiser Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const auth = admin.auth();
const db = admin.firestore();

async function createAdmin(email, password) {
    try {
        console.log('🔥 Création de l\'utilisateur admin...');

        // 1. Créer l'utilisateur dans Authentication
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            emailVerified: true
        });

        console.log('✅ Utilisateur créé avec succès!');
        console.log('   UID:', userRecord.uid);
        console.log('   Email:', userRecord.email);

        // 2. Ajouter l'utilisateur à la collection 'admins'
        await db.collection('admins').doc(userRecord.uid).set({
            email: email,
            enabled: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            role: 'admin'
        });

        console.log('✅ Utilisateur ajouté à la collection admins!');
        console.log('\n🎉 Admin créé avec succès!');
        console.log('\nVous pouvez maintenant vous connecter avec:');
        console.log('   Email:', email);
        console.log('   Password: [le mot de passe que vous avez fourni]');

        process.exit(0);
    } catch (error) {
        console.error('❌ Erreur lors de la création de l\'admin:', error.message);

        if (error.code === 'auth/email-already-exists') {
            console.log('\n💡 Cet email existe déjà. Voulez-vous plutôt:');
            console.log('   1. Utiliser un autre email');
            console.log('   2. Ajouter l\'utilisateur existant aux admins');
        }

        process.exit(1);
    }
}

// Récupérer les arguments de la ligne de commande
const args = process.argv.slice(2);

if (args.length < 2) {
    console.log('❌ Usage: node scripts/create-admin.js <email> <password>');
    console.log('\nExemple:');
    console.log('   node scripts/create-admin.js admin@mesbois.com MonMotDePasse123!');
    process.exit(1);
}

const [email, password] = args;

// Validation basique
if (!email.includes('@')) {
    console.log('❌ Email invalide');
    process.exit(1);
}

if (password.length < 6) {
    console.log('❌ Le mot de passe doit contenir au moins 6 caractères');
    process.exit(1);
}

// Créer l'admin
createAdmin(email, password);
