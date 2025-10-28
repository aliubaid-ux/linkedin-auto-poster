import { DraftPost, Profile } from "./types";

const REDDIT_API_URL = "https://www.reddit.com/r/";

// This is a placeholder for a real AI generation call.
async function generatePost(title: string, selftext: string, profile: Profile): Promise<Partial<DraftPost>> {
  // Simulate AI processing time
  await new Promise(resolve => setTimeout(resolve, 1500));

  const systemPrompt = `
    SYSTEM PROMPT:
    You are LinkFlow AI, a specialized AI assistant for creating engaging LinkedIn posts.
    Your goal is to transform a raw idea or a piece of text into a well-structured, engaging LinkedIn post, tailored to the user's professional profile.

    USER PROFILE:
    - Name: ${profile.name}
    - Niches of Expertise: ${profile.niches.join(", ")}
    - Preferred Tone: ${profile.tone}

    TASK:
    Analyze the provided Reddit post (title and body) and generate a LinkedIn post.
    1.  **Generate Raw Text:** First, create a draft that expands on the original idea, incorporating the user's niches and tone. This should be a brainstorming/first-pass version.
    2.  **Optimize Text:** Refine the raw text into a final, publishable LinkedIn post. Make it concise, add emojis, use formatting (like bullet points), and include a strong call to action (CTA).
    3.  **Analyze & Meta:** Provide metadata for the optimized post.
        - Identify 2-3 engaging hooks from the post.
        - List 2-3 specific adjustments you made from the raw text to the optimized version to match the user's tone.
        - Predict the potential for engagement, tone match, and emotional resonance on a scale of 0 to 1.
  `;

  const raw_generation = `
    ${systemPrompt}

    ---

    RAW GENERATION:
    Original Topic: "${title}"
    This is a simulated raw generation. Based on the topic and the user's profile, I'm expanding on the key ideas.
    - Idea 1: Connect ${title} to ${profile.niches[0] || 'the user\\'s main niche'}.
    - Idea 2: Discuss the implications from a ${profile.tone} perspective.
    - Idea 3: Add a personal anecdote related to the topic.
    (This would be a longer, more fleshed-out text in a real scenario).
    ${selftext}
  `;

  const optimized_text = `
    🚀 ${title} 🚀

    Just came across a fascinating discussion on Reddit and had to share my thoughts, especially how it relates to ${profile.niches[0] || 'my field'}.

    Here's the lowdown:
    - Key takeaway 1 related to the post.
    - Key takeaway 2 with a spin from my experience in ${profile.niches[1] || profile.niches[0] || 'my niche'}.
    - A surprising insight that connects it all together.

    It's clear that trends in this area are moving fast! Adopting a ${profile.tone} approach is crucial for staying ahead.

    What are your thoughts on this? Drop a comment below! 👇

    #${profile.niches[0]?.replace(/\s/g, '') || 'Innovation'} #${title.split(' ')[0]} #LinkedIn
  `;

  return {
    raw_generation,
    optimized_text,
    optimized_meta: {
      hooks: ["Just came across a fascinating discussion...", "Here's the lowdown:", "What are your thoughts on this?"],
      tone_adjustments: ["Added emojis for better readability.", "Simplified the language to be more direct.", "Included a clear call to action."],
      engagement_prediction: Math.random() * 0.4 + 0.5, // 0.5 - 0.9
      tone_score: Math.random() * 0.3 + 0.7,      // 0.7 - 1.0
      emotional_score: Math.random() * 0.4 + 0.4, // 0.4 - 0.8
    },
  };
}


export async function getRedditHotPosts(subreddit: string, profile: Profile): Promise<Omit<DraftPost, \'id\' | \'createdAt\' | \'user_id\'>[]> {
  try {
    const response = await fetch(`${REDDIT_API_URL}${subreddit}/hot.json?limit=5`); // Fetch top 5 hot posts
    if (!response.ok) {
        throw new Error(`Failed to fetch from Reddit: ${response.statusText}`);
    }
    const data = await response.json();

    if (!data.data || !data.data.children || data.data.children.length === 0) {
      return [];
    }

    const generationPromises = data.data.children
        .filter((post: any) => post.data.title && post.data.selftext) // Ensure there's content to work with
        .map(async (post: any) => {
            const generatedContent = await generatePost(post.data.title, post.data.selftext, profile);
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
