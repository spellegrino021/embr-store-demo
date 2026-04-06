import express from 'express';
import { createRequire } from 'module';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;

const EMBR_API_URL = process.env.EMBR_API_URL;
const EMBR_PROJECT_ID = process.env.EMBR_PROJECT_ID;

if (!EMBR_API_URL || !EMBR_PROJECT_ID) {
  console.error(
    'Missing required environment variables: EMBR_API_URL and EMBR_PROJECT_ID must be set'
  );
  process.exit(1);
}

// Parse JSON bodies for the proxy endpoint
app.use('/api', express.json());

// Proxy POST /api/chat → Embr API /public/chat (SSE streaming)
app.post('/api/chat', async (req, res) => {
  try {
    const upstream = await fetch(`${EMBR_API_URL}/public/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Project-Id': EMBR_PROJECT_ID,
      },
      body: JSON.stringify(req.body),
    });

    // Forward status and content-type
    res.status(upstream.status);
    const contentType = upstream.headers.get('content-type');
    if (contentType) {
      res.setHeader('Content-Type', contentType);
    }

    // SSE headers for streaming
    if (contentType?.includes('text/event-stream')) {
      res.setHeader('Cache-Control', 'no-cache');
      res.setHeader('Connection', 'keep-alive');
      res.setHeader('X-Accel-Buffering', 'no');
    }

    // Pipe the response stream through (supports SSE streaming)
    if (!upstream.body) {
      res.end();
      return;
    }

    const reader = upstream.body.getReader();
    const pump = async () => {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          res.end();
          return;
        }
        res.write(value);
      }
    };

    req.on('close', () => {
      reader.cancel().catch(() => {});
    });

    await pump();
  } catch (err) {
    console.error('Proxy error:', err.message);
    if (!res.headersSent) {
      res.status(502).json({ error: 'Failed to reach chat API' });
    }
  }
});

// Health check
app.get('/health', (_req, res) => res.send('ok'));

// Serve static Vite build with SPA fallback
app.use(express.static(join(__dirname, 'dist')));
app.get('/{*splat}', (_req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server listening on http://0.0.0.0:${PORT}`);
  console.log(`Proxying /api/chat → ${EMBR_API_URL}/public/chat`);
});
