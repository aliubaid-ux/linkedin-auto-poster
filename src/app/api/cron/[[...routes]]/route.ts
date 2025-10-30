
import {Hono} from 'hono';
import {handle} from 'hono/vercel';
import {getTrendingTopics} from '@/lib/reddit';
import {generateLinkedinPost} from '@/ai/flows/generate-linkedin-post';
import {createClient} from '@/lib/supabase-server';
import {getProfile} from '@/lib/data';

export const runtime = 'edge';

const app = new Hono().basePath('/api/cron');

app.get('/daily-post', async c => {
  const supabase = createClient();
  const {data: profiles} = await supabase
    .from('profiles')
    .select('*')
    .eq('posting_mode', 'auto');

  if (!profiles) {
    return c.json({message: 'No profiles to process'});
  }

  for (const profile of profiles) {
    const trendingTopics = await getTrendingTopics(profile.niches);
    const post = await generateLinkedinPost(trendingTopics);

    await supabase.from('posts').insert([
      {
        profile_id: profile.id,
        content: post.content,
        status: 'draft',
      },
    ]);
  }

  return c.json({message: `${profiles.length} posts generated`});
});

export const GET = handle(app);
