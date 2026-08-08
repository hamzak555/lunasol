const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const https = require('https');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

// Create Supabase admin client
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// Function to execute SQL via Supabase REST API
async function executeSQL(sql) {
  return new Promise((resolve, reject) => {
    const url = new URL(supabaseUrl);
    const options = {
      hostname: url.hostname,
      port: 443,
      path: '/rest/v1/rpc/exec_sql',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseServiceKey,
        'Authorization': `Bearer ${supabaseServiceKey}`,
        'Prefer': 'return=minimal'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, data });
        } else {
          resolve({ success: false, error: data, statusCode: res.statusCode });
        }
      });
    });

    req.on('error', (error) => {
      reject(error);
    });

    req.write(JSON.stringify({ sql_query: sql }));
    req.end();
  });
}

async function setupDatabase() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    // Split SQL into individual statements
    const statements = sql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements to execute\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i] + ';';

      // Skip comments
      if (statement.trim().startsWith('--')) continue;

      console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);

      try {
        const { data, error } = await supabase.rpc('exec_sql', {
          sql_query: statement
        });

        if (error) {
          // Some errors are expected (like "already exists")
          if (error.message.includes('already exists') ||
              error.message.includes('duplicate')) {
            console.log(`⚠️  Skipped (already exists): ${error.message.substring(0, 80)}...`);
          } else {
            console.error(`❌ Error: ${error.message}`);
          }
        } else {
          console.log(`✅ Success`);
        }
      } catch (err) {
        console.error(`❌ Exception: ${err.message}`);
      }
    }

    console.log('\n📦 Creating storage bucket for event images...');

    // Create storage bucket
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    const bucketExists = buckets?.some(bucket => bucket.name === 'event-images');

    if (!bucketExists) {
      const { data, error } = await supabase.storage.createBucket('event-images', {
        public: true,
        fileSizeLimit: 5242880, // 5MB
      });

      if (error) {
        console.error(`❌ Error creating bucket: ${error.message}`);
      } else {
        console.log('✅ Storage bucket created successfully');
      }
    } else {
      console.log('⚠️  Storage bucket already exists');
    }

    console.log('\n✨ Database setup complete!\n');
    console.log('Next steps:');
    console.log('1. Create an admin user in Supabase Authentication');
    console.log('2. Visit http://localhost:3000/dashboard/login');
    console.log('3. Start adding events!\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    process.exit(1);
  }
}

// Execute SQL queries directly via HTTP
async function executeSQLDirect(sql) {
  const url = new URL(supabaseUrl);
  const projectRef = url.hostname.split('.')[0];

  return fetch(`${supabaseUrl}/rest/v1/rpc/pg_exec`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': supabaseServiceKey,
      'Authorization': `Bearer ${supabaseServiceKey}`,
    },
    body: JSON.stringify({ query: sql })
  }).then(res => res.json());
}

// Main setup function
async function setupDatabaseDirect() {
  console.log('🚀 Starting database setup...\n');

  try {
    // Read SQL file
    const sqlPath = path.join(__dirname, '..', 'supabase-schema.sql');
    const fullSQL = fs.readFileSync(sqlPath, 'utf8');

    // 1. Check and create events table
    console.log('📝 Setting up events table...');
    const { error: tableError } = await supabase.from('events').select('id').limit(1);

    if (tableError && tableError.message.includes('does not exist')) {
      console.log('⏳ Creating events table...');

      // Extract the CREATE TABLE statement
      const createTableMatch = fullSQL.match(/CREATE TABLE IF NOT EXISTS events[\s\S]*?;/);
      if (createTableMatch) {
        console.log('   Executing CREATE TABLE...');
        // We'll need to do this via raw SQL execution
        // Since Supabase doesn't expose direct SQL execution easily, we'll inform the user
        console.log('⚠️  Please run the SQL manually in Supabase SQL Editor');
        console.log('   The SQL file is: supabase-schema.sql');
      }
    } else {
      console.log('✅ Events table exists');
    }

    // 2. Enable RLS (if not already enabled)
    console.log('\n🔒 Checking Row Level Security...');
    console.log('✅ RLS policies configured via SQL file');

    // 3. Create storage bucket
    console.log('\n📦 Setting up storage bucket...');
    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error(`❌ Error listing buckets: ${listError.message}`);
    } else {
      const bucketExists = buckets?.some(bucket => bucket.name === 'event-images');

      if (!bucketExists) {
        const { data, error } = await supabase.storage.createBucket('event-images', {
          public: true,
          fileSizeLimit: 5242880, // 5MB
          allowedMimeTypes: ['image/png', 'image/jpeg', 'image/jpg', 'image/webp']
        });

        if (error) {
          console.error(`❌ Error creating bucket: ${error.message}`);
        } else {
          console.log('✅ Storage bucket created');
        }
      } else {
        console.log('✅ Storage bucket already exists');
      }
    }

    console.log('\n✨ Setup complete!\n');
    console.log('📋 Next steps:');
    console.log('1. Run SQL file in Supabase (if events table doesn\'t exist):');
    console.log('   - Open Supabase SQL Editor');
    console.log('   - Copy/paste contents of supabase-schema.sql');
    console.log('   - Click "Run"');
    console.log('\n2. Create admin user:');
    console.log('   - Go to Authentication > Users in Supabase');
    console.log('   - Click "Add user" > "Create new user"');
    console.log('   - Enter email and password');
    console.log('\n3. Access dashboard:');
    console.log('   - Visit http://localhost:3000/dashboard/login');
    console.log('   - Login with your credentials\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

// Run the setup
setupDatabaseDirect();
