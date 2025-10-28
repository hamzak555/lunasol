const { createClient } = require('@supabase/supabase-js');

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

async function updateAdminRole() {
  console.log('🚀 Updating admin user role...\n');

  const email = 'hamza@a2zinvestmentgroup.com';

  try {
    // Get all users
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();

    if (listError) {
      console.error('❌ Error listing users:', listError.message);
      process.exit(1);
    }

    // Find the admin user
    const adminUser = users.find(u => u.email === email);

    if (!adminUser) {
      console.error(`❌ User ${email} not found`);
      process.exit(1);
    }

    console.log(`📧 Found user: ${adminUser.email}`);
    console.log(`📝 Current role: ${adminUser.user_metadata?.role || 'none'}\n`);

    // Update user metadata to include admin role
    const { data, error } = await supabase.auth.admin.updateUserById(
      adminUser.id,
      {
        user_metadata: {
          role: 'admin'
        }
      }
    );

    if (error) {
      console.error('❌ Error updating user:', error.message);
      process.exit(1);
    }

    console.log('✅ Admin role updated successfully!');
    console.log(`📧 User: ${email}`);
    console.log(`🔑 Role: admin\n`);
    console.log('🌐 You can now access the Users tab in the dashboard!\n');

  } catch (error) {
    console.error('\n❌ Failed to update admin role:', error.message);
    process.exit(1);
  }
}

updateAdminRole();
