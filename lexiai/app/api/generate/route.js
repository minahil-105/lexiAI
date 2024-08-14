// app/api/generate/route.js
import { NextResponse } from 'next/server';
import { model } from '../../lib/utils'; // Ensure this path is correct

const systemPrompt = `
You are a flashcard creator. You take in text and create exactly 10 flashcards from it.
Both front and back should be one sentence long.
Return the result in the following JSON format:
{
  "flashcards":[
    {
      "front": "Front of the card",
      "back": "Back of the card"
    }
  ]
}
`;

export async function POST(req) {
  const data = await req.text();

  try {
    // Generate the prompt with the system prompt and user input
    const prompt = `${systemPrompt}\n\nUser input: ${data}`;

    // Call the appropriate method on the model instance
    const response = await model.generate({ prompt });

    // Handle response and format as needed
    const flashcards = response.choices?.[0]?.text || [];

    return NextResponse.json({ flashcards });
  } catch (error) {
    console.error('Error generating flashcards:', error);
    return NextResponse.json({ error: 'An error occurred while generating flashcards' }, { status: 500 });
  }
}
