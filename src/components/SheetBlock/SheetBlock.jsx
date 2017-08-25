import React, { Component, PropTypes } from 'react';
import { Input, FormGroup, Alert } from 'components';
import { Map } from 'immutable';
import { intersperse } from '../../utils/utils';
import marked from 'marked';

export default class SheetBlock extends Component {

  static propTypes = {
    sheet: PropTypes.object,
    updateDb: PropTypes.func.isRequired,
    template: PropTypes.object,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(value, {key, path}) {
    console.log('handleChange', value, path);
    const sessionPath = key + '/' + path;
    this.props.updateDb('/sheets/' + sessionPath, value);
  }

  render() {
    const { sheet = Map(), template = Map(), children } = this.props;
    const { name, key, refresh, description, aspects, skills = Map(), consequences, stress, stunts, extras, image } = sheet.toObject();
    console.log('sheet', sheet.toJS());
    console.log('template', template);
    console.log('template', template.toJS());
    console.log('name', name, 'key', key, 'refresh', refresh, 'aspects', aspects, 'skills', skills, 'consequences', consequences, 'stress', stress, 'stunts', stunts, 'extras', extras);
    const styles = require('./SheetBlock.scss');

    const hasData = this.props.sheet && this.props.template;

    const headingRefresh = <span className={styles['SheetBlock-heading-refresh']}>{refresh}</span>;

    // description ---
    const descriptionBlock = description ? (<div className={styles['SheetBlock-description']} dangerouslySetInnerHTML={{__html: marked(description)}} ></div>) : null;

    // image ---
    const imageBlock = image ? (<div className={styles['SheetBlock-imageBlock']}>
      <img src={image} className={ styles['SheetBlock-image'] } />
    </div>) : null;

    // aspects ---
    const {
      main: mainAspect,
      trouble: troubleAspect,
      ...otherAspects
    } = aspects ? aspects.toObject() : {};

    const aspectElements = aspects ? intersperse(
      aspects.toArray().map( (aspect, aspectKey)=>{
        const classNames = [
          styles.Aspect,
          styles[aspect.get('type') || 'Aspect-other']
        ].join(' ');
        return <span className={classNames} key={'aspect-' + aspectKey} >{aspect.get('title')}</span>;
      }),
      ', ') : null
    ;
    const aspectBlock = aspectElements ? <p className={styles['SheetBlock-aspects']}>{aspectElements}</p> : null;


    // skills ---
    const skillsElements = intersperse(skills.sort().reverse().reduce( ( elements, level, skillSlug ) => (
      level > 0 ? elements.concat([<span className={styles['SheetBlock-skill']} >{template.getIn(['skills', skillSlug, 'name'])} {level}</span>]) : elements
    ), [] ), ', ');
    const skillBlock = skillsElements ? <p className={styles['SheetBlock-skills']}>{skillsElements}</p> : null;

    // stunts ---
    const stuntsBlock = stunts && stunts.size ? (<div><h3>Stunts</h3>{stunts.map( (stunt, index)=>(
        <p key={index} className={styles['SheetBlock-stunt']}>{stunt}</p>
      ) )}</div>) : null;

    // extras ---
    const extrasBlock = extras && extras.size ? (<div><h3>Extras</h3>{extras.map( (extra, index)=>(
        <p key={index} className={styles['SheetBlock-extra']}>{extra}</p>
      ) )}</div>) : null;

    // stress ---
    const stressBlock = stress ? (<div className={styles['SheetBlock-stressBlock']} >
      <h2>Stress</h2>
      { template.get('stress').map( (stressLane, stressLaneIndex)=>(
        <FormGroup className={styles['SheetBlock-stressLane']} key={stressLaneIndex} childTypes={['full', 'flexible', null]}>
          <strong>{stressLane.get('label')}: </strong>
          <div className={styles['SheetBlock-stressBlock-boxes']}>
            { (stress.get(stressLaneIndex.toString()) || []).map( (isUsed, boxIndex)=>(
              <span key={'stressBox-' + boxIndex} className={styles['SheetBlock-stressBox']}><Input type="checkbox" value={isUsed} inline superscriptAfter={boxIndex + 1} handleChange={this.handleChange} handleChangeParams={{key, path: 'stress/' + stressLaneIndex + '/' + boxIndex}} /></span>
            ) ) }
          </div>
        </FormGroup>
      ) ) }
    </div>) : null;

    // consequences ---

    const consequencesBlock = consequences ? (<div className={styles['SheetBlock-consequencesBlock']} >
      <h2>Consequences</h2>
      { consequences.toMap().mapEntries( (consequenceEntry, consequenceIndex)=>{
        const consequenceKey = consequenceEntry[0];
        const consequence = consequenceEntry[1];
        return [consequenceKey, (<FormGroup key={'consequence-' + consequenceKey} childTypes={['flexible', null]}>
          <Input
            label={template.getIn(['consequences', consequenceIndex, 'label']) || template.get('consequences').last().get('label') }
            value={consequence}
            handleChange={this.handleChange}
            handleChangeParams={{key, path: 'consequences/' + consequenceKey}}
            superscriptAfter={template.getIn(['consequences', consequenceIndex, 'value']) || template.get('consequences').last().get('value')}
          />
        </FormGroup>)];
      } )}
    </div>) : null;

    return hasData ? (<div className={styles.SheetBlock} key={key} >
      <h2 className={styles['SheetBlock-name']} ><span>{name}</span>{headingRefresh}</h2>
      <div className={styles['SheetBlock-image-description-wrapper']} >
        {imageBlock}
        {descriptionBlock}
      </div>
      {aspectBlock}
      {skillBlock}
      {stuntsBlock}
      {extrasBlock}
      {stressBlock}
      {consequencesBlock}
      {children}
    </div>) : <Alert className={styles['SheetBlock-notFound']} warning >No sheet to display</Alert>;
  }
}
