# Job Application Tracker

A silly lil job application tracking system built to organize the modern job hunt. This app allows users to log job postings, track their status, and identify which platforms (LinkedIn, Indeed, etc.) are used.

---

## Features

- **Google Authentication**: Secure one-tap login powered by Firebase Auth.
- **Private Dashboard**: Row-level security ensures you only see your own data.
- **Full CRUD Functionality**: Add, edit, and delete job applications with real-time updates.
- **Smart Filtering**: Instant search bar to filter by Company, Position, or Source.
- **Source Tracking**: Dedicated field to track where you found the posting to optimize your strategy.
- **Responsive Design**: Mobile-friendly UI built with Tailwind CSS for tracking on the go.

---

## My Tech Stack

- **Frontend**: [Next.js](https://nextjs.org/) (React)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Database**: [Firebase Firestore](https://firebase.google.com/products/firestore) (NoSQL)
- **Authentication**: [Firebase Auth](https://firebase.google.com/products/auth) (Google Provider)
- **Deployment**: [Vercel](https://vercel.com/)

---

## Security & Privacy

This project implements security practices:

- **Environment Variables**: Sensitive Firebase API keys are are never exposed in the source code.
- **Firestore Security Rules**: Implemented logic to restrict data access. Only the authenticated `owner` of a record can Read, Update, or Delete it.
- **Auth Guard**: Protected routes and UI components that react to the user's authentication state.

---
