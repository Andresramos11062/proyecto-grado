const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const dotenv = require('dotenv');

dotenv.config();

// Registro
exports.registro = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length > 0) {
        return res.status(400).json({ mensaje: 'El usuario ya existe' });
      }

      const passwordEncriptada = await bcrypt.hash(password, 10);

      db.query(
        'INSERT INTO usuarios (usuario, password) VALUES (?, ?)',
        [usuario, passwordEncriptada],
        (err, result) => {
          if (err) return res.status(500).json({ error: err.message });
          res.status(201).json({ mensaje: 'Usuario registrado correctamente' });
        }
      );
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Login
exports.login = async (req, res) => {
  const { usuario, password } = req.body;

  try {
    db.query('SELECT * FROM usuarios WHERE usuario = ?', [usuario], async (err, results) => {
      if (err) return res.status(500).json({ error: err.message });

      if (results.length === 0) {
        return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
      }

      const user = results[0];

      const passwordValida = await bcrypt.compare(password, user.password);
      if (!passwordValida) {
        return res.status(400).json({ mensaje: 'Usuario o contraseña incorrectos' });
      }

      const token = jwt.sign(
        { id: user.id, usuario: user.usuario },
        process.env.JWT_SECRET,
        { expiresIn: '24h' }
      );

      res.json({
        mensaje: 'Login exitoso',
        token,
        usuario: {
          id: user.id,
          usuario: user.usuario
        }
      });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};