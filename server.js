// server.js (Render üzerinde çalışan dosyanız)

const express = require('express');
const { ExpressPeerServer } = require('peer');
const http = require('http');
const cors = require('cors'); // cors paketini ekleyin

const app = express();
const port = process.env.PORT || 3000; // Render portu veya yerel için 3000

// CORS Ayarları
const corsOptions = {
  origin: 'https://atmacaa35.github.io', // İSTEMCİNİZİN BARINDIRILDIĞI ADRES (GitHub Pages adresiniz)
                                          // Eğer farklı bir adreste barındırıyorsanız, onu yazın.
                                          // Yerelde test ediyorsanız: 'http://localhost:PORT_NUMARANIZ' gibi.
  optionsSuccessStatus: 200 
};
app.use(cors(corsOptions));

// ÖNEMLİ: PeerJS trafiği için de OPTIONS isteklerine izin verin.
// ExpressPeerServer'dan ÖNCE bu middleware'i ekleyin.
app.options('/myapp/*', cors(corsOptions)); // PeerJS path'iniz ne ise ona göre ayarlayın ('/myapp/*')

const server = http.createServer(app);

const peerServer = ExpressPeerServer(server, {
  path: '/myapp',        // İstemcide belirttiğiniz path ile aynı olmalı
  allow_discovery: true, // İsteğe bağlı
  debug: true,           // Hata ayıklama için logları artırır
  // generateClientId: () => require('uuid').v4() // İsteğe bağlı: Özel ID üretme
});

app.use(peerServer); // PeerJS sunucusunu /myapp (veya belirlediğiniz path) altına bağlayın

app.get('/', (req, res) => {
  res.send(`PeerJS sunucusu ${port} portunda çalışıyor. Bağlantı yolu: /myapp`);
});

peerServer.on('connection', (client) => {
  console.log(`PeerJS: Client bağlandı - ID: ${client.getId()}, IP: ${client.socket && client.socket._socket ? client.socket._socket.remoteAddress : 'Bilinmiyor'}`);
});

peerServer.on('disconnect', (client) => {
  console.log(`PeerJS: Client bağlantısı kesildi - ID: ${client.getId()}`);
});

peerServer.on('message', (client, message) => {
  console.log(`PeerJS: Client'tan mesaj - ID: ${client.getId()}, Mesaj Tipi: ${message.type}, Hedef: ${message.dst}, Kaynak: ${message.src}`);
});

peerServer.on('error', (error) => {
  console.error('PeerJS Sunucu Hatası:', error);
});

server.listen(port, () => {
  console.log(`HTTP sunucusu ${port} portunda dinleniyor.`);
  console.log(`PeerJS sunucusu /myapp yolu için yapılandırıldı.`);
  console.log(`İstemci bağlantı adresi (wss): wss://${process.env.RENDER_EXTERNAL_HOSTNAME || 'localhost'}/myapp`);
});