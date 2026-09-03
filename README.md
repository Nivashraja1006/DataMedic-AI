# DataMedic AI

DataMedic AI is a full-stack starter for data quality assessment, anomaly detection, and AI-assisted cleaning.

## Run the frontend

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Run the Flask API

```bash
cd backend
python -m venv .venv
.venv\Scripts\activate
pip install -r requirements.txt
python app.py
```

The API runs at http://localhost:5000. Upload a CSV, Excel, or JSON file to `POST /api/analyze` using the `file` field. `GET /api/health` is available for checks and `POST /api/copilot` accepts `{ "question": "What should I fix first?" }`.

The dashboard ships with realistic workspace data and a functional Copilot modal so the product can be evaluated immediately. For local development, the frontend uses `http://localhost:5000/api` automatically. For a deployed frontend, set the Vercel environment variable `NEXT_PUBLIC_API_URL` to the public Flask API origin, for example `https://your-api.example.com` (the frontend adds `/api` automatically). Deploy the Flask backend first and verify `https://your-api.example.com/api/health` returns `{"status":"ok"}`.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
