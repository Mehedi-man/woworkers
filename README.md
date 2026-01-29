# Connect-Earn (WoWorkers)

A modern freelancing platform connecting clients with verified female professionals for household services. Built with React, TypeScript, Vite, and Supabase.

## 🌟 Features

- **Verified Professionals**: All professionals go through ID verification and background checks
- **Secure Payments**: Escrow payment system ensures satisfaction before payment
- **Real-time Messaging**: Built-in messaging system for seamless communication
- **Job Posting & Bidding**: Clients can post jobs and freelancers can submit proposals
- **Contract Management**: Track contracts, milestones, and deliveries
- **Reviews & Ratings**: Comprehensive review system for quality assurance
- **Multi-language Support**: Bengali (Bangla) language interface
- **Dark Mode**: Beautiful dark/light theme support

## 🚀 Tech Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **UI Components**: shadcn/ui + Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Supabase (Auth, Database, Storage)
- **State Management**: React Query (TanStack Query)
- **Routing**: React Router v6
- **Forms**: React Hook Form + Zod validation

## 📋 Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- A Supabase account and project

## 🛠️ Setup Instructions

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd connect-earn-main
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Environment Variables

Create a `.env` file in the root directory:

```bash
cp .env.example .env
```

Then update the `.env` file with your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_anon_key
```

**How to get Supabase credentials:**
1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Select your project (or create a new one)
3. Go to Settings → API
4. Copy the "Project URL" and "anon public" key

### 4. Run Database Migrations

Make sure your Supabase database is set up with the required tables. The migrations are in the `supabase/migrations/` directory.

### 5. Start Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:8080`

## 📦 Build for Production

```bash
npm run build
```

The production build will be in the `dist` directory.

Preview the production build locally:

```bash
npm run preview
```

## 🚢 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Import your repository on [Vercel](https://vercel.com)
3. Add environment variables in Vercel dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy!

The `vercel.json` file is already configured for optimal deployment.

### Deploy to Netlify

1. Push your code to GitHub
2. Import your repository on [Netlify](https://netlify.com)
3. Add environment variables in Netlify dashboard:
   - `VITE_SUPABASE_URL`
   - `VITE_SUPABASE_PUBLISHABLE_KEY`
4. Deploy!

The `netlify.toml` file is already configured.

### Other Platforms

This is a standard Vite React app, so it can be deployed to any static hosting service:
- GitHub Pages
- AWS S3 + CloudFront
- Firebase Hosting
- Cloudflare Pages
- etc.

## 📁 Project Structure

```
connect-earn-main/
├── public/              # Static assets
├── src/
│   ├── components/     # Reusable React components
│   │   ├── ui/         # shadcn/ui components
│   │   ├── jobs/       # Job-related components
│   │   ├── freelancers/# Freelancer-related components
│   │   └── ...
│   ├── contexts/       # React contexts (Auth, etc.)
│   ├── data/          # Mock data and constants
│   ├── hooks/         # Custom React hooks
│   ├── integrations/  # Third-party integrations (Supabase)
│   ├── lib/           # Utility functions
│   ├── pages/         # Page components (routes)
│   ├── types/         # TypeScript type definitions
│   └── ...
├── supabase/          # Supabase configuration and migrations
└── ...
```

## 🔐 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `VITE_SUPABASE_URL` | Your Supabase project URL | Yes |
| `VITE_SUPABASE_PUBLISHABLE_KEY` | Your Supabase anon/public key | Yes |

## 🧪 Development

- **Linting**: `npm run lint`
- **Type Checking**: TypeScript is configured and will show errors in your IDE
- **Hot Reload**: Enabled by default in development mode

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run build:dev` - Build in development mode
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint

## 🤝 Contributing

This is a university project. For contributions or questions, please contact the project maintainer.

## 📄 License

This project is for educational purposes.

## 🙏 Acknowledgments

- Built with [Lovable](https://lovable.dev) (initial scaffolding)
- UI components from [shadcn/ui](https://ui.shadcn.com)
- Backend powered by [Supabase](https://supabase.com)

## 📞 Support

For issues or questions, please open an issue in the repository or contact the development team.

---

**Note**: Make sure to set up your Supabase project with the required database schema before deploying. Check the `supabase/migrations/` directory for the database structure.
