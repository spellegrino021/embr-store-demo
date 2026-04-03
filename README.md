# Ember Roast Co. — Demo Store

A sample coffee store website with an embedded AI chat agent, powered by [Embr](https://github.com/spellegrino021/embr).

## What is this?

This is a demo app that shows how to integrate an **Embr Foundry Agent** into a public website. The floating chat widget at the bottom-right connects to an Azure AI Foundry agent through Embr's anonymous chat proxy — no login required.

## How it works

```
┌─────────────┐       POST /public/chat       ┌──────────┐       Azure OpenAI       ┌──────────────┐
│  This App   │  ──────────────────────────▶  │  Embr    │  ──────────────────────▶  │  Azure AI    │
│  (browser)  │  ◀──────── SSE stream ──────  │  API     │  ◀──────── stream ──────  │  Foundry     │
└─────────────┘                                └──────────┘                           └──────────────┘
```

1. User types a message in the chat widget
2. The widget sends it to Embr's `/public/chat` endpoint with the project ID
3. Embr looks up the project's stored Azure AI credentials (never exposed to the browser)
4. Embr streams the AI response back via SSE
5. Tokens appear in real-time in the chat bubble

## Quick Start

### Prerequisites

- Node.js 18+
- An Embr project with a Foundry connection configured

### Setup

```bash
# Clone the repo
git clone https://github.com/spellegrino021/embr-store-demo.git
cd embr-store-demo

# Install dependencies
npm install

# Configure environment
cp .env .env.local
# Edit .env.local with your values:
#   VITE_API_URL=https://your-embr-instance.com
#   VITE_PROJECT_ID=your-project-id

# Start dev server
npm run dev
```

### Deploy to Embr

1. Push this repo to GitHub
2. Create an Embr project pointing to the repo
3. Configure a Foundry connection in the Embr Portal
4. Deploy — the chat widget will automatically connect

## Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_URL` | Base URL of your Embr API | `https://embr-api.example.com` |
| `VITE_PROJECT_ID` | Your Embr project ID | `prj_abc123` |

## Tech Stack

- **Vite** + **React 19** + **TypeScript**
- CSS Modules (no UI library needed for a simple demo)
- Server-Sent Events (SSE) for real-time streaming
