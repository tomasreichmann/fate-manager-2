import React from 'react';
// import { Link } from 'react-router';
import ReactPlayer from 'react-player';
// import { get } from 'lodash';
import cls from 'classnames';
import { Alert } from 'components';


const VideoPlayer = ({
  className = '',
  uri, //	The url of a video or song to play
  playing = false, //	Set to true or false to pause or play the media	false
  loop = false, //	Set to true or false to loop the media	false
  controls = true, //	Set to true or false to display native player controls. Vimeo, Twitch and Wistia player controls are not configurable and will always display	false
  volume = 0.8, //	Sets the volume of the appropriate player	0.8
  muted = false, //	Mutes the player	false
  playbackRate = 1, //	Sets the playback rate of the appropriate player. Only supported by YouTube, Wistia, and file paths	1
  width = '100%', //	Sets the width of the player	640
  height = undefined, //	Sets the height of the player	360
  playsinline = false, //	Applies the playsinline attribute where supported	false
  fullscreen = false, //	Override options for the various players, see config prop
  config = undefined, //	Override options for the various players, see config prop
  ...props
}) => {
  const style = require('./VideoPlayer.scss');
  const processedClassName = cls(style.VideoPlayer, className);

  const uriRegex = /https?:\/\/(www\.)?([-a-zA-Z0-9@:%._\+~#=]{2,256})\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/;
  if (!uriRegex.exec(uri)) {
    return <div className={processedClassName} ><Alert warning>Invalid URI: {uri}</Alert></div>;
  }

  const wrapperStyle = {};

  if (fullscreen) {
    wrapperStyle.position = 'fixed';
    wrapperStyle.top = 0;
    wrapperStyle.right = 0;
    wrapperStyle.bottom = 0;
    wrapperStyle.left = 0;
    wrapperStyle.backgroundColor = '#000000';
  }

  return (<div className={processedClassName} style={wrapperStyle}>
    <ReactPlayer
      url={uri}
      playing={playing}
      loop={loop}
      controls={controls}
      volume={volume ? parseFloat(volume) : undefined}
      muted={muted}
      playbackRate={playbackRate ? parseFloat(playbackRate) : undefined}
      width={width}
      height={fullscreen ? '100%' : height}
      playsinline={playsinline}
      config={config}
      {...props}
    />
  </div>);
};

export default VideoPlayer;
