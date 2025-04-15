# Vercel Deployment Guide

This guide will help you deploy the Custom T-Shirt Hub application to Vercel with proper environment variable configuration.

## Prerequisites

1. A [Vercel account](https://vercel.com/signup)
2. Your GitHub repository connected to Vercel
3. Your Supabase project credentials

## Deployment Steps

### 1. Connect Your Repository to Vercel

1. Log in to your Vercel account
2. Click "Add New..." > "Project"
3. Select your GitHub repository
4. Click "Import"

### 2. Configure Environment Variables

1. In the project configuration screen, scroll down to the "Environment Variables" section
2. Add the following environment variables:
   - `VITE_SUPABASE_URL`: `https://lchamzwbdmqpmabvaqpi.supabase.co`
   - `VITE_SUPABASE_ANON_KEY`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxjaGFtendiZG1xcG1hYnZhcXBpIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDM0NDk2NDQsImV4cCI6MjA1OTAyNTY0NH0.6xB_TQjXacVzLUtITx0L9A_OSLaaaarwkujCkLiC958`

### 3. Deploy Settings

1. Framework Preset: Select "Vite"
2. Build Command: `npm run build`
3. Output Directory: `dist`
4. Install Command: `npm install`

### 4. Deploy

1. Click "Deploy"
2. Wait for the deployment to complete

## Verifying Your Deployment

After deployment, Vercel will provide you with a URL to access your application. Visit this URL to verify that your application is working correctly.

## Troubleshooting

If you encounter issues with your deployment, check the following:

1. **Environment Variables**: Ensure that all required environment variables are set correctly in the Vercel dashboard.
2. **Build Logs**: Check the build logs in Vercel for any errors.
3. **Client-Side Errors**: Use the browser's developer console to check for any client-side errors.

## Setting Up a Custom Domain

1. In your Vercel project dashboard, go to "Settings" > "Domains"
2. Add your custom domain
3. Follow the instructions to configure your DNS settings

## Security Considerations

1. **Environment Variables**: Never commit your actual API keys or secrets to the repository.
2. **Content Security Policy**: The application includes a Content Security Policy in the `vercel.json` file. Review and update it as needed.
3. **Authentication**: Ensure that your Supabase authentication is properly configured.

## Continuous Deployment

Vercel automatically deploys your application when you push changes to your repository. To disable this behavior:

1. Go to your project settings
2. Navigate to "Git" > "Ignored Build Step"
3. Configure the conditions under which Vercel should skip building your project
