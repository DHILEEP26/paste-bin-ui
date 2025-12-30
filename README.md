# Pastebin-Lite Frontend

Next.js frontend application for Pastebin-Lite.

## Project Structure

```
app/
├── page.tsx                  # Main page
├── layout.tsx                # Root layout with Toaster
├── globals.css               # Global styles
component/
├── PastebinHome.tsx          # Main pastebin component
├── ui/                       # Reusable UI components
service/
├── pasteService.ts           # API service functions
├── apiClient.ts              # Axios configuration
lib/
├── utils.ts                  # Utility functions
```

## Setup Instructions

1. **Install dependencies**
   ```bash
   npm install
   ```

2. **Set up environment variables**
   
   Create `.env.local`:
   ```bash
   NEXT_PUBLIC_API_URL=http://localhost:3000/api
   ```

3. **Run development server**
   ```bash
   npm run dev
   ```

   Open [http://localhost:3001](http://localhost:3001) in your browser.

## Features

- Create text pastes with optional constraints
- Time-based expiry (TTL)
- View count limits
- Copy paste URL to clipboard
- Beautiful, responsive UI
- Real-time feedback with toast notifications

## Deployment

### Vercel Deployment

1. Push your code to GitHub
2. Import the project in Vercel
3. Set environment variable:
   - `NEXT_PUBLIC_API_URL`: Your backend API URL
4. Deploy

## Tech Stack

- **Framework**: Next.js 14 with App Router
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui components
- **HTTP Client**: Axios
- **Notifications**: Sonner (toast)
- **Icons**: Lucide React

## Important Notes

- Make sure your backend is running before starting the frontend
- Update `NEXT_PUBLIC_API_URL` in `.env.local` to point to your backend
- For production, update the environment variable to your deployed backend URL