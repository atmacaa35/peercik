// server.js
const express = require('express');
const http = require('http'); // Node.js'in yerleşik HTTP modülü
const { PeerServer } = require('peer'); // 'peer' kütüphanesinden PeerServer

const app = express();
const PORT = process.env.PORT || 3000; // Render platformu PORT'u ortam değişkeni olarak sağlar

// Express uygulaması için bir HTTP sunucusu oluşturun
const httpServer = http.createServer(app);

// PeerServer'ı yapılandırın ve mevcut HTTP sunucusuna bağlayın
// İstemciniz path: '/myapp' kullandığı için burada da aynı path'i kullanıyoruz.
PeerServer({
  server: httpServer, // PeerServer'ı oluşturduğumuz HTTP sunucusuna bağlıyoruz
  path: '/myapp',     // İstemciler wss://peercik.onrender.com/myapp adresine bağlanacak
  proxied: true     // Render gibi bir proxy arkasında çalışırken IP adreslerinin doğru alınması için önerilir
});

// Sunucunun çalıştığını kontrol etmek için basit bir GET endpoint'i
app.get('/', (req, res) => {
  res.send('PeerJS destekli Express sunucusu çalışıyor. PeerJS istemcileri /myapp yoluna bağlanmalıdır.');
});

// HTTP sunucusunu belirtilen portta dinlemeye başlayın
httpServer.listen(PORT, () => {
  console.log(`HTTP sunucusu ${PORT} portunda dinleniyor.`);
  console.log(`PeerJS sunucusu /myapp yolu için yapılandırıldı.`);
  console.log(`İstemci bağlantı adresi: wss://peercik.onrender.com/myapp (veya sizin Render URL'niz)`);
});