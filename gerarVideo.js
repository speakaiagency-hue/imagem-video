import { GoogleGenAI } from "@google/genai";

// ✅ Chave da API Gemini válida
const ai = new GoogleGenAI({ apiKey: "AIzaSyBzl8n29xiFFBEmLZKq5oSxMthTCWsf_ag" });

const prompt = "Panning wide shot of a calico kitten sleeping in the sunshine";

async function gerarVideo() {
  try {
    // Etapa 1: gerar imagem com Gemini 2.5 Flash Image
    const imageResponse = await ai.models.generateContent({
      model: "gemini-2.5-flash-image",
      prompt: prompt,
    });

    const imageBytes = imageResponse.generatedImages[0].image.imageBytes;

    // Etapa 2: gerar vídeo com Veo 3.1 usando a imagem como referência
    let operation = await ai.models.generateVideos({
      model: "veo-3.1-generate-preview",
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
      downloadPath: "veo3_com_imagem.mp4",
    });

    console.log("✅ Vídeo gerado e salvo como veo3_com_imagem.mp4");
  } catch (error) {
    console.error("❌ Erro ao gerar vídeo:", error);
  }
}

gerarVideo();
