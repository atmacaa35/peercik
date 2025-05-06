const { PeerServer } = require('peer');

const PORT = process.env.PORT || 3000;

const peerServer = PeerServer({
  port: PORT,
  path: '/myapp'
});

console.log(`PeerJS sunucusu çalışıyor: http://localhost:${PORT}/myapp`);
