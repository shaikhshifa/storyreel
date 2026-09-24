# Storyreel – AI story video maker (prototype)

Files
- index.html               Storyreel: AI writes a story, canvas plays it as a narrated animated video
- clipforge-explainer.html Earlier prototype: script to animated explainer / social clip

Run
Open index.html in a browser (Chrome or Edge recommended for voice narration).
No build step, no dependencies. Fonts load from Google Fonts with system fallbacks.

AI-backed run
Use Node 18+ and keep the API key on the server:
1. Set `ANTHROPIC_API_KEY` in the environment (see `.env.example`).
2. Run `npm start`.
3. Open http://localhost:3000.

The server uses `ANTHROPIC_MODEL` when set, or `claude-3-5-haiku-latest` by default.

Important: the AI story writing
index.html can call Claude through the claude.ai artifact runtime (window.claude,
"sample"), or use the local server's `/api/story` endpoint. The key stays on the
server. If the server is not running or no key is configured, the button creates a
local template story from the idea instead. The endpoint returns:
{ "title": string, "scenes": [ { narration, setting, time, colors, cast, camera } ] }

Next steps
- Video export (MediaRecorder on canvas + audio, or server-side rendering)
- AI-generated scene images or character sprites
- Background music and per-scene voice options
