const express = require('express');
const app = express();

app.get('/', (req, res) => {
  res.send('Backend fonctionnel!');
});

const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Serveur démarré sur le port ${PORT}`);
});