import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.57.4';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
const gnewsApiKey = Deno.env.get('GNEWS_API_KEY');

const supabase = createClient(supabaseUrl, supabaseServiceKey);

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    if (!gnewsApiKey) {
      throw new Error('GNEWS_API_KEY not configured');
    }

    console.log('Fetching latest Indian news from GNews...');

    // Fetch news from GNews API
    const newsResponse = await fetch(
      `https://gnews.io/api/v4/search?q=India&lang=en&country=in&max=10&apikey=${gnewsApiKey}`
    );

    if (!newsResponse.ok) {
      throw new Error(`GNews API error: ${newsResponse.status}`);
    }

    const newsData = await newsResponse.json();
    console.log(`Fetched ${newsData.articles?.length || 0} articles`);

    if (!newsData.articles || newsData.articles.length === 0) {
      return new Response(
        JSON.stringify({ message: 'No new articles found' }), 
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const newPosts = [];

    for (const article of newsData.articles) {
      if (!article.title || !article.description) continue;

      // Generate slug from title
      const { data: slugData, error: slugError } = await supabase
        .rpc('generate_slug', { title: article.title });

      if (slugError) {
        console.error('Error generating slug:', slugError);
        continue;
      }

      // Check if post already exists
      const { data: existingPost } = await supabase
        .from('posts')
        .select('id')
        .eq('slug', slugData)
        .single();

      if (existingPost) {
        console.log(`Post with slug ${slugData} already exists, skipping`);
        continue;
      }

      // Auto-categorize the post
      const { data: categoryId, error: categoryError } = await supabase
        .rpc('auto_categorize_post', { 
          post_title: article.title, 
          post_description: article.description || article.content || ''
        });

      if (categoryError) {
        console.error('Error categorizing post:', categoryError);
      }

      // Get India country ID for default location
      const { data: indiaCountry } = await supabase
        .from('countries')
        .select('id')
        .eq('code', 'IN')
        .single();

      // Generate keywords and tags from content
      const content = `${article.title} ${article.description || ''}`.toLowerCase();
      const keywords = content.match(/\b\w{4,}\b/g) || [];
      const uniqueKeywords = [...new Set(keywords)].slice(0, 10);

      // Insert new post
      const { data: newPost, error: insertError } = await supabase
        .from('posts')
        .insert({
          title: article.title,
          description: article.description || article.content,
          content: article.content || article.description,
          image_url: article.image,
          slug: slugData,
          author: article.source?.name || 'GNews',
          published_at: article.publishedAt || new Date().toISOString(),
          category_id: categoryId,
          country_id: indiaCountry?.id,
          tags: uniqueKeywords,
        })
        .select()
        .single();

      if (insertError) {
        console.error('Error inserting post:', insertError);
        continue;
      }

      newPosts.push(newPost);
      console.log(`Created new post: ${newPost.title}`);
    }

    return new Response(
      JSON.stringify({ 
        message: `Successfully created ${newPosts.length} new posts`,
        posts: newPosts 
      }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    );

  } catch (error) {
    console.error('Error in fetch-news function:', error);
    return new Response(
      JSON.stringify({ error: error.message }), 
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});