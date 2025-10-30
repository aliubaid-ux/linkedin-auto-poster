import { DraftPost, Profile } from "./types";

async function generatePost(title: string, selftext: string, profile: Profile): Promise<Partial<DraftPost>> {
  try {
    const response = await fetch('/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ topic: title, context: selftext, profile }),
    });

    if (!response.ok) {
      throw new Error(`Failed to generate content: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error in generatePost:", error);
    // Return a placeholder or error state if generation fails
    return {
      topic: title,
      raw_generation: "Error: Could not generate content.",
      optimized_text: "We couldn't generate a post for this topic. Please try again.",
    };
  }
}


export async function getRedditHotPosts(subreddit: string, profile: Profile): Promise<Omit<DraftPost, 'id' | 'createdAt' | 'user_id'>[]> {
  try {
    const response = await fetch(`/api/reddit?subreddit=${subreddit}`); // Fetch from the new API route
    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to fetch from Reddit API route: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.data || !data.data.children || data.data.children.length === 0) {
      return [];
    }

    const generationPromises = data.data.children
        .filter((post: any) => post.data.title) // Ensure there's content to work with
        .map(async (post: any) => {
            const generatedContent = await generatePost(post.data.title, post.data.selftext || '', profile);
            return {
                source: `reddit:r/${subreddit}`,
                topic: post.data.title,
                status: 'draft',
                postedAt: null,
                linkedinPostId: null,
                ...generatedContent,
            } as Omit<DraftPost, 'id' | 'createdAt' | 'user_id'>;
    });

    return Promise.all(generationPromises);

  } catch (error) {
    console.error("Error fetching or processing Reddit posts:", error);
    // Return an empty array or re-throw, depending on desired error handling
    return [];
  }
}
