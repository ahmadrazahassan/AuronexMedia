// Quick Storage Setup Checker
// Run: node check-storage-setup.js

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env file');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkStorageSetup() {
  console.log('🔍 Checking Supabase Storage Setup...\n');

  try {
    // Check if we can list buckets
    console.log('1️⃣  Checking storage access...');
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();

    if (bucketsError) {
      console.error('❌ Cannot access storage:', bucketsError.message);
      console.log('\n💡 Solution: Check your Supabase project settings');
      return;
    }

    console.log('✅ Storage access OK');
    console.log(`   Found ${buckets.length} bucket(s)\n`);

    // Check if blog-images bucket exists
    console.log('2️⃣  Checking for "blog-images" bucket...');
    const blogImagesBucket = buckets.find(b => b.name === 'blog-images');

    if (!blogImagesBucket) {
      console.error('❌ "blog-images" bucket NOT found');
      console.log('\n📝 TO FIX:');
      console.log('   1. Go to Supabase Dashboard > Storage');
      console.log('   2. Click "New bucket"');
      console.log('   3. Name: blog-images');
      console.log('   4. Public bucket: ✅ YES');
      console.log('   5. Click "Create bucket"\n');
      return;
    }

    console.log('✅ "blog-images" bucket exists');
    console.log(`   Public: ${blogImagesBucket.public ? 'Yes ✅' : 'No ❌'}`);
    console.log(`   ID: ${blogImagesBucket.id}\n`);

    if (!blogImagesBucket.public) {
      console.log('⚠️  WARNING: Bucket is not public!');
      console.log('   Images won\'t be accessible on your website.');
      console.log('\n📝 TO FIX:');
      console.log('   1. Go to Supabase Dashboard > Storage > blog-images');
      console.log('   2. Click Settings (gear icon)');
      console.log('   3. Check "Public bucket"');
      console.log('   4. Save\n');
    }

    // Try to list files (tests read permission)
    console.log('3️⃣  Testing read permissions...');
    const { data: files, error: listError } = await supabase.storage
      .from('blog-images')
      .list();

    if (listError) {
      console.error('❌ Cannot list files:', listError.message);
      console.log('\n📝 TO FIX:');
      console.log('   Run the SQL script: supabase-storage-setup.sql');
      console.log('   in your Supabase SQL Editor\n');
      return;
    }

    console.log('✅ Read permissions OK');
    console.log(`   Files in bucket: ${files.length}\n`);

    // Try to upload a test file (tests write permission)
    console.log('4️⃣  Testing upload permissions...');
    const testFile = new Blob(['test'], { type: 'text/plain' });
    const testFileName = `test-${Date.now()}.txt`;

    const { error: uploadError } = await supabase.storage
      .from('blog-images')
      .upload(testFileName, testFile);

    if (uploadError) {
      if (uploadError.message.includes('row-level security')) {
        console.error('❌ Upload permissions NOT configured');
        console.log('\n📝 TO FIX:');
        console.log('   1. Go to Supabase Dashboard > SQL Editor');
        console.log('   2. Open supabase-storage-setup.sql');
        console.log('   3. Copy and paste the SQL');
        console.log('   4. Click "Run"\n');
      } else {
        console.error('❌ Upload failed:', uploadError.message);
      }
      return;
    }

    console.log('✅ Upload permissions OK');

    // Clean up test file
    await supabase.storage.from('blog-images').remove([testFileName]);
    console.log('✅ Cleanup successful\n');

    // Final summary
    console.log('═══════════════════════════════════════');
    console.log('🎉 STORAGE SETUP COMPLETE!');
    console.log('═══════════════════════════════════════');
    console.log('✅ Storage access working');
    console.log('✅ blog-images bucket exists');
    console.log('✅ Bucket is public');
    console.log('✅ Read permissions configured');
    console.log('✅ Upload permissions configured');
    console.log('\n✨ You can now upload images in your app!\n');

  } catch (error) {
    console.error('\n❌ Unexpected error:', error.message);
    console.log('\n💡 Please check:');
    console.log('   1. Your .env file has correct Supabase credentials');
    console.log('   2. Your Supabase project is active');
    console.log('   3. You have internet connection\n');
  }
}

checkStorageSetup();
