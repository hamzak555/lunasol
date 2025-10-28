# Gallery System Setup Guide

## Overview

A complete gallery management system has been set up for Lunasol Miami with the following features:

- **Masonry-style image grid** on the public gallery page
- **Dashboard management section** for uploading and organizing media
- **Support for images and videos** with automatic compression
- **Drag-and-drop positioning** to reorder gallery items
- **Auto-playing videos** with no controls and no sound
- **Public gallery page** at `/gallery`
- **Dashboard management** at `/dashboard/gallery`

---

## Setup Instructions

### 1. Create the Database Table

The gallery requires a new table in Supabase. Run the following SQL in your Supabase SQL Editor:

1. Go to your Supabase project: https://ujetmyzufocrhtmdoyme.supabase.co
2. Navigate to **SQL Editor** in the left sidebar
3. Copy the contents of `gallery-schema.sql` (located in the project root)
4. Paste into the SQL Editor
5. Click **Run**

The SQL will create:
- A `gallery` table with columns for media URL, type, position, and timestamps
- Indexes for efficient position-based sorting
- Row Level Security (RLS) policies:
  - Public read access (anyone can view)
  - Authenticated users can insert, update, and delete

### 2. Verify Storage Bucket

The storage bucket `gallery-media` has already been created automatically. To verify:

1. Go to **Storage** in Supabase
2. You should see a bucket named `gallery-media`
3. It accepts images (PNG, JPEG, WebP) and videos (MP4, QuickTime, WebM)
4. Maximum file size: 50MB

---

## Features

### Public Gallery Page (`/gallery`)

- Responsive masonry layout (1-4 columns based on screen size)
- Displays images and videos in order of their position value
- Videos auto-play on loop with no controls and no sound
- Smooth loading and hover effects
- Header with Lunasol branding

### Dashboard Gallery Management (`/dashboard/gallery`)

Available to all authenticated users:

1. **Upload Media**
   - Click "Upload Media" button
   - Select multiple images and/or videos
   - Images are automatically compressed to max 2MB
   - Files are uploaded to Supabase Storage
   - Database records are created automatically

2. **Reorder Items**
   - Drag and drop gallery items to change their order
   - Position numbers are shown in the top-left corner
   - Changes are saved automatically to the database
   - New order is immediately reflected on the public gallery

3. **Delete Items**
   - Click the trash icon on any item
   - Confirms before deletion
   - Removes from both storage and database

### Video Playback Settings

Videos on the public gallery page have:
- `autoPlay` - Videos start playing automatically
- `loop` - Videos repeat indefinitely
- `muted` - No sound
- `playsInline` - Plays inline on mobile (doesn't go fullscreen)
- No visible controls
- Hidden controls via CSS for all browsers

---

## Technical Details

### Database Schema

```sql
CREATE TABLE gallery (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  media_url TEXT NOT NULL,
  media_type TEXT NOT NULL CHECK (media_type IN ('image', 'video')),
  position INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Storage Bucket

- **Name**: `gallery-media`
- **Public**: Yes (files are publicly accessible)
- **Size Limit**: 50MB per file
- **Allowed Types**:
  - Images: PNG, JPEG, JPG, WebP
  - Videos: MP4, QuickTime, WebM

### File Structure

```
src/
├── app/
│   ├── gallery/
│   │   └── page.tsx                    # Public gallery page
│   └── dashboard/
│       └── gallery/
│           └── page.tsx                # Dashboard management
├── components/
│   └── DashboardLayout.tsx             # Updated with Gallery link
└── lib/
    └── supabase/
        ├── client.ts
        └── server.ts

scripts/
└── setup-gallery.js                    # Setup script (already run)

gallery-schema.sql                      # SQL to create table
```

---

## Usage Guide

### For Administrators

1. **Access the Dashboard**
   - Navigate to `/dashboard/login`
   - Log in with your credentials
   - Click "Gallery" in the sidebar

2. **Upload Images and Videos**
   - Click "Upload Media"
   - Select one or multiple files
   - Wait for upload to complete
   - Files appear in the grid automatically

3. **Organize Gallery**
   - Drag items to reorder them
   - The position number shows current order
   - Changes save automatically

4. **Remove Items**
   - Click the trash icon on any item
   - Confirm deletion
   - Item is removed from storage and database

### For Visitors

1. **View Gallery**
   - Navigate to `/gallery` or click "Gallery" in the main navigation
   - Scroll through the masonry grid
   - Videos play automatically on loop
   - Images load lazily for performance

---

## Color Palette

The gallery uses the Lunasol brand colors:

- **Background**: `#F7F8F1` (Lighter Beige)
- **Header**: `#2C2C2C` (Black)
- **Text Primary**: `#2C2C2C` (Black)
- **Text Secondary**: `#806D4B` (Brown)
- **Accent**: `#DCD3B8` (Beige)
- **Borders**: `#806D4B` (Brown)

---

## Testing Checklist

- [ ] Run `gallery-schema.sql` in Supabase SQL Editor
- [ ] Verify `gallery-media` storage bucket exists
- [ ] Log in to dashboard at `/dashboard/login`
- [ ] Navigate to `/dashboard/gallery`
- [ ] Upload a test image
- [ ] Upload a test video
- [ ] Reorder items using drag-and-drop
- [ ] Visit `/gallery` to verify public display
- [ ] Confirm videos auto-play with no sound
- [ ] Test image responsiveness on mobile
- [ ] Delete a test item

---

## Troubleshooting

### "Could not find table gallery"
→ Run the SQL from `gallery-schema.sql` in Supabase SQL Editor

### "Storage bucket not found"
→ Run `node scripts/setup-gallery.js` to create the bucket

### Videos have controls showing
→ The CSS should hide them, but some browsers may override this. The videos will still loop and have no sound.

### Upload fails
→ Check file size (max 50MB) and file type (must be image or video)

### Can't reorder items
→ Ensure you're dragging the item, not just clicking it

---

## Next Steps

1. ✅ Run `gallery-schema.sql` in Supabase
2. ✅ Test uploading images and videos
3. ✅ Populate gallery with real content
4. ✅ Share gallery link with visitors

---

## Support

For questions or issues, check the main Lunasol documentation or contact the development team.
