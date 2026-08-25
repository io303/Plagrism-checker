# AI Plagiarism Checker & Content Humanizer

A full-stack web application that detects plagiarism in text, analyzes originality, and rewrites copied content into unique, human-like text. Built with React, TypeScript, Tailwind CSS.

---

## Live Demo

[Plagrism Checker](https://plagrism-checker-theta.vercel.app/)

---

## Features

### Core Features
- **Plagiarism Detection** — Paste or type text and get an instant plagiarism percentage.
- **Detailed Match Report** — View matched sources, similarity percentages, and highlighted text.
- **Document Upload** — Upload PDF, DOCX, or TXT files and extract text automatically.
- **Text Humanization** — Rewrite plagiarized content into original text using AI.
- **Check History** — View and reload previous plagiarism checks.
- **Comparison View** — Compare original text against matched sources side-by-side.
- **Downloadable Report** — Export plagiarism reports as a text file.

### Additional Features
- Responsive and modern UI with smooth animations
- Real-time character count and validation
- Adjustable originality level for humanization
- Color-coded results (green / yellow / red)
- Loading states and error handling
- Secure backend with row-level security

---

## Tech Stack

### Frontend
- **React 18** — UI library
- **TypeScript** — Type-safe JavaScript
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first styling
- **shadcn/ui** — Accessible UI components
- **Lucide React** — Icon library
- **React Router** — Client-side routing
- **TanStack Query** — Data fetching and caching

### Backend
- **PostgreSQL Database** — Stores check history
- **Edge Functions** — Serverless functions for AI processing
- **Storage Bucket** — Stores uploaded documents
- **AI Gateway** — Powers plagiarism detection and humanization

---

## Project Structure

```
├── public/                  # Static files (favicon, robots.txt)
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── ComparisonModal.tsx
│   │   ├── FAQSection.tsx
│   │   ├── FeaturesSection.tsx
│   │   ├── HeroSection.tsx
│   │   ├── HistorySidebar.tsx
│   │   ├── HowItWorksSection.tsx
│   │   └── NavLink.tsx
│   ├── hooks/               # Custom React hooks
│   ├── integrations/        # Supabase client and types
│   ├── lib/                 # Utility functions
│   ├── pages/               # Page components
│   │   ├── Index.tsx        # Main app page
│   │   └── NotFound.tsx     # 404 page
│   ├── App.tsx              # App root with routes
│   ├── App.css              # App-specific styles
│   ├── index.css            # Global styles and Tailwind
│   └── main.tsx             # App entry point
├── supabase/
│   ├── config.toml          # Edge function configuration
│   └── functions/           # Serverless backend functions
│       ├── check-plagiarism/
│       ├── humanize-text/
│       └── parse-document/
├── index.html               # HTML entry point
├── package.json             # Dependencies and scripts
├── tailwind.config.ts       # Tailwind configuration
├── tsconfig.json            # TypeScript configuration
└── vite.config.ts           # Vite configuration
```

---

## How It Works

### 1. User Enters Text
The user pastes text into the input area or uploads a document. The frontend validates that the text is at least 50 characters long.

### 2. Plagiarism Check
The text is sent to the `check-plagiarism` Edge Function, which:
- Uses an AI model to analyze the text
- Compares it against known patterns and sources
- Returns a plagiarism percentage and a list of matches

### 3. Results Display
The frontend displays:
- Overall plagiarism score
- Status badge (Original / Plagiarism Detected)
- Progress bar
- Detailed list of matched sources
- Option to compare or download the report

### 4. Humanization
If the text is plagiarized, the user can click **Humanize Text**. This sends the text to the `humanize-text` Edge Function, which rewrites it using AI to improve originality.

### 5. History Saving
Every check is saved to a PostgreSQL database via Supabase, allowing users to reload previous results from the sidebar.

---

## Edge Functions

### `check-plagiarism`
Receives text input, runs AI-based plagiarism analysis, and returns:
- `plagiarismPercentage` — percentage of text that may be plagiarized
- `matches` — array of matched sources and text
- `isOriginal` — boolean result

### `humanize-text`
Receives text and an originality level, then rewrites the content to reduce plagiarism while preserving meaning.

### `parse-document`
Downloads uploaded files from storage, extracts text from PDF, DOCX, or TXT files, and returns the plain text.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or higher
- npm or any other package manager

### Installation

1. Clone the repository:

```bash
git clone https://github.com/your-username/your-repo-name.git
cd your-repo-name
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

4. Open your browser and visit:

```
http://localhost:8080
```

### Build for Production

```bash
npm run build
```

The optimized build will be generated in the `dist/` folder.

---

## Environment Variables

This project uses  Cloud for backend services. The required environment variables are automatically injected at build time.

Do not expose service-role keys or sensitive credentials in client-side code.

---

## Usage Guide

1. **Open the app** in your browser.
2. **Paste text** into the input box or **upload a document**.
3. Click **Check Plagiarism** to analyze the content.
4. Review the **plagiarism score** and matched sources.
5. Click **Compare** to view side-by-side comparison.
6. Click **Download Report** to save the result.
7. If needed, click **Humanize Text** to rewrite the content.

---

## Future Enhancements

- PDF report generation
- User authentication and saved sessions
- Multi-language support
- Citation checker and generator
- Batch document processing
- Analytics dashboard
- Grammar and readability scoring

---

## License

This project is built for educational and demonstration purposes. You are free to modify and extend it as needed.

---

