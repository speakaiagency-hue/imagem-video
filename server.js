const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

app.post('/gerar-video', upload.single('imagem'), async (req, res) => {
  const prompt = req.body.prompt;
  const imagem = req.file;

  try {
    const response = await axios.post(
      'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=AIzaSyBzl8n29xiFFBEmLZKq5oSxMthTCWsf_ag',
      {
        contents: [
          {
            parts: [
              { text: prompt },
              {
                inlineData: {
                  mimeType: imagem.mimetype,
                  data: imagem.buffer.toString('base64')
                }
              }
            ]
          }
        ]
      },
      {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    );

    // Aqui você pode adaptar o que fazer com a resposta
    const resultado = response.data;
    console.log(resultado);

    // Simulando um link de vídeo por enquanto
    res.json({ videoUrl: 'https://exemplo.com/video-gerado.mp4' });
  } catch (error) {
    console.error('Erro ao chamar Gemini:', error.message);
    res.status(500).json({ error: 'Falha ao gerar conteúdo com Gemini' });
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});

