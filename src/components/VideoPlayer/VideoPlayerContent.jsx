import React, { Component, PropTypes } from 'react';
import { VideoPlayer, FormGroup, Input } from 'components';
import { injectProps } from 'relpers';

export default class VideoPlayerContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
    className: PropTypes.string,
    uri: PropTypes.string,
    playing: PropTypes.bool,
    loop: PropTypes.bool,
    controls: PropTypes.bool,
    volume: PropTypes.number,
    muted: PropTypes.bool,
    playbackRate: PropTypes.number,
    fullscreen: PropTypes.bool,
    width: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
    height: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.number
    ]),
  }

  @injectProps
  render({
    admin,
    handleChange,
    handleChangeParams,
    ...componentProps,
  } = {}) {
    const {
      className = '',
      preview = false,
      uri,
      playing,
      loop,
      controls,
      volume,
      muted,
      playbackRate,
      fullscreen,
      width,
      height,
      ...otherComponentProps
    } = componentProps;
    const styles = require('./VideoPlayerContent.scss');

    return preview ? <VideoPlayer {...componentProps} fullscreen={!admin && fullscreen} /> : (<div className={styles.AdminContent} >
      <p>Supports:{' '}
        <a href="https://www.youtube.com" >YouTube</a>,{' '}
        <a href="https://www.facebook.com" >Facebook</a>,{' '}
        <a href="https://www.soundcloud.com" >SoundCloud</a>,{' '}
        <a href="https://www.streamable.com" >Streamable</a>,{' '}
        <a href="https://vid.me" >Vidme</a>,{' '}
        <a href="https://www.vimeo.com" >Vimeo</a>,{' '}
        <a href="https://www.wistia.com" >Wistia</a>,{' '}
        <a href="https://www.twitch.tv" >Twitch</a>,{' '}
        <a href="https://www.dailymotion.com" >DailyMotion</a>
      </p>
      <FormGroup childTypes={['full']}>
        <Input label="Video URI" type="text" value={uri} placeholder="video url starting with https://" handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/uri' }} />
        <Input inline labelAfter="Autoplay" type="checkbox" value={playing} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/playing' }} />
        <Input inline labelAfter="Loop" type="checkbox" value={loop} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/loop' }} />
        <Input inline labelAfter="Show Controls" type="checkbox" value={controls} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/controls' }} />
        <Input inline label="Volume" type="number" step={0.1} max={1} min={0} value={parseFloat(volume)} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/volume' }} />
        <Input inline labelAfter="Mute" type="checkbox" value={muted} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/muted' }} />
        <Input inline label="Playback rate" type="number" step={0.1} min={0.1} value={parseFloat(playbackRate)} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/playbackRate' }} />
        <Input inline labelAfter="Fullscreen" type="checkbox" value={fullscreen} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/fullscreen' }} />
      </FormGroup>
      <div>
        Preview: <VideoPlayer {...componentProps} fullscreen={!admin && fullscreen} />
      </div>
    </div>);
  }
}
