import { GoogleGenerativeAI } from "@google/generative-ai";

if (!process.env.NEXT_PUBLIC_GEMINI_API_KEY) {
  throw new Error("Missing NEXT_PUBLIC_GEMINI_API_KEY");
}

// Initialize with API version
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY);

export async function generateSummary(content: string) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Extract text content from JSON structure
    const blocks = JSON.parse(content);
    const textContent = blocks
      .map((block: any) => {
        if (block.content) {
          return block.content
            .map((item: any) => item.text)
            .join(" ");
        }
        return "";
      })
      .join("\n")
      .trim();

    const prompt = `Please provide a concise summary of the following text, highlighting the main points and key ideas. Format each point as a bullet point starting with '•'. If you need to emphasize any text, use <strong>text</strong> instead of **text**:\n\n${textContent}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const summary = response.text();

    return summary || "Unable to generate summary.";
  } catch (error) {
    console.error("Error generating summary:", error);
    return "Error generating summary. Please try again.";
  }
}
