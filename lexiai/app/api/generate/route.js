import { NextResponse } from 'next/server'
import OpenAI from 'openai'
import { model } from '@/lib/utils';

// export async function POST(req) {
//   const openai = new OpenAI()
//   const data = await req.text()

//   const completion = await openai.chat.completions.create({
//     messages: [
//       { role: 'system', content: systemPrompt },
//       { role: 'user', content: data },
//     ],
//     model: 'gpt-4o',
//     response_format: { type: 'json_object' },
//   })

// We'll process the API response in the next step
// }


const SYSTEM_PROMPT = `
    System prompt: You are a flashcard creator, you take in text and create multiple flashcards from it. Make sure to create exactly 10 flashcards.
    Both front and back should be one sentence long.
    You should return in the following JSON format:
    {
    "flashcards":[
        {
        "front": "Front of the card",
        "back": "Back of the card"
        }
    ]
    }
    `


export async function POST(request) {
  try {
    const { message } = await request.json();

    console.log('message: ' + message);

    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: SYSTEM_PROMPT }],
        },
      ]
    });
    const result = await chat.sendMessage(message);
    return NextResponse.json({ response: result.response.text() });
  } catch (error) {
    console.log('Error:', error);
    return NextResponse.json({ error: 'Error processing your request' }, { status: 500 });
  }
}