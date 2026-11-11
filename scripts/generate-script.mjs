import fs from 'node:fs/promises';
import OpenAI from 'openai';
if(!process.env.OPENAI_API_KEY) throw new Error('Missing OPENAI_API_KEY GitHub Actions secret.');
const topics=JSON.parse(await fs.readFile('src/data/topics.json','utf8'));
if(!Array.isArray(topics)||!topics.length) throw new Error('topics.json must contain at least one topic.');
const topic=topics[Math.floor(Math.random()*topics.length)];
const client=new OpenAI({apiKey:process.env.OPENAI_API_KEY});
const result=await client.chat.completions.create({model:'gpt-4o-mini',temperature:0.8,response_format:{type:'json_object'},messages:[
 {role:'system',content:'Kamu penulis naskah YouTube Shorts berbahasa Indonesia. Informatif, akurat, menarik, dan jangan mengarang fakta.'},
 {role:'user',content:`Buat naskah video sekitar 30 detik tentang: ${topic}. Balas JSON: {"title":"maksimal 70 karakter","description":"deskripsi singkat dan hashtag","scenes":[{"text":"kalimat narasi"}]}. Buat 4-6 scene, masing-masing 8-18 kata. Ada pembuka, isi, dan penutup. Tanpa markdown.`}
]});
const raw=result.choices[0]?.message?.content;
if(!raw) throw new Error('OpenAI returned an empty response.');
const data=JSON.parse(raw);
if(typeof data.title!=='string'||!Array.isArray(data.scenes)||data.scenes.length<3) throw new Error('Generated script has invalid structure.');
data.scenes=data.scenes.slice(0,6).map(s=>({text:String(s.text??'').trim()}));
if(data.scenes.some(s=>!s.text)) throw new Error('Generated scene is empty.');
await fs.writeFile('src/data/today.json',JSON.stringify(data,null,2)+'\n');
console.log('Generated:',data.title,'| Topic:',topic);
