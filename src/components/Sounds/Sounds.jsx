import React, { Component, PropTypes } from 'react';
import { FormGroup, Alert, Button } from 'components';
import { OrderedMap, Map } from 'immutable';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

export default class Sounds extends Component {

  static propTypes = {
    sounds: PropTypes.object,
    compact: PropTypes.bool,
    admin: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.audioElements = {};
    this.scheduledAutoPlay = Map({});
  }


  componentWillMount() {
    this.scheduleAutoPlay(this.props);
  }

  componentDidMount() {
    this.autoPlaySounds();
  }


  componentWillReceiveProps(nextProps) {
    this.scheduleAutoPlay(nextProps);
  }

  componentDidUpdate() {
    this.autoPlaySounds();
  }

  @autobind
  scheduleAutoPlay(nextProps) {
    const nextSounds = (nextProps.sounds || new Map());
    let newScheduledAutoPlay = this.scheduledAutoPlay.filter( (shouldAutoPlay, soundId) => (
      nextSounds.get(soundId)
    ) );
    nextSounds.map( (sound, soundId) => {
      if (sound.get('autoPlay')) {
        newScheduledAutoPlay = newScheduledAutoPlay.set(soundId, this.scheduledAutoPlay.get(soundId) === undefined ? true : this.scheduledAutoPlay.get(soundId) );
      }
    } );
    this.scheduledAutoPlay = newScheduledAutoPlay;
  }

  @autobind
  autoPlaySounds() {
    if (!this.props.admin) {
      this.scheduledAutoPlay.map( (shouldAutoPlay, soundId) => {
        if (shouldAutoPlay) {
          this.audioElements[soundId].play();
        }
      });
      this.scheduledAutoPlay = this.scheduledAutoPlay.map( () => (false) );
    }
  }

  @autobind
  playAudio(id) {
    this.audioElements[id].play();
  }

  @injectProps
  render({ compact, sounds = new OrderedMap() }) {
    const styles = require('./Sounds.scss');
    return (<div className={[styles.Sounds, styles.Sounds__compact].join(' ')} >{ sounds.size ?
      (<div className={styles.Sounds_list} >
        { sounds.map( (sound) => {
          return compact ?
            <Button key={sound.get('id')} className={styles.Sound} primary onClick={ this.playAudio } onClickParams={ sound.get('id') } >
              { sounds.get('label') || '▶' }
              <audio ref={ (audio) => (this.audioElements[sound.get('id')] = audio) } preload="none" src={sound.getIn(['previews', 'preview-hq-mp3'])} ></audio>
            </Button>
            :
            (<FormGroup className={styles.Sound} key={sound.get('id')} childTypes={[null, 'flexible']} >
              <span>{sound.get('name')}</span>
              <audio controls key={sound.get('id')} ref={ (audio) => (this.audioElements[sound.get('id')] = audio) } preload="none" src={sound.getIn(['previews', 'preview-hq-mp3'])} ></audio>
            </FormGroup>)
          ;
        }) }
      </div>)
      : <Alert className={styles.Sounds_empty} warning >No sounds to display</Alert>
    }
    </div>);
  }
}
