// Verify Categories and Tags Setup
// Run this with: node verify-categories-tags.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase credentials in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function verifySetup() {
  console.log('\n🔍 Verifying Categories and Tags Setup...\n');
  console.log('='.repeat(60));

  try {
    // Check Categories
    console.log('\n📁 CATEGORIES:');
    console.log('-'.repeat(60));
    const { data: categories, error: catError } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (catError) {
      console.error('❌ Error fetching categories:', catError.message);
    } else {
      console.log(`✅ Found ${categories.length} categories:\n`);
      categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.name.padEnd(15)} (/${cat.slug})`);
      });

      // Check for required navigation categories
      const requiredCategories = ['Business', 'Finance', 'SaaS', 'Startups', 'AI', 'Reviews'];
      const existingNames = categories.map(c => c.name);
      const missing = requiredCategories.filter(name => !existingNames.includes(name));
      
      if (missing.length > 0) {
        console.log(`\n⚠️  Missing navigation categories: ${missing.join(', ')}`);
        console.log('   Run fix-categories-tags.sql to add them!');
      } else {
        console.log('\n✅ All navigation categories present!');
      }
    }

    // Check Tags
    console.log('\n\n🏷️  TAGS:');
    console.log('-'.repeat(60));
    const { data: tags, error: tagError } = await supabase
      .from('tags')
      .select('*')
      .order('name');

    if (tagError) {
      console.error('❌ Error fetching tags:', tagError.message);
    } else {
      console.log(`✅ Found ${tags.length} tags:\n`);
      
      // Group tags by type
      const techTags = tags.filter(t => 
        ['javascript', 'react', 'typescript', 'nodejs', 'python', 'web-development'].includes(t.slug)
      );
      const businessTags = tags.filter(t => 
        ['entrepreneurship', 'strategy', 'growth', 'innovation'].includes(t.slug)
      );
      const aiTags = tags.filter(t => 
        ['machine-learning', 'chatgpt', 'automation', 'data-science'].includes(t.slug)
      );

      if (techTags.length > 0) {
        console.log(`   Technology: ${techTags.map(t => t.name).join(', ')}`);
      }
      if (businessTags.length > 0) {
        console.log(`   Business: ${businessTags.map(t => t.name).join(', ')}`);
      }
      if (aiTags.length > 0) {
        console.log(`   AI/ML: ${aiTags.map(t => t.name).join(', ')}`);
      }
      console.log(`   ... and ${tags.length - techTags.length - businessTags.length - aiTags.length} more`);

      if (tags.length < 20) {
        console.log('\n⚠️  You have fewer than 20 tags. Consider running fix-categories-tags.sql');
      } else {
        console.log('\n✅ Good tag coverage!');
      }
    }

    // Check Posts
    console.log('\n\n📝 POSTS:');
    console.log('-'.repeat(60));
    const { data: posts, error: postError } = await supabase
      .from('posts')
      .select('id, title, status, category_id')
      .limit(10);

    if (postError) {
      console.error('❌ Error fetching posts:', postError.message);
    } else {
      console.log(`✅ Found ${posts.length} posts (showing first 10):\n`);
      if (posts.length === 0) {
        console.log('   No posts yet. Create your first post at /admin/posts/new');
      } else {
        posts.forEach((post, index) => {
          const statusEmoji = post.status === 'published' ? '🟢' : 
                             post.status === 'draft' ? '🟡' : '🔵';
          console.log(`   ${index + 1}. ${statusEmoji} ${post.title.substring(0, 50)}...`);
        });
      }
    }

    // Summary
    console.log('\n\n' + '='.repeat(60));
    console.log('📊 SUMMARY:');
    console.log('='.repeat(60));
    console.log(`Categories: ${categories?.length || 0} (need 10)`);
    console.log(`Tags: ${tags?.length || 0} (recommended 30+)`);
    console.log(`Posts: ${posts?.length || 0}`);

    if (categories?.length >= 10 && tags?.length >= 20) {
      console.log('\n✅ Setup looks good! You\'re ready to create content.');
    } else {
      console.log('\n⚠️  Setup incomplete. Run fix-categories-tags.sql in Supabase.');
    }

    console.log('\n' + '='.repeat(60));
    console.log('Next steps:');
    console.log('1. If categories/tags are missing, run fix-categories-tags.sql');
    console.log('2. Go to http://localhost:3000/admin/posts/new');
    console.log('3. Create your first post!');
    console.log('='.repeat(60) + '\n');

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.log('\nTroubleshooting:');
    console.log('1. Check your .env file has correct Supabase credentials');
    console.log('2. Verify your Supabase project is running');
    console.log('3. Check that tables exist in Supabase');
  }
}

verifySetup();
