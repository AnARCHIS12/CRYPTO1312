// Backend Express minimal pour CRYPTO1312
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Stockage temporaire en mémoire
// Chaque entrée : { cle, expire }
const cles = {};
const DUREE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes

// POST /api/cle : enregistre une clé et retourne un id
app.post('/api/cle', (req, res) => {
  const { cle } = req.body;
  if (!cle) return res.status(400).json({ error: 'Clé manquante' });
  const id = uuidv4();
  cles[id] = {
    cle,
    expire: Date.now() + DUREE_EXPIRATION_MS
  };
  res.json({ id });
});

// GET /api/cle/:id : récupère une clé par id (une seule fois)
app.get('/api/cle/:id', (req, res) => {
  const { id } = req.params;
  const entry = cles[id];
  if (Date.now() > entry.expire) {
    delete cles[id];
    return res.status(410).json({ error: 'Clé expirée' });
  }
  const cle = entry.cle;
  delete cles[id]; // Suppression après lecture (usage unique)
  res.json({ cle });
});

// Nettoyage périodique des clés expirées
setInterval(() => {
  const now = Date.now();
  for (const id in cles) {
    if (cles[id].expire < now) delete cles[id];
  }
}, 60 * 1000); // toutes les minutes

// Servir le frontend Vite en production (Render)
if (process.env.NODE_ENV === 'production') {
  const buildPath = path.join(__dirname, 'dist');
  app.use(express.static(buildPath));
  app.get('*', (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Serveur backend CRYPTO1312 démarré sur http://localhost:${PORT}`);
});
