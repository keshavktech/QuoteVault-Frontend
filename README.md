# QuoteVault Frontend 🎨

React frontend for QuoteVault — a secure quote sharing platform.

## Tech Stack
- **Framework:** React + TypeScript
- **Styling:** TailwindCSS + shadcn/ui
- **State Management:** TanStack Query
- **Routing:** TanStack Router
- **Build Tool:** Vite

## Features
- ✅ Register & Login with JWT
- ✅ Protected routes
- ✅ Quote feed with images
- ✅ Create quotes with image upload
- ✅ Save/unsave quotes
- ✅ Delete own quotes
- ✅ Error/success notifications

## Setup

### Prerequisites
- Node.js 18+
- npm

### Steps

**1. Clone the repo**
```bash
git clone https://github.com/keshavktech/QuoteVault-Frontend
cd QuoteVault-Frontend
```

**2. Install dependencies**
```bash
npm install
```

**3. Create `.env` file**
```
VITE_API_URL=http://localhost:8080
```

**4. Run**
```bash
npm run dev
```

App will run at `http://localhost:5173`

## Backend Repo
https://github.com/keshavktech/QuoteVault-Backend

Make sure backend is running at `http://localhost:8080` before starting frontend.
