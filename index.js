
// 1. Importar dependencias y librerías
import dotenv from "dotenv";
import express from 'express';
import mysql from 'mysql2';

dotenv.config();

// 2. Crear aplicación Express
const app = express();
app.use(express.json());

// 3. Configurar conexión a la base de datos AWS
const db= mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER, 
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT    
});

// 4. Conectar a la base de datos
db.connect(err => {
  if (err) {
    console.error('❌ Error al conectar a la base de datos:', err);
    return;
  }
  console.log('✅ Conectado correctamente a la base de datos AWS');
});

// 5. Ruta de prueba
app.get('/', (req, res) => {
  res.send('🌺 Servidor de AlohaHotel funcionando correctamente');
});

// 6. Ruta para ver todos los clientes
app.get('/clientes', (req, res) => {
  const sql = 'SELECT * FROM Clientes';
  db.query(sql, (err, results) => {
    if (err) {
      console.error('❌ Error al obtener clientes:', err);
      res.status(500).send('Error al obtener los clientes');
      return;
    }
    res.json(results);
  });
});

// 7. Ruta para agregar un nuevo cliente
app.post('/clientes', (req, res) => {
  const { nombre, apellido, telefono, email, documento_identidad } = req.body;

  if (!nombre || !apellido || !telefono || !email || !documento_identidad) {
    return res.status(400).send('Faltan datos del cliente');
  }

  const sql = 'INSERT INTO Clientes (nombre, apellido, telefono, email, documento_identidad) VALUES (?, ?, ?, ?, ?)';
  db.query(sql, [nombre, apellido, telefono, email, documento_identidad], (err, result) => {
    if (err) {
      console.error('❌ Error al agregar cliente:', err);
      res.status(500).send('Error al agregar cliente');
      return;
    }
    res.send('✅ Cliente agregado correctamente');
  });
});

// 8. Iniciar servidor
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor backend ejecutándose en http://localhost:${PORT}`);
});