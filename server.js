const express = require('express');
const multer = require('multer');
const axios = require('axios');
const cors = require('cors');

const app = express();
const upload = multer();

app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = 'AIzaSyBzl8n29xiFFBEmLZKq5oSxMthTCWsf_ag';
const GEMINI_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro-vision:generateContent?key=${GEMINI_API_KEY}`;

app.post('/gerar-video', upload.single('imagem'), async (req, res) => {
  const prompt = req.body.prompt;
  const imagem = req.file;

  if (!prompt || !imagem) {
    return res.status(400).json({ error: 'Prompt e imagem são obrigatórios' });
  }

  try {
    const imagemBase64 = imagem.buffer.toString('base64');

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: imagem.mimetype,
                data: imagemBase64
              }
            }
          ]
        }
      ]
    };

    const response = await axios.post(GEMINI_ENDPOINT, payload, {
      headers: { 'Content-Type': 'application/json' }
    });

    const textoGerado = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!textoGerado) {
      return res.status(500).json({ error: 'Resposta da API vazia ou malformada' });
    }

    res.json({ respostaGemini: textoGerado });
  } catch (error) {
    const status = error.response?.status;
    const mensagem = error.response?.data?.error?.message || error.message;

    console.error('Erro ao chamar Gemini:', mensagem);

    if (status === 400) {
      return res.status(400).json({ error: 'Requisição malformada. Verifique o formato da imagem e do prompt.' });
    } else if (status === 403 || status === 401) {
      return res.status(401).json({ error: 'Chave de API inválida ou sem permissão.' });
    } else if (status === 429) {
      return res.status(429).json({ error: 'Limite de uso excedido. Tente novamente mais tarde.' });
    } else {
      return res.status(500).json({ error: 'Falha ao gerar conteúdo com Gemini', detalhe: mensagem });
    }
  }
});

app.listen(3000, () => {
  console.log('Servidor rodando na porta 3000');
});
