# Lunasol Dashboard Setup Guide

This guide will help you set up the event management dashboard for the Lunasol website.

## What's Been Created

1. **Database Schema** (`supabase-schema.sql`) - SQL file to create the events table and storage bucket
2. **Login Page** (`/dashboard/login`) - Secure authentication page
3. **Dashboard** (`/dashboard`) - Event management interface with add/edit/delete functionality
4. **Events Page** (`/events`) - Public page displaying all events
5. **Homepage Integration** - Events carousel now pulls from the database

## Automated Setup (Recommended)

### 1. Run the Setup Script

Simply run this command to automatically set up the database:

```bash
npm run setup-db
```

This will:
- ✅ Check if the events table exists
- ✅ Automatically create the storage bucket
- ✅ Configure storage policies
- ✅ Give you clear next steps

### 2. (If needed) Run SQL Manually

If the events table doesn't exist, you'll need to run the SQL once:

1. Go to your Supabase project: https://ujetmyzufocrhtmdoyme.supabase.co
2. Navigate to the **SQL Editor** in the left sidebar
3. Create a new query
4. Copy and paste the contents of `supabase-schema.sql` into the editor
5. Click "Run" to execute the SQL

### 3. Create an Admin User

You need to create a user account to access the dashboard:

1. In your Supabase project, go to **Authentication** > **Users**
2. Click "Add user" > "Create new user"
3. Enter an email and password (this will be your admin login)
4. Click "Create user"

### 3. Access the Dashboard

1. Visit: http://localhost:3000/dashboard/login
2. Log in with the email and password you just created
3. You'll be redirected to the dashboard

### 4. Add Your First Event

1. Click "Add Event" button
2. Fill in:
   - **Event Title**: Name of the event
   - **Date**: e.g., "November 15, 2024"
   - **Time**: e.g., "10:00 PM - 3:00 AM"
   - **Event Image**: Upload an image for the event
3. Click "Create Event"

## Features

### Dashboard Features
- ✅ View all events in a table format
- ✅ Add new events with image uploads
- ✅ Edit existing events
- ✅ Delete events
- ✅ Secure authentication required
- ✅ Image preview before uploading

### Frontend Integration
- ✅ Homepage carousel automatically displays events from database
- ✅ Events page (`/events`) shows all upcoming events
- ✅ Real-time updates when events are added/edited

## File Structure

```
src/
├── app/
│   ├── dashboard/
│   │   ├── login/
│   │   │   └── page.tsx          # Login page
│   │   └── page.tsx               # Dashboard with event management
│   ├── events/
│   │   └── page.tsx               # Public events page
│   └── page.tsx                   # Homepage (updated to use database)
├── lib/
│   └── supabase/
│       ├── client.ts              # Supabase browser client
│       └── server.ts              # Supabase server client
└── components/
    ├── EventCard.tsx              # Event card component
    ├── EventsCarousel.tsx         # Homepage carousel
    ├── Header.tsx                 # Site header
    └── Footer.tsx                 # Site footer
```

## Important URLs

- **Homepage**: http://localhost:3000
- **Events Page**: http://localhost:3000/events
- **Dashboard Login**: http://localhost:3000/dashboard/login
- **Dashboard**: http://localhost:3000/dashboard

## Security Notes

- The dashboard requires authentication
- Public users can view events but cannot add/edit/delete
- Row Level Security is enabled on the events table
- Only authenticated users can upload images
- All uploads are stored in Supabase Storage

## Troubleshooting

### Can't log in?
- Make sure you created a user in Supabase Authentication
- Check that your email and password are correct

### Events not showing?
- Make sure you ran the SQL schema in Supabase
- Check that you have events in the database
- Open browser console to check for errors

### Image upload failing?
- Verify the storage bucket was created (check Supabase Storage)
- Ensure storage policies were created correctly
- Check file size (keep images under 5MB for best performance)

## Next Steps

1. Add your real events to the dashboard
2. Replace placeholder images with actual event photos
3. Test the public events page
4. Customize styling if needed

## Support

If you encounter any issues, check:
1. Browser console for JavaScript errors
2. Network tab for API errors
3. Supabase logs for database errors
