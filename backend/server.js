const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();
const apiAuthRoutes = require('../routes/apiAuth');

const app = express();

// CORS ayarları
app.use(cors({
  origin: [
    `http://localhost:${process.env.FRONTEND_PORT}`,
    `http://localhost:${process.env.FRONTEND_DEV_PORT}`,
    `http://localhost:${process.env.FRONTEND_EXPO_PORT}`
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());
app.use('/api/auth', apiAuthRoutes);

// Veritabanı bağlantı havuzu
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Veritabanı bağlantı kontrolü
const checkDatabaseConnection = () => {
  return new Promise((resolve, reject) => {
    pool.getConnection((err, connection) => {
      if (err) {
        console.error('❌ Veritabanı bağlantı hatası:', err.message);
        reject(err);
        return;
      }
      
      // Test sorgusu çalıştır
      connection.query('SELECT 1', (error, results) => {
        connection.release();
        
        if (error) {
          console.error('❌ Veritabanı sorgu hatası:', error.message);
          reject(error);
          return;
        }
        
        console.log('✅ Veritabanı bağlantısı başarılı');
        console.log(`📊 Veritabanı: ${process.env.DB_NAME}`);
        console.log(`🌐 Host: ${process.env.DB_HOST}`);
        resolve(true);
      });
    });
  });
};

// Başlangıçta veritabanı bağlantısını kontrol et
checkDatabaseConnection()
  .then(() => {
    // Poliklinikler endpoint'i
    app.get('/api/poliklinikler', (req, res) => {
      console.log('📥 Poliklinik isteği alındı');
      pool.query('SELECT * FROM poliklinikler ORDER BY poliklinikID', (err, results) => {
        if (err) {
          console.error('❌ Veritabanı hatası:', err);
          return res.status(500).json({ error: 'Veritabanı hatası', message: err.message });
        }
        console.log('✅ Poliklinikler verisi gönderiliyor:', results);
        res.json(results);
      });
    });

    app.get('/api/poliklinikler/:id', (req, res) => {
      const { id } = req.params;
    
      const sql = `
        SELECT 
          poliklinikler.poliklinikID, 
          poliklinikler.poliklinikAdi, 
          hastaliklar.hastalikID, 
          hastaliklar.hastalikAdi
        FROM poliklinikler
        LEFT JOIN iliski_ph ON poliklinikler.poliklinikID = iliski_ph.poliklinikID
        LEFT JOIN hastaliklar ON hastaliklar.hastalikID = iliski_ph.hastalikID
        WHERE poliklinikler.poliklinikID = ?
      `;
    
      pool.query(sql, [id], (err, results) => {
        if (err) {
          console.error('❌ Veritabanı hatası:', err);
          return res.status(500).json({ error: 'Veritabanı hatası', message: err.message });
        }
    
        if (results.length === 0) {
          return res.status(404).json({ error: 'Poliklinik bulunamadı' });
        }
    
        const poliklinik = {
          poliklinikID: results[0].poliklinikID,
          poliklinikAdi: results[0].poliklinikAdi,
          hastaliklar: results
            .filter(row => row.hastalikID !== null)
            .map(row => ({
              hastalikID: row.hastalikID,
              hastalikAdi: row.hastalikAdi
            }))
        };
        
    
        res.json(poliklinik);
      });
    });

    app.get('/api/hastaliklar/:id', async (req, res) => {
      const { id } = req.params;
    
      try {
        // 1) Hastalık bilgilerini al
        const [hastalikRows] = await pool.promise().query(`
          SELECT hastalikAdi 
          FROM hastaliklar
          WHERE hastalikID = ?
        `, [id]);
    
        if (hastalikRows.length === 0) {
          return res.status(404).json({ error: 'Hastalık bulunamadı' });
        }
    
        const hastalik = {
          hastalikAdi: hastalikRows[0].hastalikAdi,
        };
    
        // 2) Poliklinik listesini al
        const [poliklinikRows] = await pool.promise().query(`
          SELECT p.poliklinikID, p.poliklinikAdi
          FROM poliklinikler p
          JOIN iliski_ph ip ON p.poliklinikID = ip.poliklinikID
          WHERE ip.hastalikID = ?
        `, [id]);
    
        const poliklinikler = poliklinikRows.map(p => ({
          poliklinikID: p.poliklinikID,
          poliklinikAdi: p.poliklinikAdi
        }));
    
        // 3) Belirtiler listesini al
        const [belirtiRows] = await pool.promise().query(`
          SELECT b.belirtiAdi
          FROM belirtiler b
          JOIN iliski_hb ihb ON b.belirtiID = ihb.belirtiID
          WHERE ihb.hastalikID = ?
        `, [id]);
    
        const belirtiler = belirtiRows.map(b => ({
          belirtiAdi: b.belirtiAdi
        }));
    
        // Nihai JSON yapısını dön
        res.json({
          hastalik,
          poliklinikler,
          belirtiler
        });
    
      } catch (error) {
        console.error('❌ Veritabanı hatası:', error);
        res.status(500).json({
          error: 'Veritabanı hatası',
          message: error.message
        });
      }
    });
    
    
        // Hastalıklar endpoint'i
    app.get('/api/hastaliklar', (req, res) => {
      console.log('📥 Hastalık isteği alındı');

      pool.query('SELECT * FROM hastaliklar ORDER BY hastalikID', (err, results) => {
        if (err) {
          console.error('❌ Veritabanı hatası:', err);
          return res.status(500).json({  error: 'Veritabanı hatası',message: err.message });
        }
        console.log('✅ Hastaliklar verisi gönderiliyor:', results);
        res.json(results);
      });
    });
    
  
     // Belirtiler endpoint'i
    app.get('/api/belirtiler', (req, res) => {
      pool.query('SELECT * FROM belirtiler ORDER BY belirtiID', (err, results) => {
        if (err) {
          console.error('❌ Veritabanı hatası:', err);
          return res.status(500).json({
            error: 'Veritabanı hatası',
            message: err.message
          });
        }
        console.log('✅ Belirtiler verisi gönderiliyor:', results);
        res.json(results);
      });
    });
    // Kullanıcının belirtilerine göre hastalık tahmini yapan API
    app.post('/api/tahmin', async (req, res) => {
      let { belirtiler } = req.body;

      if (!Array.isArray(belirtiler) || belirtiler.length === 0) {
        return res.status(400).json({ error: 'Geçerli belirtiler listesi sağlanmalıdır.' });
      }

      // String olarak gelirse sayıya çevir
      belirtiler = belirtiler.map(Number);

      try {
        console.log('Gelen belirtiler:', belirtiler); // Gelen veriyi logla

        const hastalikQuery = `
          SELECT 
            h.hastalikID, h.hastalikAdi, h.hastalikAciklama, 
            b.belirtiAdi, 
            p.poliklinikAdi, p.poliklinikID
          FROM iliski_hb hb
          JOIN hastaliklar h ON h.hastalikID = hb.hastalikID
          JOIN belirtiler b ON b.belirtiID = hb.belirtiID
          LEFT JOIN iliski_ph hp ON hp.hastalikID = h.hastalikID
          LEFT JOIN poliklinikler p ON p.poliklinikID = hp.poliklinikID
          WHERE hb.belirtiID IN (${belirtiler.map(() => '?').join(',')})
        `;
        console.log('SQL Sorgusu:', hastalikQuery); // SQL sorgusunu logla
        console.log('Parametreler:', belirtiler); // SQL parametrelerini logla

        const [rows] = await pool.promise().query(hastalikQuery, belirtiler);
        console.log('Sorgu sonuçları:', rows); // Sorgu sonuçlarını logla

        let hastalikIDMap = {};
        rows.forEach(row => {
          if (!hastalikIDMap[row.hastalikID]) {
            hastalikIDMap[row.hastalikID] = {
              id: row.hastalikID,
              adi: row.hastalikAdi,
              aciklama: row.hastalikAciklama,
              belirtiler: [],
              tumBelirtiler: [],
              poliklinikler: []
            };
          }
          if (!hastalikIDMap[row.hastalikID].belirtiler.includes(row.belirtiAdi)) {
            hastalikIDMap[row.hastalikID].belirtiler.push(row.belirtiAdi);
          }
          if (row.poliklinikAdi && !hastalikIDMap[row.hastalikID].poliklinikler.some(p => p.poliklinikID === row.poliklinikID)) {
            hastalikIDMap[row.hastalikID].poliklinikler.push({
              poliklinikID: row.poliklinikID,
              poliklinikAdi: row.poliklinikAdi
            });
          }
        });

        let hastaliklar = Object.values(hastalikIDMap);
        hastaliklar.sort((a, b) => b.belirtiler.length - a.belirtiler.length);

        for (let hastalik of hastaliklar) {
          const belirtilerQuery = `
            SELECT b.belirtiAdi
            FROM iliski_hb hb
            JOIN belirtiler b ON b.belirtiID = hb.belirtiID
            WHERE hb.hastalikID = ?
          `;
          const [belirtiRows] = await pool.promise().query(belirtilerQuery, [hastalik.id]);
          hastalik.tumBelirtiler = belirtiRows.map(row => row.belirtiAdi);

          const poliklinikQuery = `
            SELECT p.poliklinikAdi, p.poliklinikID
            FROM iliski_ph hp
            JOIN poliklinikler p ON p.poliklinikID = hp.poliklinikID
            WHERE hp.hastalikID = ?
          `;
          const [poliklinikRows] = await pool.promise().query(poliklinikQuery, [hastalik.id]);
          hastalik.poliklinikler = poliklinikRows;
        }

        const gosterilecekHastaliklar = hastaliklar.slice(0, 5);
        console.log('postTahmin gönderilen veri:', { belirtiler });

        if (gosterilecekHastaliklar.length === 0) {
          return res.status(404).json({ error: 'Belirtilerinizle eşleşen hastalık bulunamadı.' });
        }

         res.json(gosterilecekHastaliklar);
      } catch (error) {
        console.error('Tahmin yapılırken hata oluştu:', {
          message: error.message,
          sqlMessage: error.sqlMessage,
          sql: error.sql,
          code: error.code
        });
        res.status(500).json({ 
          error: 'Sunucu hatası',
          details: {
            message: error.message,
            sqlMessage: error.sqlMessage,
            code: error.code
          }
        });
      }
    });

    

    // Sunucu başlatma
    const PORT = process.env.BACKEND_PORT || 8082;
    app.listen(PORT, () => {
      console.log(`🚀 Sunucu ${PORT} portunda çalışıyor`);
    });
  })
  .catch((error) => {
    console.error('❌ Uygulama başlatılamadı:', error.message);
    process.exit(1);
  });

module.exports = app; 