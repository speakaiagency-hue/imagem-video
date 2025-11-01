const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Para ler JSON no corpo da requisição

const upload = multer({ dest: 'uploads/' });

// Rota de teste para confirmar que a API está ativa
app.get('/', (req, res) => {
  res.send('API imagem-video está ativa!');
});

// Rota principal para geração de vídeo
app.post('/gerar-video', upload.single('imagem'), async (req, res) => {
  const prompt = req.body.prompt;
  const imagem = req.file;

  // Aqui você integraria com a API de geração de vídeo
  const videoUrl = 'https://exemplo.com/video-gerado.mp4'; // Simulado

  res.json({ videoUrl });
});

// Porta dinâmica exigida pelo Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});
