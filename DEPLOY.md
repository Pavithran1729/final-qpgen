
# Deployment Guide

## Prerequisites

1. Vercel account
2. Supabase project
3. Environment variables ready

## Database Setup

1. Run the Supabase migration:
   ```sql
   -- Apply the cascade delete migration
   supabase db push
   ```

2. Verify RLS policies are in place for:
   - subjects table
   - questions table

## Environment Variables

Set these in your Vercel project settings:

1. `VITE_SUPABASE_URL`
   - Your Supabase project URL
   - Format: `https://[project-id].supabase.co`

2. `VITE_SUPABASE_ANON_KEY`
   - Your Supabase project anon/public key
   - Find in Project Settings > API

## Deployment Steps

1. Connect your repository to Vercel:
   ```bash
   vercel link
   ```

2. Deploy the project:
   ```bash
   vercel --prod
   ```

## Post-Deployment Verification

1. Check Authentication:
   - Try logging in
   - Verify session persistence

2. Test Subject Management:
   - Create a new subject
   - Edit subject details
   - Delete a subject (verify cascade delete works)

3. Test Question Management:
   - Add questions to subjects
   - Import questions via Excel
   - Generate question papers

## Troubleshooting

1. If subjects don't appear:
   - Check RLS policies
   - Verify user authentication
   - Check console for API errors

2. If delete operations fail:
   - Verify cascade delete migration was applied
   - Check user permissions in RLS policies

3. If builds fail:
   - Verify environment variables are set
   - Check build logs for TypeScript errors

## Maintenance

1. Database Backups:
   - Enable daily backups in Supabase
   - Test backup restoration process

2. Monitoring:
   - Set up Supabase monitoring
   - Configure error tracking
   - Monitor API usage

## Security Considerations

1. RLS Policies:
   - All tables should have RLS enabled
   - Verify user can only access their own data

2. Authentication:
   - Only allow authenticated users
   - Implement proper session management

3. API Access:
   - Use appropriate service roles
   - Limit public access
