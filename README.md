# Custom T-Shirt Hub

A web application for designing and ordering custom t-shirts online.

## How can I edit this code?

**Use your preferred IDE**

If you want to work locally using your own IDE, you can clone this repo and push changes.

The only requirement is having Node.js & npm installed - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone <YOUR_GIT_URL>

# Step 2: Navigate to the project directory.
cd <YOUR_PROJECT_NAME>

# Step 3: Install the necessary dependencies.
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
```

**Edit a file directly in GitHub**

- Navigate to the desired file(s).
- Click the "Edit" button (pencil icon) at the top right of the file view.
- Make your changes and commit the changes.

**Use GitHub Codespaces**

- Navigate to the main page of your repository.
- Click on the "Code" button (green button) near the top right.
- Select the "Codespaces" tab.
- Click on "New codespace" to launch a new Codespace environment.
- Edit files directly within the Codespace and commit and push your changes once you're done.

## What technologies are used for this project?

This project is built with .

- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS

## Environment Setup

### Local Development

1. Copy the `.env.example` file to a new file named `.env.local`:
   ```sh
   cp .env.example .env.local
   ```

2. Edit the `.env.local` file and add your Supabase credentials:
   ```
   VITE_SUPABASE_URL=https://your-project-id.supabase.co
   VITE_SUPABASE_ANON_KEY=your-anon-key-here
   ```

3. Start the development server:
   ```sh
   npm run dev
   ```

### Vercel Deployment

When deploying to Vercel, you need to set up the following environment variables in the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Environment Variables
3. Add the following environment variables:
   - `VITE_SUPABASE_URL`: Your Supabase project URL
   - `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

> **Important**: Never commit your actual API keys or secrets to the repository. Always use environment variables for sensitive information.

## How can I deploy this project?

You can deploy to Vercel by connecting your GitHub repository to Vercel:

1. Create a Vercel account if you don't have one
2. Import your GitHub repository
3. Configure the build settings (Vite should be auto-detected)
4. Set up your environment variables
5. Deploy

## Can I connect a custom domain?

Yes! When deploying with Vercel, you can connect a custom domain through the Vercel dashboard:

1. Go to your project in the Vercel dashboard
2. Navigate to Settings > Domains
3. Add your domain and follow the instructions
