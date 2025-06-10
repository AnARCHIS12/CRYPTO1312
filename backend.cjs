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
// Chaque entrée : { cle, expire, count }
const cles = {};
const DUREE_EXPIRATION_MS = 10 * 60 * 1000; // 10 minutes
const MAX_LECTURES = 50;

// POST /api/cle : enregistre une clé et retourne un id
app.post('/api/cle', (req, res) => {
  const { cle } = req.body;
  if (!cle) return res.status(400).json({ error: 'Clé manquante' });
  const id = uuidv4();
  cles[id] = {
    cle,
    expire: Date.now() + DUREE_EXPIRATION_MS,
    count: 0
  };
  res.json({ id });
});

// GET /api/cle/:id : récupère une clé par id (max 50 fois)
app.get('/api/cle/:id', (req, res) => {
  const { id } = req.params;
  const entry = cles[id];
  if (!entry) return res.status(404).json({ error: 'Clé non trouvée ou supprimée (max lectures atteintes)' });
  if (Date.now() > entry.expire) {
    delete cles[id];
    return res.status(410).json({ error: 'Clé expirée' });
  }
  entry.count++;
  console.log(`Lecture clé ${id} : count=${entry.count}`);
  const cle = entry.cle;
  const lecturesRestantes = MAX_LECTURES - entry.count;
  if (entry.count >= MAX_LECTURES) {
    delete cles[id];
    console.log(`Clé ${id} supprimée après ${MAX_LECTURES} lectures.`);
  }
  res.json({ cle, lecturesRestantes: lecturesRestantes >= 0 ? lecturesRestantes : 0 });
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
  // Fallback : toutes les routes sauf /api/* servent index.html
  app.get(/^\/(?!api).*/, (req, res) => {
    res.sendFile(path.join(buildPath, 'index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`Serveur backend CRYPTO1312 démarré sur http://localhost:${PORT}`);
});
