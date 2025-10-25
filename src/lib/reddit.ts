import { DraftPost } from "./types";

const REDDIT_API_URL = "https://www.reddit.com/r/";

export async function getRedditHotPosts(subreddit: string): Promise<DraftPost[]> {
  try {
    const response = await fetch(`${REDDIT_API_URL}${subreddit}/hot.json`);
    const data = await response.json();

    if (data.data.children.length === 0) {
      return [];
    }

    return data.data.children.map((post: any) => ({
      id: post.data.id,
      source: "reddit",
      topic: post.data.title,
      raw_generation: post.data.selftext,
      optimized_text: post.data.selftext,
      optimized_meta: {
        hooks: [],
        emotional_score: 0,
        engagement_prediction: 0,
      },
      status: "draft",
      createdAt: new Date(post.data.created_utc * 1000).toISOString(),
      postedAt: null,
      linkedinPostId: null,
    }));
  } catch (error) {
    console.error("Error fetching Reddit posts:", error);
    return [];
  }
}
