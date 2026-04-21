# 🎨 Komail Art — Artist Portfolio & Sketch Store

A **premium, production-ready** Next.js artist portfolio with a hidden admin panel, built for deployment on Vercel with Supabase and Cloudinary.

## ✨ Features

- 🌙 **Dark / Light Mode** — System preference + toggle
- 🎠 **Animated Hero** — Particle canvas + Framer Motion
- 🖼️ **Full Gallery** — Search, filter, sort
- 📦 **Product Detail** — Image zoom, WhatsApp/Instagram/Email contact
- 🔐 **Admin Panel** at `/admin` — Login + CRUD dashboard
- 📱 **Mobile-First** — Fully responsive
- 🚀 **Vercel-Ready** — Zero-config deployment

## 🚀 Quick Start

```bash
# 1. Install dependencies (already done if you're reading this)
npm install

# 2. Copy environment variables
cp .env.local .env.local  # Already exists — fill in your values

# 3. Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 🔐 Admin Panel

Visit `/admin` and log in with:
- **Email:** `admin@gmail.com`
- **Password:** `admin123`

## 🗄️ Supabase Setup

1. Create a project at [supabase.com](https://supabase.com)
2. Run `supabase/schema.sql` in the SQL Editor
3. Go to **Authentication → Users → Add User**: `admin@gmail.com` / `admin123`
4. Copy your project URL and anon key to `.env.local`

## 🖼️ Cloudinary (Image Storage)

1. Create free account at [cloudinary.com](https://cloudinary.com)
2. Create an upload preset named `artist_sketches` (unsigned)
3. Add your cloud name and API keys to `.env.local`

## 🌐 Deploy to Vercel

```bash
npx vercel --prod
```

Or connect your GitHub repo to [Vercel](https://vercel.com) and add env vars in the dashboard.

## 📁 Project Structure

```
app/
├── page.tsx              # Homepage
├── gallery/              # All sketches
├── sketch/[id]/          # Product detail
├── about/                # About page
├── contact/              # Contact page
├── admin/                # Admin login (hidden)
│   └── dashboard/        # Admin CRUD panel
└── api/sketches/         # REST API

components/
├── layout/               # Navbar, Footer
├── home/                 # Hero, Gallery, About sections
└── providers/            # ThemeProvider

lib/
├── supabase.ts           # DB client
├── types.ts              # TypeScript types
└── mockData.ts           # Demo data (fallback)

supabase/
└── schema.sql            # Database schema
```

## 🎨 Design System

| Token | Value |
|---|---|
| Primary | `#0A0A0F` (dark) |
| Accent | `#C9A96E` (gold) |
| Glass | `rgba(255,255,255,0.05)` |
| Blur | `backdrop-filter: blur(20px)` |
| Font | Playfair Display + Inter |

## 📱 Social Links

Update `.env.local` with your real values:

```env
NEXT_PUBLIC_WHATSAPP_NUMBER=917XXXXXXXXXX
NEXT_PUBLIC_INSTAGRAM_HANDLE=yourhandle
NEXT_PUBLIC_EMAIL=your@email.com
NEXT_PUBLIC_YOUTUBE_CHANNEL=yourchannel
```
