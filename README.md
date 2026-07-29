# Novedades — Backend

Ce serveur permet à de vrais comptes de s'inscrire, se connecter, et s'envoyer des
messages en temps réel — la partie qui manquait au prototype front-end (qui ne
faisait que simuler des contacts sur un seul appareil).

## Ce qu'il fait

- Inscription / connexion par numéro de téléphone + mot de passe (compte protégé par mot de passe, session par jeton JWT)
- Liste des contacts (tous les comptes inscrits, pour l'instant)
- Historique des messages entre deux comptes
- Envoi de message : sauvegardé en base **et** livré instantanément si le destinataire est connecté (Socket.io)
- Présence en ligne / hors ligne

La base de données est un simple fichier SQLite (`novedades.db`), créé automatiquement
au premier démarrage — aucune base de données externe à installer.

## Lancer en local

```bash
cd novedades-backend
npm install
cp .env.example .env
# ouvre .env et remplace JWT_SECRET par une vraie phrase secrète
npm start
```

Le serveur écoute par défaut sur `http://localhost:3001`.

Vérifier que ça marche :
```bash
curl http://localhost:3001/api/health
```

## Endpoints principaux

| Méthode | Route | Description |
|---|---|---|
| POST | `/api/auth/register` | `{ name, phone, password }` → crée un compte |
| POST | `/api/auth/login` | `{ phone, password }` → connexion |
| GET | `/api/contacts` | liste des autres comptes (nécessite le jeton) |
| GET | `/api/messages/:contactId` | historique avec un contact |
| POST | `/api/messages` | `{ receiverId, text }` → envoie un message |

Toutes les routes sauf `register`/`login` demandent l'en-tête :
`Authorization: Bearer <token>` (le jeton reçu à l'inscription/connexion).

Le temps réel passe par Socket.io : le client se connecte avec
`io(url, { auth: { token } })` et reçoit l'événement `message:new` quand un
message arrive, et `presence:update` quand un contact se connecte/déconnecte.

## Mettre le serveur en ligne gratuitement

Pour que l'app soit utilisable depuis plusieurs téléphones (pas seulement en local),
il faut héberger ce serveur quelque part. Options simples avec un plan gratuit :

1. **Render.com** — connecte ce dossier à un dépôt GitHub, choisis "Web Service",
   build command `npm install`, start command `npm start`.
2. **Railway.app** — même principe, déploiement direct depuis GitHub.

Dans les deux cas : ajoute la variable d'environnement `JWT_SECRET` dans les
réglages du service (ne jamais laisser la valeur d'exemple en production).

⚠️ Le disque de ces hébergeurs gratuits peut être réinitialisé entre les
redéploiements — pour un usage sérieux à terme, il faudra migrer vers une vraie
base de données hébergée (ex. Postgres géré). Pour démarrer et tester avec de
vrais utilisateurs, ce serveur suffit.

## Prochaine étape

Le fichier `novedades.jsx` (le front-end créé plus tôt) utilise encore un
stockage local simulé. L'étape suivante est de remplacer ces appels par de
vraies requêtes vers ce serveur (`fetch` pour l'API, `socket.io-client` pour le
temps réel) — dis-moi quand tu veux que je fasse cette connexion.
