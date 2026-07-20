# ProjectScope AI

> Discover, compare, and analyse project ideas across GitHub, YouTube, and the web.

ProjectScope AI is a full-stack Next.js application that helps students, developers, researchers, and makers evaluate whether a project idea appears to be already available publicly, closely related to existing work, or uncommon in the sources searched.

The application does **not** claim that an idea is legally original, patentable, or completely new. It provides an automated similarity estimate based on available public information.

## Live deployment

**ProjectScope AI:**

https://project-scope-ai-p926-k4su2ulhg-aruns-projects-9558449a.vercel.app/

> The deployment may require Vercel authentication while Deployment Protection is enabled. To make the production site publicly accessible, review the project's Vercel Deployment Protection settings.

## Main features

- Two project-input modes:
  - **Detailed Form** for structured project information
  - **Describe Your Idea** for entering a complete idea in one paragraph
- AI-assisted extraction of:
  - Project title
  - Problem statement
  - Category
  - Technologies
  - Hardware components
  - Intended users
  - Main features
  - Expected output
  - Alternative search queries
- Searches configured sources:
  - GitHub repositories
  - YouTube videos
  - Tavily, Google Programmable Search, Brave Search, Bing Search, or mock web search
- Provider-based AI architecture supporting:
  - Groq
  - Gemini
  - OpenAI-compatible APIs
  - Hugging Face
  - Ollama
  - Local keyword-analysis fallback
- Transparent similarity scoring and classification
- Side-by-side project comparison
- Improvement recommendations at basic, intermediate, and advanced levels
- Search history and saved results using browser storage
- PDF, Markdown, JSON, and CSV report exports
- Light and dark modes
- Responsive mobile and desktop layout
- Vercel Web Analytics integration
- Optional public visitor and project-analysis counters using Upstash Redis
- Provider status and health pages
- Graceful behaviour when an API key is missing or a provider fails

## How it works

1. The user chooses **Detailed Form** or **Describe Your Idea**.
2. ProjectScope AI validates and normalises the input.
3. It extracts technical concepts, keywords, technologies, components, users, and expected output.
4. It generates alternative technical search phrases.
5. It searches all enabled providers.
6. It removes duplicate results.
7. It compares each result with the user's idea.
8. It calculates a transparent similarity score.
9. It presents ranked GitHub, YouTube, and web results.
10. It suggests ways to improve or differentiate the project.

## Similarity classifications

| Score | Classification |
|---:|---|
| 90–100 | Exact or Near-Exact Match |
| 75–89 | Highly Similar |
| 50–74 | Related Project |
| 25–49 | Weakly Related |
| 0–24 | No Strong Match Found |

The score considers title similarity, description similarity, keyword overlap, technology overlap, component overlap, category similarity, and available source content.

## Important disclaimer

When no strong match is found, the application displays this warning:

> No closely matching public project was found in the sources searched. Your idea may be uncommon, unpublished, private, or described using different terminology. This result does not prove complete originality, novelty, or patentability.

ProjectScope AI is not a legal patent-search service. Always verify licences before using external source code.

## Technology stack

- Next.js 16 App Router
- React 19
- TypeScript with strict mode
- Tailwind CSS
- TanStack Query
- Zod
- Lucide React
- next-themes
- pdf-lib
- Vercel Analytics
- Vitest
- React Testing Library
- Playwright
- ESLint
- Prettier

## Project structure

```text
projectscope-ai/
├── app/
│   ├── api/
│   │   ├── analyse/
│   │   ├── compare/
│   │   ├── export/
│   │   ├── github/
│   │   ├── health/
│   │   ├── metrics/
│   │   ├── web-search/
│   │   └── youtube/
│   ├── about/
│   ├── compare/
│   ├── history/
│   ├── privacy/
│   ├── results/
│   ├── saved/
│   ├── settings/
│   ├── status/
│   └── terms/
├── components/
│   ├── comparison/
│   ├── forms/
│   ├── layout/
│   ├── metrics/
│   ├── results/
│   ├── search/
│   ├── settings/
│   ├── storage/
│   └── ui/
├── lib/
│   ├── ai/
│   ├── cache/
│   ├── export/
│   ├── github/
│   ├── metrics/
│   ├── rate-limit/
│   ├── scoring/
│   ├── search/
│   ├── security/
│   ├── storage/
│   ├── validation/
│   ├── web-search/
│   └── youtube/
├── public/
├── tests/
├── types/
├── .env.example
├── package.json
├── package-lock.json
├── next.config.ts
├── vercel.json
└── vitest.config.ts
```

