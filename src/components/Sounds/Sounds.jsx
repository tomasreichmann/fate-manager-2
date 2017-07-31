import React, { Component, PropTypes } from 'react';
import { FormGroup, Alert, Button } from 'components';
import { OrderedMap } from 'immutable';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

export default class Sounds extends Component {

  static propTypes = {
    sounds: PropTypes.object,
    compact: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.audioElements = {};
  }

  @autobind
  playAudio(id) {
    this.audioElements[id].play();
  }

  @injectProps
  render({ compact, sounds = new OrderedMap() }) {
    const styles = require('./Sounds.scss');

    console.log('Sounds sounds', sounds);

    return (<div className={[styles.Sounds, styles.Sounds__compact].join(' ')} >{ sounds.size ?
      (<div className={styles.Sounds_list} >
        { sounds.map( (sound) => {
          return compact ?
            <Button className={styles.Sound} primary onClick={ this.playAudio } onClickParams={ sound.get('id') } >
              { sounds.get('label') || '▶' }
              <audio ref={ (audio) => (this.audioElements[sound.get('id')] = audio) } preload="none" src={sound.getIn(['previews', 'preview-hq-mp3'])} ></audio>
            </Button>
            :
            (<FormGroup className={styles.Sound} key={sound.get('id')} childTypes={[null, 'flexible']} >
              <span>{sound.get('name')}</span>
              <audio controls preload="none" src={sound.getIn(['previews', 'preview-hq-mp3'])} ></audio>
            </FormGroup>)
          ;
        }) }
      </div>)
      : <Alert className={styles.Sounds_empty} warning >No sounds to display</Alert>
    }
    </div>);
  }
}
