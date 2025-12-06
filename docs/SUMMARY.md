# Jeferco — Déploiement, Emails et Rappels (Résumé)

## Production
- Client: mesbois-client-cwdky7sqh-mummys-projects-67592474.vercel.app
- Admin: mesbois-admin-b8x735crh-mummys-projects-67592474.vercel.app

## Emails en production
- Expéditeur: `FROM_NAME=Jeferco` avec `Jeferco <FROM_EMAIL>`
- ID de commande: affiché en version courte `#ABCDEFGH` (objet + corps)
- Copie cachée: `NOTIFY_EMAIL` si défini

### Client — Confirmation de commande
- Endpoint: `apps/client/api/order-confirmation.js`
- Contenu: HTML + texte, recap articles, total, adresse de livraison, délai 2–5 jours, suivi via espace client (sans lien)
- Déclencheurs:
  - Checkout (nouveau client): envoi avec message de bienvenue
  - Checkout (client existant): envoi avec message fidélité
  - Dashboard (client connecté): envoi après création de commande

### Admin — Mise à jour de statut (notification au client)
- Endpoint: `apps/admin/api/order-status.js`
- Sujets (tous avec ID court):
  - Processing: "Jeferco — Confirmation de paiement #ABCD1234"
  - Shipped: "Jeferco — Confirmation d’expédition #ABCD1234"
  - Delivered: "Jeferco — Confirmation de livraison #ABCD1234"
  - Cancelled: "Jeferco — Confirmation d’annulation #ABCD1234"
- Pas de liens. Contenu pro FR + délai et suivi lorsque pertinent.

## Rappels automatiques (Plan Hobby: 1/jour)
- Fichiers: `apps/admin/api/cron-awaiting-payment.js`, `apps/admin/api/cron-abandoned-carts.js`
- Variables requises (projet Admin):
  - SMTP_HOST, SMTP_PORT, SMTP_SECURE, SMTP_USER, SMTP_PASS, FROM_EMAIL, FROM_NAME, NOTIFY_EMAIL
  - FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, FIREBASE_PRIVATE_KEY (format une ligne avec \n)

### Rappel paiement en attente
- Route: `/api/cron-awaiting-payment`
- Logique: cible commandes `awaiting_payment`/`pending` créées depuis ≥6h et non rappelées dans les 6 dernières heures.
- Effets: envoie email + met `lastReminderAt` et `reminderCount` sur l’ordre.
- Planification Vercel (UTC): tous les jours 08:00

### Rappel panier abandonné
- Persistance panier (client connecté): `carts/{userId}` avec `items`, `updatedAt`, `email`, `name`
- Route: `/api/cron-abandoned-carts`
- Logique: paniers avec `updatedAt` ≤ (now-6h), contenant des items, non rappelés dans les 6 dernières heures.
- Effets: envoie email + met `lastReminderAt` et `reminderCount` sur le panier.
- Planification Vercel (UTC): tous les jours 09:00

## Test manuel (avant ou en plus du cron)
- Paiement en attente: GET `/api/cron-awaiting-payment` → `{ ok: true, reminded: N }`
- Panier abandonné: GET `/api/cron-abandoned-carts` → `{ ok: true, reminded: N }`

## Vercel (configs clés)
- Admin `vercel.json`:
  - Routes Node: `/api/order-status`, `/api/cron-awaiting-payment`, `/api/cron-abandoned-carts`
  - Crons: 08:00 (paiement), 09:00 (panier) — Plan Hobby quotidien
- Client `vercel.json`:
  - Routes API non capturées par SPA (CRA), fonctions exposées sous `/api/*`

## Ce qui reste à faire
- [Haut] Ajouter/valider les variables Firebase Admin côté Admin dans Vercel:
  - `FIREBASE_PROJECT_ID`, `FIREBASE_CLIENT_EMAIL`, `FIREBASE_PRIVATE_KEY`, `FROM_NAME=Jeferco`
- [Haut] Tester en prod les endpoints cron manuellement et vérifier `reminded > 0` si des cas éligibles existent
- [Moyen] Nettoyer les endpoints debug côté client: `/api/ping`, `/api/debug-env`
- [Optionnel] Ajouter une pièce jointe PDF de récap de commande aux emails client

## Notes techniques
- FIREBASE_PRIVATE_KEY doit être en une seule ligne avec `\n` échappés
- Anti-spam rappel: `lastReminderAt` et `reminderCount` gérés côté Firestore
- Les emails n’incluent aucun lien tracking conformément à la demande
