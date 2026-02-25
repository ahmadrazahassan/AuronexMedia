require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// Generate random number in range
function randomInRange(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

async function updateViewCounts() {
  console.log('🚀 Starting view count update...\n');

  try {
    // Fetch all published posts
    const { data: posts, error } = await supabase
      .from('posts')
      .select('id, title, published_at, status')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (error) {
      console.error('❌ Error fetching posts:', error.message);
      return;
    }

    if (!posts || posts.length === 0) {
      console.log('⚠️  No published posts found');
      return;
    }

    console.log(`📊 Found ${posts.length} published posts\n`);

    // Target post title (latest post)
    const targetTitle = 'Sage Accounting & Payroll: Built for Businesses That Actually Want Control';
    
    let updatedCount = 0;
    let latestPostFound = false;

    for (const post of posts) {
      let viewCount;
      
      // Check if this is the latest Sage Accounting post
      if (post.title.includes('Sage Accounting') || post.title === targetTitle) {
        // Latest post: 1000-2000 views (more realistic random numbers)
        viewCount = randomInRange(1000, 2000);
        latestPostFound = true;
        console.log(`📝 Latest Post: "${post.title}"`);
        console.log(`   Views: ${viewCount} (NEW POST)\n`);
      } else {
        // Older posts: 10,000-30,000 views (more realistic random numbers)
        viewCount = randomInRange(10000, 30000);
        console.log(`📝 "${post.title.substring(0, 60)}${post.title.length > 60 ? '...' : ''}"`);
        console.log(`   Views: ${viewCount}\n`);
      }

      // Update the post in database
      const { error: updateError } = await supabase
        .from('posts')
        .update({ view_count: viewCount })
        .eq('id', post.id);

      if (updateError) {
        console.error(`   ❌ Failed to update: ${updateError.message}`);
      } else {
        updatedCount++;
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ Successfully updated ${updatedCount} out of ${posts.length} posts`);
    
    if (!latestPostFound) {
      console.log('\n⚠️  Note: Could not find the Sage Accounting post by title.');
      console.log('   All posts received 10k-30k views.');
    }
    
    console.log('='.repeat(60));

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
  }
}

// Run the script
updateViewCounts();
