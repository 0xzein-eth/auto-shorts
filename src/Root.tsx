import React from 'react';
import {Composition} from 'remotion';
import {ShortVideo} from './compositions/ShortVideo';
import data from './data/today.json';
const sceneCount=Math.max(1,Math.min(6,data.scenes.length));
const secondsPerScene=Math.max(5,Math.floor(30/sceneCount));
export const RemotionRoot: React.FC = () => <Composition id="ShortVideo" component={ShortVideo} durationInFrames={sceneCount*secondsPerScene*30} fps={30} width={1080} height={1920}/>;
