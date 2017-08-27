import React, { Component, PropTypes } from 'react';
import { List, OrderedMap, fromJS } from 'immutable';
import { Sounds, Input, FormGroup, Button, Alert } from 'components';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { searchSound } from 'freesoundHelper';
import { FaSearch, FaPlus, FaTrash } from 'react-icons/lib/fa';

export default class SoundsContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    admin: PropTypes.bool,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
    sounds: PropTypes.object,
  }

  constructor(props) {
    super(props);
    this.state = {
      results: [],
    };
  }

  @autobind
  search() {
    const query = this.searchInput.value;
    searchSound(query).then(
      ( resultsData )=>( console.log('SoundsContent search resolve', resultsData, fromJS(resultsData)),
      this.setState({
        ...this.state,
        ...resultsData,
      }) ),
      ( error )=>( this.setState({
        ...this.state,
        error: 'search results could not be retrieved: ' + error,
      }) )
    );
  }

  @autobind
  handleButtonClick({value, ...clickParams}) {
    this.props.handleChange(value ? value.toJS() : value, clickParams);
  }

  @injectProps
  render({
    preview = false,
    sounds,
    admin = false,
    handleChange,
    handleChangeParams,
    ...props,
  } = {}) {
    const { results } = this.state;
    const styles = require('./Sounds.scss');
    const soundsMap = fromJS(sounds) || new OrderedMap();
    console.log('SoundsContent sounds', soundsMap.toJS());

    return preview ?
      (<div className={ styles.SoundsContent } {...props} >
        <Sounds sounds={ soundsMap } admin={admin} />
      </div>)
      :
      (<div className={ styles.SoundsContent } {...props} >
        <FormGroup childTypes={['flexible']} >
          <Input type="text" inputRef={ (input) => ( this.searchInput = input ) } placeholder="Search" name="query" />
          <Button onClick={this.search} primary ><FaSearch /></Button>
        </FormGroup>
        <div className={ styles.SoundContent_results } >
        {
          results.length ?
          results.map( (sound) => (
            <FormGroup key={sound.id} className={styles.SoundsContent_Sound} childTypes={['flexible']} >
              <Sounds sounds={List([fromJS(sound)])} />
              <Button primary onClick={this.handleButtonClick} onClickParams={{...handleChangeParams, value: soundsMap.set(sound.id, fromJS(sound) ), path: 'componentProps/sounds' }} ><FaPlus /></Button>
            </FormGroup>
          ) )
          :
          <Alert warning >{'No sounds found'}</Alert>
        }
        </div>
        <hr />
        <div className={ styles.SoundContent_selected } >
        {
          (soundsMap && soundsMap.size) ?
          soundsMap.map( (sound) => (
            <FormGroup key={sound.id} className={styles.SoundsContent_Sound} childTypes={['flexible']} >
              <Sounds sounds={List([sound])} admin={admin} />
              <Input
                label="Autoplay"
                inline
                type="checkbox"
                value={sound.get('autoPlay')}
                handleChange={handleChange}
                handleChangeParams={{...handleChangeParams, path: 'componentProps/sounds/' + sound.get('id') + '/autoPlay' }}
              />
              <Button danger onClick={this.handleButtonClick} onClickParams={{...handleChangeParams, value: null, path: 'componentProps/sounds/' + sound.get('id') }} ><FaTrash /></Button>
            </FormGroup>
          ) )
          :
          <Alert warning >No sounds saved</Alert>
        }
        </div>
      </div>)
    ;
  }
}
