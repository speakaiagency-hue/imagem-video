const express = require('express');
const multer = require('multer');
const cors = require('cors');

const app = express();
app.use(cors());
const upload = multer({ dest: 'uploads/' });

app.post('/gerar-video', upload.single('imagem'), async (req, res) => {
  const prompt = req.body.prompt;
  const imagem = req.file;

  // Aqui você integraria com a API de geração de vídeo
  const videoUrl = 'https://exemplo.com/video-gerado.mp4'; // Simulado

  res.json({ videoUrl });
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
