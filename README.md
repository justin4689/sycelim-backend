# Sycelim Delivery Backend

API Node.js pour la gestion des livraisons et des utilisateurs (admins & livreurs).

## Description
Ce backend permet de :
- Gérer l’authentification (JWT) des admins et livreurs
- Créer, lister, supprimer et mettre à jour des livraisons
- changer le statut des livraisons
- Assigner un livreur à chaque livraison

## Stack technique
- Node.js / Express.js
- Drizzle ORM (SQLite/Turso)
- Authentification JWT

## Installation

1. **Cloner le dépôt**
   ```bash
   git clone https://github.com/justin4689/sycelim-backend.git
   cd sycelim-backend
   ```
2. **Installer les dépendances**
   ```bash
   npm install
   ```
3. **Configurer l’environnement**
   - Copier `.env.example` en `.env` et adapter les valeurs si besoin.

4. **Lancer le serveur**
   ```bash
   npm start
   # ou
   nodemon server.js
   ```

Le serveur démarre sur le port défini dans `.env` (par défaut 5000).

## Principales routes de l’API

### Authentification
- `POST /api/auth/register` : Inscription (admin ou livreur)
- `POST /api/auth/login` : Connexion (retourne un token JWT)

### Livraisons
- `POST /api/deliveries/` : Créer une livraison (auth requise)
- `GET /api/deliveries/` : Lister toutes les livraisons (admin) ou celles du livreur connecté
- `GET /api/deliveries/mine` : Lister uniquement les livraisons du livreur connecté
- `DELETE /api/deliveries/:id` : Supprimer une livraison (auth requise)
- `PATCH /api/deliveries/:id/status` : Modifier le statut d’une livraison (auth requise)

## Utilisation des tokens JWT
Pour toutes les routes protégées, ajouter le header :
```
Authorization: Bearer VOTRE_TOKEN
```

## Configuration
Voir le fichier `.env.example` pour la configuration de la base, du port, et des secrets.

---

Pour toute question ou contribution, ouvrez une issue ou un pull request sur le dépôt Github.

