import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Function to generate flashcards
export const generateFlashcards = async (prompt: string) => {
    try {
        const response = await openai.chat.completions.create({
            model: "gpt-4o-mini", // Using GPT-4o Mini
            messages: [{ role: "user", content: `Generate flashcards as an array of objects in for learning ${prompt}. Each object should have a 'question' and an 'answer' field.` }],
            max_tokens: 100,
            temperature: 0.7,
        });

        // Null check or fallback value for `response.choices[0].message.content`
        const content = response.choices[0].message?.content ?? "";

        // Check if the content is a valid JSON string
        if (!content) {
            throw new Error("OpenAI response content is empty or null");
        }


        return content; // Return the flashcards generated
    } catch (error) {
        console.error("Error generating flashcards:", error);
        throw new Error("Failed to generate flashcards");
    }
};
