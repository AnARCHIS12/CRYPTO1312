// Backend Express minimal pour CRYPTO1312
const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Stockage temporaire en mémoire
const cles = {};

// POST /api/cle : enregistre une clé et retourne un id
app.post('/api/cle', (req, res) => {
  const { cle } = req.body;
  if (!cle) return res.status(400).json({ error: 'Clé manquante' });
  const id = uuidv4();
  cles[id] = cle;
  res.json({ id });
});

// GET /api/cle/:id : récupère une clé par id
app.get('/api/cle/:id', (req, res) => {
  const { id } = req.params;
  const cle = cles[id];
  if (!cle) return res.status(404).json({ error: 'Clé non trouvée' });
  res.json({ cle });
});

app.listen(PORT, () => {
  console.log(`Serveur backend CRYPTO1312 démarré sur http://localhost:${PORT}`);
});
