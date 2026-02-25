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

async function resetAndUpdateViews() {
  console.log('🔄 RESETTING ALL VIEW COUNTS TO ZERO...\n');

  try {
    // STEP 1: Reset ALL posts to 0 views
    const { error: resetError } = await supabase
      .from('posts')
      .update({ view_count: 0 })
      .neq('id', '00000000-0000-0000-0000-000000000000'); // Update all posts

    if (resetError) {
      console.error('❌ Error resetting view counts:', resetError.message);
      return;
    }

    console.log('✅ All view counts reset to 0\n');
    console.log('=' .repeat(60));
    console.log('🚀 APPLYING NEW VIEW COUNTS...\n');

    // STEP 2: Fetch all published posts
    const { data: posts, error: fetchError } = await supabase
      .from('posts')
      .select('id, title, published_at, status')
      .eq('status', 'published')
      .order('published_at', { ascending: false });

    if (fetchError) {
      console.error('❌ Error fetching posts:', fetchError.message);
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

    // STEP 3: Apply new view counts
    for (const post of posts) {
      let viewCount;
      
      // Check if this is the latest Sage Accounting post
      if (post.title.includes('Sage Accounting') && post.title.includes('Built for Businesses')) {
        // Latest post: 1000-2000 views
        viewCount = randomInRange(1000, 2000);
        latestPostFound = true;
        console.log(`📝 LATEST POST: "${post.title}"`);
        console.log(`   ✨ Views: ${viewCount} (NEW POST - Published Today)\n`);
      } else {
        // Older posts: 10,000-30,000 views
        viewCount = randomInRange(10000, 30000);
        const displayTitle = post.title.length > 60 
          ? post.title.substring(0, 60) + '...' 
          : post.title;
        console.log(`📝 "${displayTitle}"`);
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

      // Small delay to ensure database consistency
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    console.log('\n' + '='.repeat(60));
    console.log(`✅ SUCCESS: Updated ${updatedCount} out of ${posts.length} posts`);
    
    if (!latestPostFound) {
      console.log('\n⚠️  WARNING: Could not find the Sage Accounting post.');
      console.log('   All posts received 10k-30k views.');
    } else {
      console.log('\n✅ Latest Sage Accounting post identified and updated!');
    }
    
    console.log('='.repeat(60));
    console.log('\n🎉 View count reset and update completed successfully!');

  } catch (err) {
    console.error('❌ Unexpected error:', err.message);
    console.error(err);
  }
}

// Run the script
console.log('╔════════════════════════════════════════════════════════════╗');
console.log('║     VIEW COUNT RESET & UPDATE SCRIPT                      ║');
console.log('║     Resetting all views to 0, then applying new counts    ║');
console.log('╚════════════════════════════════════════════════════════════╝\n');

resetAndUpdateViews();
