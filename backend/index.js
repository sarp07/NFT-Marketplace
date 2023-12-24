const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

const db = mysql.createPool({
    host: 'localhost',
    user: 'your_username',
    password: 'your_password',
    database: 'myapp'
});

// Kullanıcı ekleme
app.post('/users', (req, res) => {
    const { wallet_address, username, is_artist, profile_image_url } = req.body;
    db.query(
        'INSERT INTO users (wallet_address, username, is_artist, profile_image_url) VALUES (?, ?, ?, ?)',
        [wallet_address, username, is_artist, profile_image_url],
        (err, result) => {
            if (err) throw err;
            res.send('User added');
        }
    );
});

// Kullanıcı bilgilerini getirme
app.get('/users/:wallet_address', (req, res) => {
    const { wallet_address } = req.params;
    db.query(
        'SELECT * FROM users WHERE wallet_address = ?',
        [wallet_address],
        (err, result) => {
            if (err) throw err;
            res.json(result);
        }
    );
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
