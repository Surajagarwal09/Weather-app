import React from 'react';
import './Background.css'; 
import Weather from './Weather';

const VideoBackground = () => {
  return (
    <div className="background">
      <video autoPlay loop muted id="video" src="/assets/weather.mp4" />
      <div className="content">
        <Weather/>
      </div>
    </div>
  );
};

export default VideoBackground;
