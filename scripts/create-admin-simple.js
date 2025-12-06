/**
 * Script simple pour créer un admin
 * Ce script charge automatiquement les credentials depuis le fichier JSON
 * 
 * Usage:
 *   1. Placez votre fichier service-account.json à la racine du projet
 *   2. Exécutez: node scripts/create-admin-simple.js
 */

const admin = require('firebase-admin');
const readline = require('readline');
const path = require('path');
const fs = require('fs');

// Interface pour lire l'input utilisateur
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function question(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function main() {
    try {
        console.log('🔥 === Création d\'un Administrateur ===\n');

        // Chercher le fichier service account
        const possiblePaths = [
            path.join(__dirname, '..', 'service-account.json'),
            path.join(__dirname, '..', 'mesbois-2-firebase-adminsdk.json'),
            path.join(__dirname, '..', 'firebase-adminsdk.json')
        ];

        let serviceAccountPath = null;
        for (const p of possiblePaths) {
            if (fs.existsSync(p)) {
                serviceAccountPath = p;
                break;
            }
        }

        if (!serviceAccountPath) {
            console.log('❌ Fichier service-account.json non trouvé!');
            console.log('\n📝 Veuillez:');
            console.log('   1. Télécharger la clé privée depuis Firebase Console');
            console.log('   2. Renommer le fichier en "service-account.json"');
            console.log('   3. Placer le fichier à la racine du projet');
            process.exit(1);
        }

        console.log('✅ Fichier de credentials trouvé:', path.basename(serviceAccountPath));

        // Initialiser Firebase Admin
        const serviceAccount = require(serviceAccountPath);

        if (!admin.apps.length) {
            admin.initializeApp({
                credential: admin.credential.cert(serviceAccount)
            });
        }

        const auth = admin.auth();
        const db = admin.firestore();

        // Demander l'email et le mot de passe
        console.log('');
        const email = await question('📧 Email de l\'admin: ');
        const password = await question('🔒 Mot de passe (min. 6 caractères): ');

        if (!email.includes('@')) {
            console.log('❌ Email invalide');
            rl.close();
            process.exit(1);
        }

        if (password.length < 6) {
            console.log('❌ Le mot de passe doit contenir au moins 6 caractères');
            rl.close();
            process.exit(1);
        }

        console.log('\n⏳ Création en cours...\n');

        // Créer l'utilisateur
        const userRecord = await auth.createUser({
            email: email,
            password: password,
            emailVerified: true
        });

        console.log('✅ Utilisateur créé dans Authentication');
        console.log('   UID:', userRecord.uid);

        // Ajouter à la collection admins
        await db.collection('admins').doc(userRecord.uid).set({
            email: email,
            enabled: true,
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            role: 'admin',
            createdBy: 'script'
        });

        console.log('✅ Utilisateur ajouté à la collection admins');

        console.log('\n🎉 === Admin créé avec succès! ===');
        console.log('\n📋 Informations de connexion:');
        console.log('   Email:', email);
        console.log('   Password: [le mot de passe que vous avez saisi]');
        console.log('   UID:', userRecord.uid);
        console.log('\n💡 Vous pouvez maintenant vous connecter à l\'interface Admin');

        rl.close();
        process.exit(0);

    } catch (error) {
        console.error('\n❌ Erreur:', error.message);

        if (error.code === 'auth/email-already-exists') {
            console.log('\n💡 Cet email existe déjà dans Authentication.');
            console.log('   Utilisez un autre email ou supprimez l\'utilisateur existant.');
        }

        rl.close();
        process.exit(1);
    }
}

main();
