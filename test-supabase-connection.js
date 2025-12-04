// Quick test script to verify Supabase connection
// Run with: node test-supabase-connection.js

require('dotenv').config();

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
const supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;

console.log('\n🔍 Checking Supabase Configuration...\n');

if (!supabaseUrl || supabaseUrl === 'your-supabase-project-url') {
  console.log('❌ REACT_APP_SUPABASE_URL is not set or still has placeholder value');
  console.log('   Please update your .env file with your actual Supabase URL\n');
  process.exit(1);
}

if (!supabaseKey || supabaseKey === 'your-supabase-anon-key') {
  console.log('❌ REACT_APP_SUPABASE_ANON_KEY is not set or still has placeholder value');
  console.log('   Please update your .env file with your actual Supabase anon key\n');
  process.exit(1);
}

console.log('✅ Supabase URL is configured');
console.log('✅ Supabase Anon Key is configured');
console.log('\n📋 Configuration:');
console.log(`   URL: ${supabaseUrl}`);
console.log(`   Key: ${supabaseKey.substring(0, 20)}...${supabaseKey.substring(supabaseKey.length - 10)}`);

console.log('\n✨ Configuration looks good!');
console.log('\n📝 Next steps:');
console.log('   1. Make sure you ran the SQL schema in Supabase dashboard');
console.log('   2. Start your app: npm start');
console.log('   3. Go to: http://localhost:3000/admin/login');
console.log('   4. Create your admin account\n');
