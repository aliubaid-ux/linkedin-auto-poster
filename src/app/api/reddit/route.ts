import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const subreddit = searchParams.get('subreddit');

  if (!subreddit) {
    return NextResponse.json({ error: 'Subreddit is required' }, { status: 400 });
  }

  try {
    const response = await fetch(`https://www.reddit.com/r/${subreddit}/hot.json?limit=5`);
    if (!response.ok) {
      throw new Error(`Failed to fetch from Reddit: ${response.statusText}`);
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: (error as Error).message }, { status: 500 });
  }
}
