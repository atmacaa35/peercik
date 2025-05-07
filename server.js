// server.js
const express = require('express');
const { PeerServer } = require('peer');

const app = express();
const PORT = process.env.PORT || 3000;

const peerServer = PeerServer({ path: '/myapp' });

app.use('/myapp', peerServer);

app.listen(PORT, () => {
  console.log(`PeerJS sunucusu yayında: https://peercik.onrender.com/myapp`);
});
