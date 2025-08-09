import express from "express";
import dotenv from "dotenv";
import OpenAI from "openai";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use("/", express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const openai = new OpenAI({
  baseURL: "https://api.deepseek.com",
  apiKey: process.env.DEEPSEEK_API_KEY
});

app.post("/api/generate-post", async (req, res) => {
  const { userPreferences } = req.body;

  try {
    const promptSystem = `
Eres un experto en redes sociales que genera textos creativos y originales.
Basado en las preferencias del usuario, crea 5 publicaciones originales con máximo 177 caracteres cada una.
Incluye humor ácido, datos curiosos o divulgativos y alterna estilos.
Devuelve SOLO un JSON válido con la propiedad "posts" que sea un array con los textos planos, sin numeraciones, símbolos extras ni texto fuera del JSON.
Ejemplo:
{
  "posts": [
    "Texto 1...",
    "Texto 2...",
    "Texto 3...",
    "Texto 4...",
    "Texto 5..."
  ]
}
`;

    const completion = await openai.chat.completions.create({
      model: "deepseek-chat",
      messages: [
        { role: "system", content: promptSystem },
        { role: "user", content: userPreferences }
      ],
      max_tokens: 300
    });

    const responseText = completion.choices[0].message.content;

    // Extraer JSON del texto
    const jsonMatch = responseText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return res.status(500).json({ error: "No se pudo extraer JSON válido de la respuesta." });
    }

    let jsonData;
    try {
      jsonData = JSON.parse(jsonMatch[0]);
    } catch {
      return res.status(500).json({ error: "JSON mal formado en la respuesta." });
    }

    return res.json(jsonData);

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      error: "Error generando publicación"
    });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor escuchando en http://localhost:${PORT} 🚀`);
});
