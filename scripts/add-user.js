const { createClient } = require('@supabase/supabase-js');
const readline = require('readline');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(query) {
  return new Promise((resolve) => rl.question(query, resolve));
}

async function addUser() {
  console.log('🚀 Add New Dashboard User\n');

  try {
    const email = await question('Enter email address: ');
    const password = await question('Enter password: ');

    if (!email || !password) {
      console.error('❌ Email and password are required');
      rl.close();
      process.exit(1);
    }

    console.log('\n⏳ Creating user...\n');

    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true,
      user_metadata: {
        role: 'admin'
      }
    });

    if (error) {
      if (error.message.includes('already exists') || error.message.includes('already registered')) {
        console.log('⚠️  User already exists with this email');
      } else {
        console.error('❌ Error creating user:', error.message);
      }
    } else {
      console.log('✅ User created successfully!');
      console.log('\n📧 Login credentials:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log('\n🌐 Dashboard: http://localhost:3000/dashboard/login\n');
    }

    rl.close();
  } catch (error) {
    console.error('\n❌ Failed to create user:', error.message);
    rl.close();
    process.exit(1);
  }
}

addUser();
