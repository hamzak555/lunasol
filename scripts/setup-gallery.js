const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  console.error('❌ Missing Supabase credentials in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function setupGallery() {
  console.log('🚀 Setting up gallery system...\n');

  try {
    // 1. Create gallery table
    console.log('📝 Creating gallery table...');

    const createTableSQL = `
      CREATE TABLE IF NOT EXISTS gallery (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        media_url TEXT NOT NULL,
        media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
        position INTEGER NOT NULL DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc'::text, NOW()) NOT NULL
      );

      -- Create index for position ordering
      CREATE INDEX IF NOT EXISTS idx_gallery_position ON gallery(position);

      -- Enable RLS
      ALTER TABLE gallery ENABLE ROW LEVEL SECURITY;

      -- Allow public read access
      DROP POLICY IF EXISTS "Allow public read access" ON gallery;
      CREATE POLICY "Allow public read access"
        ON gallery FOR SELECT
        USING (true);

      -- Allow authenticated users to insert
      DROP POLICY IF EXISTS "Allow authenticated insert" ON gallery;
      CREATE POLICY "Allow authenticated insert"
        ON gallery FOR INSERT
        TO authenticated
        WITH CHECK (true);

      -- Allow authenticated users to update
      DROP POLICY IF EXISTS "Allow authenticated update" ON gallery;
      CREATE POLICY "Allow authenticated update"
        ON gallery FOR UPDATE
        TO authenticated
        USING (true);

      -- Allow authenticated users to delete
      DROP POLICY IF EXISTS "Allow authenticated delete" ON gallery;
      CREATE POLICY "Allow authenticated delete"
        ON gallery FOR DELETE
        TO authenticated
        USING (true);
    `;

    const { error: tableError } = await supabase.rpc('exec_sql', {
      sql_query: createTableSQL
    });

    if (tableError) {
      if (tableError.message.includes('already exists')) {
        console.log('⚠️  Gallery table already exists');
      } else {
        console.error('❌ Error creating table:', tableError.message);
      }
    } else {
      console.log('✅ Gallery table created successfully');
    }

    // 2. Create storage bucket for gallery media
    console.log('\n📦 Creating storage bucket for gallery media...');

    const { data: buckets, error: listError } = await supabase.storage.listBuckets();

    if (listError) {
      console.error('❌ Error listing buckets:', listError.message);
    } else {
      const bucketExists = buckets?.some(bucket => bucket.name === 'gallery-media');

      if (!bucketExists) {
        const { data, error } = await supabase.storage.createBucket('gallery-media', {
          public: true,
          fileSizeLimit: 52428800, // 50MB to accommodate videos
          allowedMimeTypes: [
            'image/png',
            'image/jpeg',
            'image/jpg',
            'image/webp',
            'video/mp4',
            'video/quicktime',
            'video/webm'
          ]
        });

        if (error) {
          console.error('❌ Error creating bucket:', error.message);
        } else {
          console.log('✅ Storage bucket created successfully');
        }
      } else {
        console.log('⚠️  Storage bucket already exists');
      }
    }

    console.log('\n✨ Gallery setup complete!\n');
    console.log('📋 Next steps:');
    console.log('1. Access the gallery dashboard at /dashboard/gallery');
    console.log('2. Upload images and videos');
    console.log('3. Arrange media positioning');
    console.log('4. View the public gallery at /gallery\n');

  } catch (error) {
    console.error('\n❌ Setup failed:', error.message);
    console.error(error.stack);
    process.exit(1);
  }
}

setupGallery();
