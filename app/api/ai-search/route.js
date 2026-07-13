import { GoogleGenAI } from "@google/genai";
import connectDB from "@/lib/db";
import Product from "@/models/Product";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

async function generateVector(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-001",
    contents: text,
  });

  return response.embeddings[0].values;
}

export async function POST(request) {
  try {
    const { query } = await request.json();

    //     const response = await ai.models.generateContent({
    //       model: "gemini-3-flash-preview",
    //       contents: `
    // You are an AI shopping assistant.

    // Rewrite the customer's query into a richer shopping search.

    // Include:

    // - synonyms
    // - product category
    // - intended usage
    // - occasion
    // - style
    // - materials if applicable

    // Return ONLY one sentence.

    // User Query:

    // ${query}
    // `,
    //     });
    const queryEmbedding = await generateVector(query);
    await connectDB();

    const results = await Product.aggregate([
      {
        $vectorSearch: {
          index: "vector_index",
          path: "embedding",
          queryVector: queryEmbedding,
          numCandidates: 100,
          limit: 10,
        }
      },
      {
        $project: {
          title: 1,
          description: 1,
          Price: 1,
          image: 1,
          Category: 1,
          score: { $meta: "vectorSearchScore" }
        }
      }
    ]);
    const threshold = 0.03;

    const bestScore = results[0].score;

    const filteredResults = results.filter(
      product => bestScore - product.score <= threshold
    );
    console.log("Results:", filteredResults);
    return Response.json(filteredResults);
  }
  catch (error) {
    console.error(error);

    return Response.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}