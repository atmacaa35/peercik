// server.js (Render üzerinde çalışan dosyanız)

const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const cors = require('cors'); // cors paketini ekleyin

const app = express();
const port = process.env.PORT || 3000; // Render portu veya yerel için 3000

// CORS Ayarları
// Sadece kendi GitHub Pages adresinize izin vermek için:
const corsOptions = {
  origin: 'https://atmacaa35.github.io', // İstemcinizin yayınlandığı adres
  optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
};
app.use(cors(corsOptions));

// Veya tüm kaynaklara izin vermek için (test amaçlı olabilir, dikkatli kullanın):
// app.use(cors());

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: '/myapp', // İstemcide belirttiğiniz path ile aynı olmalı
  allow_discovery: true, // İsteğe bağlı: ID'leri listelemek için
  debug: true, // Hata ayıklama için logları artırır
  // generateClientId: () => { // İsteğe bağlı: Özel ID üretme fonksiyonu
  //   return require('uuid').v4();
  // }
});

app.use(peerServer); // PeerJS sunucusunu /myapp yoluna bağlayın

// Ana sayfa (isteğe bağlı, sunucunun çalıştığını görmek için)
app.get('/', (req, res) => {
  res.send('PeerJS sunucusu çalışıyor. Bağlantı için /myapp kullanın.');
});

server.listen(port, () => {
  console.log(`HTTP sunucusu ${port} portunda dinleniyor.`);
  console.log(`PeerJS sunucusu /myapp yolu için yapılandırıldı.`);
  console.log(`İstemci bağlantı adresi: wss://<sizin-render-adresiniz>/myapp`); // Render adresinizi buraya yazın
});

// PeerServer olaylarını dinleyebilirsiniz (isteğe bağlı)
peerServer.on('connection', (client) => {
  console.log(`Client bağlandı: ${client.getId()}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`Client bağlantısı kesildi: ${client.getId()}`);
});

peerServer.on('message', (client, message) => {
  console.log(`Client'tan mesaj (${client.getId()}):`, message);
});

peerServer.on('error', (error) => {
  console.error('PeerServer Hatası:', error);
});