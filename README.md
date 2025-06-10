# CRYPTO1312

[![GitHub Repo](https://img.shields.io/badge/GitHub-CRYPTO1312-181717?style=for-the-badge&logo=github)](https://github.com/AnARCHIS12/CRYPTO1312)
![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![Vite](https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=FFD62E)
![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000?style=for-the-badge&logo=express&logoColor=white)
![CryptoJS](https://img.shields.io/badge/CryptoJS-4B4B4B?style=for-the-badge)

---

CRYPTO1312 est une application web moderne pour l’échange sécurisé de clés (ou mots de passe) entre deux utilisateurs.

## ✨ Fonctionnalités principales
- Génération ou saisie manuelle de clé secrète
- Partage sécurisé via backend (Node.js/Express)
- Gestion automatique ou manuelle de la phrase secrète de chiffrement
- Partage par QR code ou lien direct
- Récupération et déchiffrement de la clé côté destinataire
- Interface moderne, responsive et mobile-first
- Logo personnalisé et favicon

## 🚀 Démarrage rapide

```bash
npm install
npm run dev
```

Pour lancer le backend (dans un autre terminal) :
```bash
node backend.cjs
```

## 🖥️ Stack technique
- **Frontend** : React + Vite + CryptoJS + react-qr-code
- **Backend** : Node.js/Express (API d’échange sécurisé)
- **Dépôt GitHub** : [github.com/AnARCHIS12/CRYPTO1312](https://github.com/AnARCHIS12/CRYPTO1312)

## 📱 Interface
- Deux onglets : **Envoyer** (générer/partager) et **Recevoir** (récupérer/déchiffrer)
- UI épurée, intuitive, adaptée mobile et desktop
- Affichage dynamique des champs selon l’étape

## 🔒 Sécurité
- Chiffrement AES côté client (CryptoJS)
- Phrase secrète forte générée automatiquement ou saisie manuellement
- Aucun stockage de clé en clair côté serveur

## 📦 À faire / Roadmap
- [x] Génération/saisie de clé côté frontend
- [x] Partage backend sécurisé
- [x] QR code et lien de partage
- [x] UI moderne et responsive
- [ ] Génération de paires de clés asymétriques (RSA)
- [ ] Chiffrement/déchiffrement de messages (à venir)
- [ ] Authentification avancée (optionnel)

## 📝 Licence
MIT

---

> CRYPTO1312 – Pour des échanges de secrets simples, rapides et sûrs !
