const { createClient } = require('@supabase/supabase-js');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase admin client with service role key
const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

async function createAdminUser() {
  console.log('🚀 Creating admin user...\n');

  const email = 'hamza@a2zinvestmentgroup.com';
  const password = 'Poiploksr5010nx!';

  try {
    // Create the user using admin API
    const { data, error } = await supabase.auth.admin.createUser({
      email: email,
      password: password,
      email_confirm: true, // Auto-confirm email
      user_metadata: {
        role: 'admin'
      }
    });

    if (error) {
      if (error.message.includes('already exists') || error.message.includes('already registered')) {
        console.log('⚠️  User already exists');
        console.log('✅ You can log in with:');
        console.log(`   Email: ${email}`);
        console.log(`   Password: ${password}`);
        console.log('\n🌐 Dashboard: http://localhost:3000/dashboard/login\n');
      } else {
        console.error('❌ Error creating user:', error.message);
        process.exit(1);
      }
    } else {
      console.log('✅ Admin user created successfully!');
      console.log('\n📧 Login credentials:');
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log('\n🌐 Dashboard: http://localhost:3000/dashboard/login\n');
      console.log('You can now log in and start managing events!');
    }

  } catch (error) {
    console.error('\n❌ Failed to create admin user:', error.message);
    process.exit(1);
  }
}

createAdminUser();
