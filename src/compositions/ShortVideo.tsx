import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import data from '../data/today.json';

const palettes = [
  ['#071a2b', '#123b52', '#1d6070'],
  ['#17142f', '#3b286b', '#7b3f75'],
  ['#10251e', '#1c5945', '#3d8062'],
  ['#2a1722', '#6d2e46', '#b45a50'],
  ['#111827', '#243b63', '#3974a5'],
  ['#251b12', '#654321', '#b77935'],
];

const Scene: React.FC<{text: string; index: number; total: number; title: string}> = ({text, index, total, title}) => {
  const frame = useCurrentFrame();
  const {fps} = useVideoConfig();
  const palette = palettes[index % palettes.length];
  const enter = spring({frame, fps, config: {damping: 18, stiffness: 85}});
  const drift = Math.sin(frame / 34) * 22;
  const progress = interpolate(frame, [0, 30 * Math.max(5, Math.floor(30 / total))], [0, 1], {extrapolateRight: 'clamp'});
  const words = text.trim().split(/\s+/).length;
  const fontSize = words > 15 ? 58 : words > 11 ? 66 : 74;

  return (
    <AbsoluteFill style={{background: `linear-gradient(145deg, ${palette[0]}, ${palette[1]} 58%, ${palette[2]})`, color: 'white', fontFamily: 'Arial, sans-serif', overflow: 'hidden'}}>
      <div style={{position: 'absolute', width: 820, height: 820, borderRadius: '50%', right: -360 + drift, top: -250, background: 'rgba(255,255,255,0.07)', transform: `scale(${0.92 + enter * 0.12})`}} />
      <div style={{position: 'absolute', width: 560, height: 560, borderRadius: '50%', left: -300 - drift, bottom: 80, border: '2px solid rgba(255,255,255,0.12)'}} />
      <div style={{position: 'absolute', top: 104, left: 76, right: 76, display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
        <div style={{fontSize: 27, letterSpacing: 5, fontWeight: 900, color: '#a8e6ff'}}>ROVA • SHORTS</div>
        <div style={{fontSize: 24, color: 'rgba(255,255,255,0.75)', fontWeight: 700}}>{String(index + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}</div>
      </div>
      <div style={{position: 'absolute', top: 210, left: 84, right: 84, fontSize: 27, lineHeight: 1.3, color: 'rgba(255,255,255,0.72)', fontWeight: 700, textAlign: 'center'}}>{title}</div>
      <div style={{position: 'absolute', top: '38%', left: 78, right: 78, transform: `translateY(${interpolate(enter, [0, 1], [55, 0])}px)`, opacity: enter, fontSize, lineHeight: 1.24, fontWeight: 900, textAlign: 'center', textShadow: '0 5px 28px rgba(0,0,0,0.3)'}}>{text}</div>
      <div style={{position: 'absolute', bottom: 250, left: 70, right: 70, padding: '28px 34px', borderRadius: 28, background: 'rgba(3,10,22,0.62)', border: '1px solid rgba(255,255,255,0.18)', boxShadow: '0 18px 60px rgba(0,0,0,0.22)'}}>
        <div style={{fontSize: 18, color: '#a8e6ff', letterSpacing: 4, fontWeight: 900, marginBottom: 13}}>INTI PEMBAHASAN</div>
        <div style={{fontSize: 37, lineHeight: 1.25, fontWeight: 800, textAlign: 'center'}}>{text}</div>
      </div>
      <div style={{position: 'absolute', bottom: 140, left: 76, right: 76, height: 8, background: 'rgba(255,255,255,0.2)', borderRadius: 8}}>
        <div style={{height: '100%', width: `${progress * 100}%`, background: '#a8e6ff', borderRadius: 8}} />
      </div>
      <div style={{position: 'absolute', bottom: 78, left: 76, right: 76, display: 'flex', justifyContent: 'space-between', fontSize: 20, color: 'rgba(255,255,255,0.72)', fontWeight: 700}}>
        <span>FAKTA • IDE • PENGETAHUAN</span><span>IKUTI UNTUK VIDEO LAINNYA</span>
      </div>
    </AbsoluteFill>
  );
};

export const ShortVideo: React.FC = () => {
  const {fps} = useVideoConfig();
  const scenes = data.scenes.slice(0, 6);
  const seconds = Math.max(5, Math.floor(30 / scenes.length));
  return (
    <AbsoluteFill style={{background: '#071a2b'}}>
      {scenes.map((scene, i) => (
        <Sequence key={i} from={i * seconds * fps} durationInFrames={seconds * fps}>
          <Scene text={scene.text} index={i} total={scenes.length} title={data.title} />
        </Sequence>
      ))}
      <Audio src={staticFile('voiceover.mp3')} volume={1} />
    </AbsoluteFill>
  );
};
