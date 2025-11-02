import { GoogleGenAI } from "@google/genai";

// ✅ Chave da API Gemini
const ai = new GoogleGenAI({ apiKey: "AIzaSyB1oZMTY9gU-xt5z3xL7ylc9TtGbnX3GNk" });

const prompt = "Panning wide shot of a calico kitten sleeping in the sunshine";

async function gerarVideo() {
  try {
    let imageBytes;

    // Etapa 1: tentar gerar imagem com modelo multimodal liberado
    try {
      const imageResponse = await ai.models.generateContent({
        model: "gemini-2.0-flash-preview-image-generation",
        contents: [
          {
            parts: [{ text: prompt }]
          }
        ]
      ];
      imageBytes = imageResponse.generatedImages?.[0]?.image?.imageBytes;
      if (!imageBytes) throw new Error("Imagem não gerada");
      console.log("✅ Imagem gerada com gemini-2.0-flash-preview-image-generation");
    } catch (imageError) {
      console.warn("⚠️ Falha ao gerar imagem com modelo multimodal. Usando fallback de texto.");
      const textResponse = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: [
          {
            parts: [{ text: `Descreva uma imagem para este prompt: ${prompt}` }]
          }
        ]
      });
      const description = textResponse.candidates?.[0]?.content?.parts?.[0]?.text || "Imagem de um gatinho dormindo ao sol";
      console.log("📝 Descrição gerada:", description);
      throw new Error("Imagem não disponível — fallback para descrição");
    }

    // Etapa 2: gerar vídeo com Veo 2.0 usando a imagem como referência
    let operation = await ai.models.generateVideos({
      model: "veo-2.0-generate-001",
      prompt: prompt,
      image: {
        imageBytes: imageBytes,
        mimeType: "image/png",
      },
    });

    // Etapa 3: polling até o vídeo estar pronto
    while (!operation.done) {
      console.log("⏳ Esperando o vídeo ficar pronto...");
      await new Promise((resolve) => setTimeout(resolve, 10000));
      operation = await ai.operations.getVideosOperation({ operation });
    }

    // Etapa 4: salvar o vídeo localmente
    await ai.files.download({
      file: operation.response.generatedVideos[0].video,
      downloadPath: "veo2_com_imagem.mp4",
    });

    console.log("✅ Vídeo gerado e salvo como veo2_com_imagem.mp4");
  } catch (error) {
    console.error("❌ Erro ao gerar vídeo:", error.message || error);
  }
}

gerarVideo();
