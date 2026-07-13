import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    const { type, product, message } = await request.json();

    let prompt = "";

    switch (type) {
      case "proscons":
        prompt = `
You are an expert shopping assistant.

Analyze ONLY this product.

Product Name: ${product.title}
Category: ${product.Category}
Price: ₹${product.Price}
Description: ${product.description}

Give:

✅ Advantages
- Exactly 2 bullet points

❌ Disadvantages
- Exactly 2 bullet points

Rules:
- Maximum 70 words.
- Be realistic.
`;
        break;

      case "worth":
        prompt = `
You are an expert shopping assistant.

Product Name: ${product.title}
Category: ${product.Category}
Price: ₹${product.Price}
Description: ${product.description}

Is this product worth buying?

Rules:
- Start with Yes, No, or Depends.
- Explain in 2-3 short sentences.
- Maximum 60 words.
`;
        break;

      case "bestfor":
        prompt = `
You are an expert shopping assistant.

Product Name: ${product.title}
Category: ${product.Category}
Description: ${product.description}

Who is this product best suited for?

Rules:
- Maximum 4 bullet points.
`;
        break;

      case "occasion":
        prompt = `
You are an expert shopping assistant.

Product Name: ${product.title}
Category: ${product.Category}
Description: ${product.description}

List the best occasions for using this product.

Rules:
- Maximum 4 bullet points.
- Each point under 8 words.
`;
        break;

      case "chat":
        prompt = `
You are an AI shopping assistant.

Product Name: ${product.title}
Category: ${product.Category}
Price: ₹${product.Price}
Description: ${product.description}

User Question:
${message}

Answer naturally and only about this product.
`;
        break;

      default:
        return NextResponse.json(
          { error: "Invalid request type." },
          { status: 400 }
        );
    }

    const response = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "openai/gpt-4.1-nano",
          messages: [
            {
              role: "system",
              content:
                "You are a concise shopping assistant. Keep answers short, accurate and helpful.",
            },
            {
              role: "user",
              content: prompt,
            },
          ],
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
  console.error(data);

  return NextResponse.json(
    {
      error: data.error?.message || "OpenRouter API Error",
    },
    {
      status: response.status,
    }
  );
}

    return NextResponse.json({
      answer: data.choices[0].message.content,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json(
      {
        error: error.message,
      },
      {
        status: 500,
      }
    );
  }
}