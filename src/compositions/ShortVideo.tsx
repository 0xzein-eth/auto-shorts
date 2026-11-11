import React from 'react';
import {AbsoluteFill, Audio, Sequence, staticFile, useCurrentFrame, useVideoConfig, interpolate, spring} from 'remotion';
import data from '../data/today.json';
const colors=['#101827','#17324d','#284b63','#1b4965','#0b132b'];
const Scene: React.FC<{text:string;index:number}> = ({text,index}) => {
 const frame=useCurrentFrame(); const {fps}=useVideoConfig();
 const enter=spring({frame,fps,config:{damping:18,stiffness:90}});
 const y=interpolate(enter,[0,1],[65,0]);
 return <AbsoluteFill style={{justifyContent:'center',alignItems:'center',padding:100,background:colors[index%colors.length],color:'white'}}>
  <div style={{position:'absolute',top:110,left:90,right:90,fontSize:30,letterSpacing:8,color:'#8dd3ff',fontWeight:800}}>FAKTA SINGKAT</div>
  <div style={{fontSize:76,lineHeight:1.18,fontWeight:800,textAlign:'center',transform:`translateY(${y}px)`,textShadow:'0 8px 24px #0008'}}>{text}</div>
  <div style={{position:'absolute',bottom:130,fontSize:27,color:'#c5e7f7'}}>SEKILAS • PENGETAHUAN</div>
 </AbsoluteFill>;
};
export const ShortVideo: React.FC = () => {
 const {fps}=useVideoConfig(); const scenes=data.scenes.slice(0,6);
 const seconds=Math.max(5,Math.floor(30/scenes.length));
 return <AbsoluteFill style={{background:'#101827',fontFamily:'Arial, sans-serif'}}>
  {scenes.map((scene,i)=><Sequence key={i} from={i*seconds*fps} durationInFrames={seconds*fps}><Scene text={scene.text} index={i}/></Sequence>)}
  <Audio src={staticFile('voiceover.mp3')} volume={1}/>
 </AbsoluteFill>;
};
