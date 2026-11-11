import fs from 'node:fs';
import {google} from 'googleapis';
const required=['YT_CLIENT_ID','YT_CLIENT_SECRET','YT_REFRESH_TOKEN'];
const missing=required.filter(k=>!process.env[k]);
if(missing.length){console.log('Upload skipped; missing secrets:',missing.join(', '));process.exit(0);}
if(!fs.existsSync('out/video.mp4')) throw new Error('out/video.mp4 not found.');
const auth=new google.auth.OAuth2(process.env.YT_CLIENT_ID,process.env.YT_CLIENT_SECRET);
auth.setCredentials({refresh_token:process.env.YT_REFRESH_TOKEN});
const youtube=google.youtube({version:'v3',auth});
const video=JSON.parse(fs.readFileSync('src/data/today.json','utf8'));
const response=await youtube.videos.insert({part:['snippet','status'],requestBody:{snippet:{title:video.title.slice(0,100),description:video.description||'Video dibuat otomatis.',categoryId:'27',defaultLanguage:'id',defaultAudioLanguage:'id'},status:{privacyStatus:'unlisted',selfDeclaredMadeForKids:false}},media:{body:fs.createReadStream('out/video.mp4')}});
console.log('Uploaded to YouTube:',response.data.id);
