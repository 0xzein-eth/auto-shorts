# Auto Shorts

Automated Indonesian YouTube Shorts factory: generate a script with OpenAI, synthesize Indonesian narration with Edge TTS, render a vertical MP4 with Remotion, and optionally publish it to YouTube.

## Pipeline
1. Select a topic while avoiding the most recently used topics.
2. Generate and validate a 4–6 scene Indonesian script.
3. Generate Indonesian narration.
4. Render a 1080×1920 video with animated backgrounds, timed scene cards, subtitles, and a progress indicator.
5. Optionally upload to YouTube as **unlisted**.

The renderer currently uses original motion-graphic layouts, not third-party footage. This avoids unlicensed clips and keeps the pipeline reproducible.

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
- `YT_CLIENT_ID`, `YT_CLIENT_SECRET`, `YT_REFRESH_TOKEN` (optional; all three enable YouTube upload)

Run **Actions → Daily Auto Video → Run workflow** to test. The schedule is 09:00 WIB daily (02:00 UTC). Without YouTube secrets, the workflow still renders and stores the MP4 artifact for 7 days.

GitHub Actions cache preserves `src/data/topic-history.json` between runs, so recent topics are less likely to repeat without requiring write access to the repository.

OpenAI API usage is billed separately. Review outputs before enabling public publishing. Respect copyright and only use media you have rights to use.
