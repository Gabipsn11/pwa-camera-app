// backend/server.js
const express = require('express');
const multer = require('multer');
const path = require('path');
const cors = require('cors');
const fs = require('fs');

const app = express();
app.use(cors());
app.use(express.static('uploads'));

// Verifica se o diretório "uploads" existe, caso contrário cria
const uploadDir = 'uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configuração do Multer para armazenar imagens
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Renomeia o arquivo com timestamp
    }
});

const upload = multer({ storage: storage });

// Endpoint para receber upload de imagem
app.post('/upload', upload.single('image'), (req, res) => {
    if (req.file) {
        res.json({ imageUrl: `${req.protocol}://${req.get('host')}/${req.file.filename}` });
    } else {
        res.status(400).json({ error: 'Nenhum arquivo enviado.' });
    }
});

// Endpoint para listar as imagens
app.get('/images', (req, res) => {
    const directoryPath = path.join(__dirname, 'uploads');
    
    fs.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Erro ao carregar imagens.');
        }

        const images = files.map(file => `${req.protocol}://${req.get('host')}/${file}`);
        res.json(images);
    });
});

app.listen(5000, () => {
    console.log('Servidor rodando na porta 5000');
});
