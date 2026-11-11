# Auto Shorts

Automated Indonesian YouTube Shorts factory: generate a short script with OpenAI, synthesize Indonesian narration with Edge TTS, render a vertical MP4 with Remotion, and optionally publish it to YouTube.

## Pipeline
1. Pick a topic from `src/data/topics.json`.
2. Generate script metadata and scenes into `src/data/today.json`.
3. Generate narration at `public/voiceover.mp3`.
4. Render a 1080×1920 MP4 to `out/video.mp4`.
5. Optionally upload as **unlisted** to YouTube.

The initial renderer uses animated graphic backgrounds rather than third-party footage.

## Local setup
Requirements: Node.js 20+, Python 3.10+, FFmpeg.
```bash
npm install
python -m pip install edge-tts
export OPENAI_API_KEY="your-key"
npm run generate
npm run voice
npm run render
```

## GitHub Actions
Add repository Actions secrets:
- `OPENAI_API_KEY` (required)
- `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN` (optional; all three enable upload)

Run **Actions → Daily Auto Video → Run workflow** to test. The schedule is 09:00 WIB daily (02:00 UTC). Without YouTube secrets, the workflow still renders and stores the MP4 artifact for 7 days.

OpenAI API usage is billed separately. Review outputs before enabling public publishing. Respect copyright and only use media you have rights to use.