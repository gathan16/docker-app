const express = require('express');
const sql = require('mssql');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const dbConfig = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_HOST,
    database: process.env.DB_NAME,
    options: {
        encrypt: false,
        trustServerCertificate: true,
    },
};

sql.connect(dbConfig)
    .then(() => console.log('Terhubung ke SQL Server'))
    .catch(err => console.error('Koneksi gagal', err));

app.get('/users', async (req, res) => {
    try {
        const result = await sql.query('SELECT * FROM Users');
        res.json(result.recordset);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.post('/users', async (req, res) => {
    const { name, email } = req.body;
    try {
        await sql.query(`INSERT INTO Users (name, email) VALUES ('${name}', '${email}')`);
        res.status(201).json({ message: 'User berhasil ditambahkan' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

//html
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.listen(port, () => {
    console.log(`Server berjalan di http://localhost:${port}`);
});
