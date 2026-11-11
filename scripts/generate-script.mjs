import fs from 'node:fs/promises';
import OpenAI from 'openai';

if (!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY GitHub Actions secret.');
const topics = JSON.parse(await fs.readFile('src/data/topics.json', 'utf8'));
if (!Array.isArray(topics) || topics.length < 4) throw new Error('topics.json must contain at least four topics.');

const historyPath = 'src/data/topic-history.json';
let history = [];
try {
  history = JSON.parse(await fs.readFile(historyPath, 'utf8'));
  if (!Array.isArray(history)) history = [];
} catch {}
const recent = new Set(history.slice(-Math.min(12, topics.length)).map(x => String(x).toLowerCase()));
let candidates = topics.filter(topic => !recent.has(String(topic).toLowerCase()));
if (!candidates.length) candidates = topics;
const topic = candidates[Math.floor(Math.random() * candidates.length)];

const client = new OpenAI({apiKey: process.env.OPENAI_API_KEY});
const result = await client.chat.completions.create({
  model: 'gpt-4o-mini',
  temperature: 0.75,
  response_format: {type: 'json_object'},
  messages: [
    {role: 'system', content: 'Kamu adalah penulis dan pemeriksa fakta untuk YouTube Shorts berbahasa Indonesia. Tulis bahasa Indonesia natural, ringkas, jelas, tidak clickbait menyesatkan, dan jangan mengarang angka, kutipan, atau sumber.'},
    {role: 'user', content: `Buat naskah video sekitar 30 detik tentang topik: "${topic}". Susun 4 sampai 6 scene berurutan. Tiap scene berisi 8-16 kata, cocok dibacakan dan mudah dipahami. Scene pertama harus menjadi hook yang relevan, bagian tengah menjelaskan inti, scene terakhir memberi kesimpulan atau ajakan ringan. Hindari klaim yang tidak dapat dipastikan. Balas JSON valid saja dengan struktur: {"title":"judul maksimal 70 karakter","description":"deskripsi 1-2 kalimat dan 3 hashtag relevan","scenes":[{"text":"narasi scene"}]}.`}
  ]
});
const raw = result.choices[0]?.message?.content;
if (!raw) throw new Error('OpenAI returned an empty response.');
const data = JSON.parse(raw);
if (typeof data.title !== 'string' || !data.title.trim() || data.title.length > 100) throw new Error('Generated title is missing or too long.');
if (typeof data.description !== 'string' || !Array.isArray(data.scenes) || data.scenes.length < 4 || data.scenes.length > 6) throw new Error('Generated script has invalid structure.');
data.scenes = data.scenes.map(scene => ({text: String(scene.text ?? '').replace(/\s+/g, ' ').trim()}));
if (data.scenes.some(scene => scene.text.split(/\\s+/).length < 5 || scene.text.split(/\\s+/).length > 22)) throw new Error('A scene is too short or too long; refusing to render low-quality script.');
data.topic = topic;
await fs.writeFile('src/data/today.json', JSON.stringify(data, null, 2) + '\n');
history.push(topic);
history = history.slice(-Math.max(20, topics.length * 2));
await fs.writeFile(historyPath, JSON.stringify(history, null, 2) + '\n');
console.log('Generated:', data.title, '| Topic:', topic, '| Scenes:', data.scenes.length);
