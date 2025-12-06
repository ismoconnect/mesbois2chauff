/**
 * Script pour ajouter un utilisateur existant à la collection admins
 * 
 * Usage:
 *   node scripts/add-existing-admin.js email@example.com
 */

const admin = require('firebase-admin');
const path = require('path');

// Charger le service account
const serviceAccountPath = path.join(__dirname, '..', 'service-account.json');
const serviceAccount = require(serviceAccountPath);

// Initialiser Firebase Admin
if (!admin.apps.length) {
    admin.initializeApp({
        credential: admin.credential.cert(serviceAccount)
    });
}

const auth = admin.auth();
const db = admin.firestore();

async function addExistingAdmin(email) {
    try {
        console.log('🔍 Recherche de l\'utilisateur...');

        // Récupérer l'utilisateur par email
        const userRecord = await auth.getUserByEmail(email);

        console.log('✅ Utilisateur trouvé!');
        console.log('   UID:', userRecord.uid);
        console.log('   Email:', userRecord.email);

        // Vérifier s'il est déjà admin
        const adminDoc = await db.collection('admins').doc(userRecord.uid).get();

        if (adminDoc.exists) {
            console.log('\n⚠️  Cet utilisateur est déjà dans la collection admins!');
            const data = adminDoc.data();
            console.log('   Enabled:', data.enabled);
            console.log('   Role:', data.role || 'admin');

            if (data.enabled) {
                console.log('\n✅ L\'utilisateur est déjà admin et activé!');
                console.log('\nVous pouvez vous connecter avec:');
                console.log('   Email:', email);
            } else {
                console.log('\n⚠️  L\'utilisateur est désactivé. Activation...');
                await db.collection('admins').doc(userRecord.uid).update({
                    enabled: true,
                    updatedAt: admin.firestore.FieldValue.serverTimestamp()
                });
                console.log('✅ Utilisateur activé!');
            }
        } else {
            console.log('\n📝 Ajout à la collection admins...');

            // Ajouter à la collection admins
            await db.collection('admins').doc(userRecord.uid).set({
                email: email,
                enabled: true,
                createdAt: admin.firestore.FieldValue.serverTimestamp(),
                role: 'admin',
                addedBy: 'script'
            });

            console.log('✅ Utilisateur ajouté à la collection admins!');
        }

        console.log('\n🎉 Configuration terminée!');
        console.log('\nVous pouvez maintenant vous connecter à l\'interface Admin avec:');
        console.log('   Email:', email);
        console.log('   UID:', userRecord.uid);

        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);

        if (error.code === 'auth/user-not-found') {
            console.log('\n💡 Cet email n\'existe pas dans Authentication.');
            console.log('   Utilisez create-admin-simple.js pour créer un nouvel utilisateur.');
        }

        process.exit(1);
    }
}

// Récupérer l'email de la ligne de commande
const args = process.argv.slice(2);

if (args.length < 1) {
    console.log('❌ Usage: node scripts/add-existing-admin.js <email>');
    console.log('\nExemple:');
    console.log('   node scripts/add-existing-admin.js admin@mesbois.com');
    process.exit(1);
}

const email = args[0];

if (!email.includes('@')) {
    console.log('❌ Email invalide');
    process.exit(1);
}

addExistingAdmin(email);