## Prerequisites

- Node.js 24.x
- npm
- Git
- Optional provider API accounts

## Local installation

### Windows PowerShell

```powershell
git clone https://github.com/ArunkumarKathiravan/Project-Scope-AI.git
Set-Location Project-Scope-AI
npm install
Copy-Item .env.example .env.local
npm run dev
```

Open:

```text
http://localhost:3000
```

### macOS or Linux

```bash
git clone https://github.com/ArunkumarKathiravan/Project-Scope-AI.git
cd Project-Scope-AI
npm install
cp .env.example .env.local
npm run dev
```

## Environment variables

Create `.env.local` for local development. Never commit that file.

```env
# Application
NEXT_PUBLIC_APP_NAME=ProjectScope AI
NEXT_PUBLIC_APP_URL=http://localhost:3000

# GitHub
GITHUB_TOKEN=

# YouTube
YOUTUBE_API_KEY=

# Web search
WEB_SEARCH_PROVIDER=tavily
TAVILY_API_KEY=
GOOGLE_SEARCH_API_KEY=
GOOGLE_SEARCH_ENGINE_ID=
BRAVE_SEARCH_API_KEY=
BING_SEARCH_API_KEY=

# AI
AI_PROVIDER=groq
GROQ_API_KEY=
GROQ_MODEL=llama-3.3-70b-versatile
GEMINI_API_KEY=
GEMINI_MODEL=gemini-2.0-flash
OPENAI_API_KEY=
OPENAI_MODEL=gpt-4.1-mini
AI_BASE_URL=https://api.openai.com/v1
HUGGINGFACE_API_KEY=
HUGGINGFACE_MODEL=

# Ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2

# Rate limiting
RATE_LIMIT_REQUESTS=20
RATE_LIMIT_WINDOW_SECONDS=60

# Cache
CACHE_DURATION_SECONDS=3600

# Demo mode
ENABLE_DEMO_MODE=false

# Optional public counters
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Only add variables for providers you intend to use. Missing providers are disabled without breaking the rest of the application.

## Recommended provider setup

For the standard hosted configuration, use:

```env
GITHUB_TOKEN=your_github_token
YOUTUBE_API_KEY=your_youtube_api_key

WEB_SEARCH_PROVIDER=tavily
TAVILY_API_KEY=your_tavily_key

