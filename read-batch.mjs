import fs from 'node:fs/promises';
import path from 'node:path';
const subtitleDir=process.env.SUBTITLE_DIR;
if(!subtitleDir)throw Error('Set SUBTITLE_DIR to your own local subtitle JSON directory. Raw subtitles are not included.');
const base=new URL('.',import.meta.url);const catalog=JSON.parse(await fs.readFile(new URL('catalog.json',base),'utf8'));
const start=Number(process.argv[2]||1),end=Number(process.argv[3]||start);
for(let n=start;n<=end;n++){
 const bvid=catalog[n-1].url.match(/BV\w+/)[0];
 const d=JSON.parse(await fs.readFile(path.join(subtitleDir,`${bvid}.json`),'utf8'));
 console.log(`\n## ${n} ${bvid} ${d.title}\n${d.parts?.some(p=>p.available)?'':'简介：'+d.description}\n`);
 for(const p of d.parts||[]){console.log(`P${p.page} ${p.duration}s ${p.language||'无字幕'}`);let chunk='',t=0;for(const s of p.body||[]){if(s.from-t>=45&&chunk){console.log(`[${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}] ${chunk}`);chunk='';t=s.from;}chunk+=s.content+'，';}if(chunk)console.log(`[${Math.floor(t/60)}:${String(Math.floor(t%60)).padStart(2,'0')}] ${chunk}`);}
}
