# FormsAwesome

<p align="center">
  <img src="https://ik.imagekit.io/mmyzvdovbv/Untitled%20design%20%281%29.png" alt="FormsAwesome form builder" width="100%" />
</p>

<p align="center">
  Build, publish, and understand forms from one focused workspace.
</p>

FormsAwesome is a full-stack form platform for creating polished forms without hand-coding every field and submission flow. It combines a drag-and-drop builder, AI-assisted form creation, public shareable URLs, submission management, and analytics in a single Next.js application.

## What it includes

- **Visual form builder** with reusable field templates, drag-and-drop editing, live properties, preview, and publish actions.
- **AI form assistance** for generating and refining form structures with Gemini-powered services.
- **Public forms** available through stable shareable URLs such as `/f/[slug]`.
- **Submission management** with form-specific and workspace-level views.
- **Analytics** for form activity, views, and response trends.
- **Authentication** with email verification, protected routes, cookies, and optional Google OAuth support.
- **Workspace services** for MongoDB, Redis rate limiting and caching, email delivery, and Cloudinary profile media.
- **Embeddable form support** for placing published forms in other experiences.

## Technology

- [Next.js 16](https://nextjs.org/) with the App Router
- React 19 and TypeScript
- Tailwind CSS and reusable UI primitives
- Redux Toolkit for client-side form builder state
- MongoDB with Mongoose
- Redis for caching and rate limiting
- Zod, React Hook Form, and Axios
- Recharts for analytics visualizations
- Gemini and AI SDK integrations

## Getting started

### Prerequisites

- Node.js 20 or newer
- pnpm 11 or newer
- A MongoDB database
- Redis, Gemini, and SMTP credentials for the related features

### Installation

```bash
git clone https://github.com/SaqibFarhanProgrammer/FormsAwsome.git
cd FormsAwsome
pnpm install
```

Create a local `.env.local` file and configure the services used by your environment:

```env
MONGODB_URI=
REDIS_URL=
REDIS_DB_URL=
NEXT_PUBLIC_APP_URL=http://localhost:3000

ACCESS_TOKEN_SECRET=
REFRESH_TOKEN_SECRET=
VERIFICATION_TOKEN_SECRET=

GEMINI_API_KEY=

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=
SMTP_PASS=

GOOGLE_CLIENT_KEY=
GOOGLE_SECRET_KEY=
GOOGLE_REDIRECT_URI=http://localhost:3000/api/auth/google/callback

CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

Start the development server:

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Useful scripts

```bash
pnpm dev          # Start the development server
pnpm build        # Create a production build
pnpm start        # Run the production build
pnpm lint         # Run ESLint
pnpm format:check # Check Prettier formatting
pnpm check        # Run lint and formatting checks
```

## Product flow

```text
Sign up or sign in
        |
        v
Create a form -> Add and configure fields -> Save draft
        |
        v
Publish -> Share /f/[slug] or embed -> Collect submissions
        |
        v
Review responses and analytics
```

## Project structure

```text
app/          Routes, pages, layouts, and API handlers
components/   Shared UI and reusable visual components
core/         Database connections and server-side services
features/     Feature-owned components, models, services, and types
lib/          Shared authentication, Redis, and utility helpers
providers/    Application providers
public/       Static fonts, images, and icons
redux/        Redux store and feature slices
tests/        Unit and integration tests
```

Feature code lives under `features/<feature>/`, while business rules and database orchestration belong in `core/services/`. Public forms are rendered at `/f/[slug]`, and their public API lives under `/api/f/[slug]`.

## Deployment

FormsAwesome can be deployed as a standard Next.js application on platforms such as Vercel or any Node.js hosting provider that supports Next.js. Add the production environment variables in the hosting provider, set `NEXT_PUBLIC_APP_URL` to the deployed origin, and run:

```bash
pnpm build
pnpm start
```

Keep all secrets server-side. Do not commit `.env.local`, database credentials, API keys, or generated build output.

## Contributing

1. Create a focused branch from `main`.
2. Keep changes inside the owning feature or shared layer.
3. Run `pnpm check` before opening a pull request.
4. Include a clear description of behavior changes and any required environment variables.

## License

This project is currently private. Contact the repository owner before redistributing or using the code outside the project.
