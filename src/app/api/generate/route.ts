import { NextRequest, NextResponse } from 'next/server';
import { run } from '@genkit-ai/tools';
import { generatePostFlow } from '@/ai/flows/generate-linkedin-post';

export async function POST(req: NextRequest) {
  const { topic, context, profile } = await req.json();

  if (!topic || !profile) {
    return NextResponse.json({ error: 'Missing topic or profile' }, { status: 400 });
  }

  try {
    const generatedContent = await run(generatePostFlow, { topic, context: context || '', profile });
    return NextResponse.json(generatedContent);
  } catch (error) {
    console.error('Error generating content:', error);
    return NextResponse.json({ error: 'Failed to generate content' }, { status: 500 });
  }
}
