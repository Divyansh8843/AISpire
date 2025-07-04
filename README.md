This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

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

# AIspire: AI Career Coach Platform

AIspire is an AI-powered career platform built with Next.js, Clerk authentication, Prisma ORM, and OpenAI/Google Generative AI. It helps users accelerate their career growth with features like resume and cover letter builders, industry insights, and AI-driven interview preparation.

---

## Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [API & Route Endpoints](#api--route-endpoints)
  - [Authentication & Middleware](#authentication--middleware)
  - [User & Onboarding](#user--onboarding)
  - [Resume](#resume)
  - [Cover Letter](#cover-letter)
  - [Interview & Assessment](#interview--assessment)
  - [Industry Insights](#industry-insights)
- [Example Usage](#example-usage)
- [License](#license)

---

## Features

- **Personalized Onboarding:** Tailored onboarding to capture user industry, experience, and skills.
- **AI Resume Builder:** Generate ATS-optimized resumes with markdown editing and PDF export.
- **AI Cover Letter Generator:** Instantly create job-specific cover letters using AI.
- **Interview Preparation:** Practice with AI-generated, role-specific quizzes and get improvement tips.
- **Industry Insights:** Get real-time trends, salary data, and market analysis.
- **Progress Tracking:** Track interview performance and growth analytics.
- **Secure Authentication:** Powered by Clerk.

---

## Tech Stack

- **Frontend:** Next.js (App Router), React, Tailwind CSS
- **Backend:** Next.js API routes, Server Actions
- **Database:** Prisma ORM (PostgreSQL/MySQL/SQLite)
- **Authentication:** Clerk
- **AI:** Google Generative AI / OpenAI
- **Other:** Sonner (toasts), Lucide Icons

---

## Getting Started

1. **Install dependencies:**

   ```sh
   npm install
   ```

2. **Set up environment variables:**

   - Copy `.env.example` to `.env` and fill in your database, Clerk, and AI API keys.

3. **Generate Prisma client:**

   ```sh
   npx prisma generate
   ```

4. **Run database migrations:**

   ```sh
   npx prisma migrate dev
   ```

5. **Start the development server:**

   ```sh
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000) in your browser.**

---

## Project Structure

- `app/` - Next.js app directory (pages, layouts, API routes)
- `components/` - Reusable UI components
- `actions/` - Server actions (business logic for user, resume, cover letter, interview, dashboard)
- `hooks/` - Custom React hooks (e.g., `useFetch`)
- `lib/` - Helpers, Prisma client, validation schemas
- `data/` - Static data (industries, testimonials, features, steps)
- `prisma/` - Prisma schema and migrations
- `public/` - Static assets (logo, images)

---

## API & Route Endpoints

### Authentication & Middleware

- **Clerk-powered authentication** is enforced on all protected routes via [`middleware.js`](middleware.js).
- Protected routes: `/dashboard`, `/resume*`, `/interview*`, `/cover-letter*`, `/onboarding*`

---

### User & Onboarding

- **Onboarding Page:**  
  `GET /onboarding`

  - Renders onboarding form.
  - Calls [`getUserOnboardingStatus`](actions/user.js) to check if user is onboarded.

- **Server Action:**  
  [`getUserOnboardingStatus`](actions/user.js)

  - Returns `{ isOnboarded: boolean }` for the current user.

- **Update User Profile:**  
  [`updateUser(data)`](actions/user.js)
  - Updates user industry, experience, bio, and skills.
  - Called via API route or server action.

---

### Resume

- **Resume Builder Page:**  
  `GET /resume`

  - Interactive resume builder with markdown preview and PDF export.

- **Server Action:**  
  [`saveResume(data)`](actions/resume.js)
  - Saves or updates the user's resume in the database.

---

### Cover Letter

- **Cover Letter Generator:**  
  `GET /cover-letter/new`

  - Form to generate a new cover letter.

- **Server Action:**  
  [`createCoverLetter(data)`](actions/coverletter.js)

  - Generates a cover letter using AI and saves it.

- **List All Cover Letters:**  
  `GET /cover-letter`

  - Lists all cover letters for the user.

- **Delete Cover Letter:**  
  [`deleteCoverLetter(id)`](actions/coverletter.js)
  - Deletes a cover letter by ID.

---

### Interview & Assessment

- **Interview Prep Page:**  
  `GET /interview`

  - Dashboard for interview quizzes and performance analytics.

- **Server Actions:**
  - [`generateQuiz()`](actions/interview.js): Generates 10 technical MCQs for the user's industry/skills.
  - [`saveQuizResult({ questions, answers, score })`](actions/interview.js): Saves quiz results and generates improvement tips.
  - [`getAssesment()`](actions/interview.js): Fetches all assessments for the user.

---

### Industry Insights

- **Dashboard Page:**  
  `GET /dashboard`

  - Shows industry insights, trends, and analytics.

- **Server Action:**  
  [`generateAIInsights(industry)`](actions/dashboard.js)
  - Generates and caches industry insights using AI.

---

### Example API Route

**Example: Save Resume**

```js
// POST /api/resume/save
fetch("/api/resume/save", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({ content: "..." }),
});
```

**Example: Generate Cover Letter**

```js
// POST /api/cover-letter/create
fetch("/api/cover-letter/create", {
  method: "POST",
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify({
    jobTitle: "Frontend Developer",
    companyName: "Tech Corp",
    jobDescription: "...",
  }),
});
```

---

## Example Usage

- **Onboarding:**  
  Fill out `/onboarding` to set your industry, experience, and skills.

- **Resume:**  
  Use `/resume` to build, preview, and export your resume.

- **Cover Letter:**  
  Go to `/cover-letter/new` to generate a new cover letter for a job.

- **Interview:**  
  Visit `/interview` to take a quiz and get AI-powered feedback.

---

## License

MIT

---

**Made with ❤️ by the AIspire Team**
