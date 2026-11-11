import fs from 'node:fs/promises';
import {spawnSync} from 'node:child_process';
const data=JSON.parse(await fs.readFile('src/data/today.json','utf8'));
const narration=data.scenes.map(s=>s.text).join(' ');
await fs.mkdir('public',{recursive:true});
const result=spawnSync('python3',['-m','edge_tts','--voice','id-ID-ArdiNeural','--text',narration,'--write-media','public/voiceover.mp3'],{stdio:'inherit'});
if(result.error) throw result.error;
if(result.status!==0) throw new Error('Edge TTS failed. Check Python and edge-tts installation.');
console.log('Voiceover generated.');