AI_PROVIDER=groq
GROQ_API_KEY=your_groq_key
GROQ_MODEL=llama-3.3-70b-versatile
```

For public counters, also configure:

```env
UPSTASH_REDIS_REST_URL=your_upstash_rest_url
UPSTASH_REDIS_REST_TOKEN=your_upstash_rest_token
```

Never expose secret variables with the `NEXT_PUBLIC_` prefix.

## Provider setup overview

### GitHub

Create a GitHub personal access token and store it as:

```text
GITHUB_TOKEN
```

The token increases API limits. The application uses the official GitHub API and never clones or executes repository code.

### YouTube

Enable YouTube Data API v3 in Google Cloud and store the key as:

```text
YOUTUBE_API_KEY
```

### Tavily

Create a Tavily API key and configure:

```env
WEB_SEARCH_PROVIDER=tavily
TAVILY_API_KEY=your_key
```

### Google Programmable Search

```env
WEB_SEARCH_PROVIDER=google
GOOGLE_SEARCH_API_KEY=your_key
GOOGLE_SEARCH_ENGINE_ID=your_engine_id
```

### Brave Search

```env
WEB_SEARCH_PROVIDER=brave
BRAVE_SEARCH_API_KEY=your_key
```

### Bing Search

```env
WEB_SEARCH_PROVIDER=bing
BING_SEARCH_API_KEY=your_key
```

### Groq

```env
AI_PROVIDER=groq
GROQ_API_KEY=your_key
GROQ_MODEL=llama-3.3-70b-versatile
```

### Gemini

```env
AI_PROVIDER=gemini
GEMINI_API_KEY=your_key
GEMINI_MODEL=gemini-2.0-flash
```

### OpenAI-compatible provider

```env
AI_PROVIDER=openai
OPENAI_API_KEY=your_key
OPENAI_MODEL=gpt-4.1-mini
AI_BASE_URL=https://api.openai.com/v1
```

### Ollama

```env
AI_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=llama3.2
```

Ollama is normally useful for local development. A locally running Ollama server is not directly reachable from a standard Vercel deployment.

## Available commands

```bash
npm run dev
npm run build
npm start
npm run lint
npm run type-check
npm run test
npm run test:watch
npm run test:e2e
npm run format
npm run format:check
```

## Production build

```bash
npm install
npm run format:check
npm run lint
npm run type-check
npm run test
npm run build
npm start
```

## Deploying to Vercel

1. Push the project to GitHub.
2. Open the Vercel dashboard.
3. Select **Add New → Project**.
4. Import the GitHub repository.
5. Keep the root directory as `./`.
6. Confirm the framework preset is Next.js.
7. Add provider keys under **Settings → Environment Variables**.
8. Apply variables to Production, Preview, and Development as needed.
9. Deploy or redeploy the latest commit.
10. Open `/status` to review provider configuration.

Recommended Vercel environment values:

```env
NEXT_PUBLIC_APP_NAME=ProjectScope AI
NEXT_PUBLIC_APP_URL=https://your-production-domain.vercel.app
ENABLE_DEMO_MODE=false
```

## Making the live site public

If visitors are redirected to a Vercel login page:

1. Open the project in Vercel.
2. Go to **Settings → Deployment Protection**.
3. Use **Standard Protection** so production domains remain public, or disable Vercel Authentication for the production deployment.
4. Save the setting.
5. Test the production domain in a private/incognito browser window.

Preview and generated deployment URLs may remain protected even when the main production domain is public.

## Analytics and visitor counters

### Private analytics

The application includes `@vercel/analytics`. After deployment, enable Web Analytics in the Vercel project dashboard to view traffic information such as page views and visitors.

### Public counters

The visible visitor and project-analysis counters use Upstash Redis when these values are configured:

```env
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
```

Without them, the main search features still work, but the shared public counters may be unavailable or hidden.

## GitHub upload commands

```bash
git init
git add .
git commit -m "Initial ProjectScope AI release"
git branch -M main
git remote add origin https://github.com/ArunkumarKathiravan/Project-Scope-AI.git
git push -u origin main
```

For future updates:

```bash
git add .
git commit -m "Update ProjectScope AI"
git push
```

## Security

- Provider keys are used only in server-side route handlers.
- Secret values must never use `NEXT_PUBLIC_`.
- Input is validated with Zod.
- External URLs are validated.
- Provider requests use timeouts and limited retries.
- External README content, video descriptions, and web snippets are treated as untrusted text.
- External content cannot override application instructions.
- Repository code is never cloned, installed, or executed.
- Unsafe HTML is not rendered.
- Errors do not reveal API keys or stack traces to users.

## Limitations

- Search results depend on provider coverage, wording, API quotas, and public availability.
- Private, unpublished, recently created, or poorly indexed projects may not appear.
- Similarity is an automated estimate rather than proof of originality.
- YouTube and web APIs can impose quotas or rate limits.
- Browser local storage is device-specific.
- In-memory cache and rate limiting may reset between serverless instances.
- Public counters require configured Upstash Redis credentials.

## Troubleshooting

### A provider shows “Not configured”

Add its environment variable in Vercel, save it, and create a new deployment.

### The build cannot detect Next.js

Confirm that `package.json` is in the repository root and that the Vercel root directory is `./`.

### npm installation fails on Vercel

Confirm:

- `package-lock.json` uses the public npm registry
- `package.json` specifies Node.js 24.x
- `vercel.json` uses the intended install command
- the latest GitHub commit is the deployment being built

### The live link asks users to log in

Review **Settings → Deployment Protection** in Vercel and make the production domain public.

### The visitor counter is missing

Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`, then redeploy.

### Search returns partial results

Open `/status` and check which providers are configured, operational, unavailable, or rate limited.

## Roadmap

- User accounts and cloud-synchronised saved projects
- Supabase or PostgreSQL storage
- Deeper academic-paper discovery
- Patent-database integrations with clear legal disclaimers
- Team workspaces
- Search-result sharing
- More advanced semantic embeddings
- Improved project-report templates
- Multilingual project descriptions
- Mobile application companion

## Contributing

1. Fork the repository.
2. Create a feature branch.
3. Make focused changes.
4. Run formatting, linting, type checking, tests, and the production build.
5. Submit a pull request with a clear explanation.

## Licence

This project is licensed under the MIT License. See `LICENSE` for details.

## Author

**Arunkumar Kathiravan**

GitHub: https://github.com/ArunkumarKathiravan

---

ProjectScope AI helps users discover related work and make better technical decisions. It does not provide legal conclusions about novelty, copyright, ownership, or patentability.
