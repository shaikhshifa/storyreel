# Storyreel – AI story video maker (prototype)

Files
- index.html               Storyreel: AI writes a story, canvas plays it as a narrated animated video
- clipforge-explainer.html Earlier prototype: script to animated explainer / social clip

Run
Open index.html in a browser (Chrome or Edge recommended for voice narration).
No build step, no dependencies. Fonts load from Google Fonts with system fallbacks.

Important: the AI story writing
index.html calls Claude through the claude.ai artifact runtime (window.claude, "sample").
That only exists when the page is opened from claude.ai. Opened from a zip, the
"Make my video" button shows a message and the built-in demo story keeps working.

To use AI outside claude.ai, replace the sample call in the #gen click handler with a
request to your own backend endpoint that calls the Anthropic API (keep your API key on
the server, never in the page). The endpoint should return the same JSON:
{ "title": string, "scenes": [ { narration, setting, time, colors, cast, camera } ] }

Next steps
- Video export (MediaRecorder on canvas + audio, or server-side rendering)
- AI-generated scene images or character sprites
- Background music and per-scene voice options
