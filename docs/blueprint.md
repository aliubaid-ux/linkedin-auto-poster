# **App Name**: LinkFlow AI

## Core Features:

- Profile Configuration: Allows users to input their profile details, niche tags, tone preferences, and preferred posting window.
- Trending Topic Fetching: Fetches trending topics from sources like Reddit, Hacker News, and Google Trends, filtered by user's niches, using an Edge Function.
- AI-Powered Post Generation: Generates initial LinkedIn post drafts based on trending topics, user's profile, niche tags, and tone preferences, leveraging AI with prompts for generation, optimization and tool use.
- Post Optimization: Double-passes the generated posts through an AI optimizer to maximize human tone and virality.
- Tone Check: Compares the generated post's tone against the user's learned tone profile, making adjustments if there's a mismatch and adjusting prompts to match the learned tone.
- Automated Posting: Automatically posts the optimized content to LinkedIn via the LinkedIn API, triggered by a scheduled Vercel Edge function or queue posts when in Manual mode.
- Draft Management: A dashboard where users can review, edit, and approve generated drafts before posting, store locally or manage drafts on Vercel KV.

## Style Guidelines:

- Primary color: Light indigo (#7986CB) for a professional and trustworthy feel.
- Background color: Very light grey (#F5F5F5), providing a clean and neutral backdrop.
- Accent color: Teal (#4DB6AC) to highlight important CTAs and create visual interest.
- Body and headline font: 'Inter' for a modern, clean, and readable sans-serif experience.
- Use simple and professional icons from a consistent set (e.g., Material Design Icons).
- Clean and organized layout with a focus on readability. Use cards for displaying content and drafts.
- Subtle transitions and animations for a smooth user experience. Avoid overly distracting animations.