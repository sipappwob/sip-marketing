# Sip Bar Admin Dashboard

Minimal Next.js dashboard for bar admins to view behavioral analytics (views, clicks, scans, redemptions, funnel, segment mix). No spend or payment data.

## Setup

1. Install dependencies: `npm install`
2. Copy `.env.local.example` to `.env.local` and set your Firebase web app config (same project as the Sip backend):

   ```
   NEXT_PUBLIC_FIREBASE_API_KEY=...
   NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=...
   NEXT_PUBLIC_FIREBASE_PROJECT_ID=...
   NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=...
   NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
   NEXT_PUBLIC_FIREBASE_APP_ID=...
   ```

3. Run the dev server: `npm run dev` and open http://localhost:3000

## Usage

- Sign in with a **bar admin** Firebase Auth account (the same project as the Sip app).
- Select a bar (only bars you are an admin for are listed).
- Choose a date range and view overview metrics, funnel conversion, campaign list, and daily rollup table.
- Open a campaign to see its time series and segment mix.

Data is loaded via Cloud Functions: `getMyBars`, `getBarAnalytics`, `listCampaigns`. Ensure the Firebase project has the Sip Cloud Functions deployed and that `bar_admins` documents include your user and the correct `barIds` map for rules.
