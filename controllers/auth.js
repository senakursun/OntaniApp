const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const mysql = require("mysql2");

const db = mysql.createPool({
  host: 'localhost',
  user: 'root',
  password: 'sena2803',
  database: 'epiz_25736516_online_on_tani',
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

// MOBİL KAYIT (REGISTER)
exports.apiRegister = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Tüm alanlar zorunludur.' });
  }

  // İsim ve soyadı ayırma
  const nameParts = name.trim().split(' ');
  const firstName = nameParts[0];
  const lastName = nameParts.length > 1 ? nameParts.slice(1).join(' ') : '';

  if (!lastName) {
    return res.status(400).json({ message: 'Lütfen ad ve soyadınızı giriniz.' });
  }

  db.query('SELECT email FROM uyeler WHERE email = ?', [email], async (error, results) => {
    if (error) return res.status(500).json({ message: 'Veritabanı hatası.' });

    if (results.length > 0) {
      return res.status(400).json({ message: 'Bu e-mail zaten kullanılıyor!' });
    }

    let hashedPassword = await bcrypt.hash(password, 8);

    db.query(
      'INSERT INTO uyeler SET ?',
      { 
        uyeAdi: firstName, 
        uyeSoyadi: lastName,
        email: email, 
        sifre: hashedPassword 
      },
      (error, results) => {
        if (error) {
          console.error('Database error:', error);
          return res.status(500).json({ message: 'Kayıt sırasında hata oluştu.' });
        }

        const user = { 
          id: results.insertId, 
          name: firstName,
          surname: lastName,
          email: email 
        };
        const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
        return res.status(201).json({ ...user, token });
      }
    );
  });
};

// MOBİL GİRİŞ (LOGIN)
exports.apiLogin = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'E-posta ve şifre zorunludur.' });
  }

  db.query('SELECT * FROM uyeler WHERE email = ?', [email], async (error, results) => {
    if (error) return res.status(500).json({ message: 'Veritabanı hatası.' });

    if (!results || results.length === 0 || !(await bcrypt.compare(password, results[0].sifre))) {
      return res.status(400).json({ message: 'E-posta veya şifre yanlış.' });
    }

    const user = {
      id: results[0].uyeID,
      name: results[0].uyeAdi,
      surname: results[0].uyeSoyadi,
      email: results[0].email
    };
    const token = jwt.sign({ id: user.id }, 'secret_key', { expiresIn: '1h' });
    return res.status(200).json({ ...user, token });
  });
}; 