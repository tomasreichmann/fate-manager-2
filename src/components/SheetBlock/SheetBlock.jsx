import React, { Component, PropTypes } from 'react';
import { Input } from 'components';
import { intersperse } from '../../utils/utils';

export default class SheetBlock extends Component {

  static propTypes = {
    sheet: PropTypes.object,
    updateSheet: PropTypes.func.isRequired,
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
    this.props.updateSheet(sessionPath, value);
  }

  render() {
    const { sheet, template, children } = this.props;
    const { name, key, refresh, description, aspects, skills, consequences, stress, stunts, extras } = sheet.toObject();
    console.log('sheet', sheet);
    console.log('name', name, 'key', key, 'refresh', refresh, 'aspects', aspects, 'skills', skills, 'consequences', consequences, 'stress', stress, 'stunts', stunts, 'extras', extras);
    const styles = require('./SheetBlock.scss');

    const headingRefresh = <span className={styles['SheetBlock-heading-refresh']}>{refresh}</span>;

    // description ---
    const descriptionBlock = description ? (<div className={styles['SheetBlock-extras']}>
      <p>{description}</p>
    </div>) : null;

    // aspects ---
    const {
      main: mainAspect,
      trouble: troubleAspect,
      ...otherAspects
    } = aspects ? aspects.toObject() : {};
    const aspectClassNameMap = { 0: 'Aspect-main', 1: 'Aspect-trouble' };
    const aspectElements = intersperse(
      [ mainAspect, troubleAspect, ...otherAspects ]
        .reduce( (output, aspect, index)=>{
          const classNames = [
            styles.Aspect,
            styles[aspectClassNameMap[index] || 'Aspect-other']
          ].join(' ');
          return aspect ? output.concat([<span className={classNames} key={'aspect-' + index} >{aspect}</span>]) : output;
        }, [] ),
      ', ')
    ;
    const aspectBlock = aspectElements.length ? <p className={styles['SheetBlock-aspects']}>{aspectElements}</p> : null;


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
    const stressBlock = stress ? <div>
      <h3>Stress</h3>
      { template.get('stress').map( (stressLane, stressLaneIndex)=>(
        console.log('stressLaneIndex', stressLaneIndex), <div className={styles['SheetBlock-stressLane']} key={stressLaneIndex} >
          <strong>{stressLane.get('label')}: </strong>
          { (sheet.getIn(['stress', stressLaneIndex.toString()]) || []).map( (isUsed, boxIndex)=>(
            <Input type="checkbox" className={styles['SheetBlock-stressBox']} value={isUsed} inline superscriptAfter={boxIndex + 1} handleChange={this.handleChange} handleChangeParams={{key, path: 'stress/' + stressLaneIndex + '/' + boxIndex}} />
          ) ) }
        </div>
      ) ) }
    </div> : null;

    // consequences ---
    const consequenceElements = (consequences && consequences.size) ? intersperse([ 'minor', 'moderate', 'severe' ].reduce( (elements, level ) => (
      consequences.get(level) ? elements.concat([<span className={styles['SheetBlock-consequence']} >{ consequences.get(level) + ' (' + level + ')' }</span>]) : elements
    ), [] ), ', ') : null;

    const consequencesBlock = consequenceElements && consequenceElements.length ? (<div className={styles['SheetBlock-consequences']} ><strong>Consequences: </strong>{consequenceElements}</div>) : null;

    return (
      <div className={styles.SheetBlock} key={key} >
        <h2 className={styles['SheetBlock-name']} ><span>{name}</span>{headingRefresh}</h2>
        {descriptionBlock}
        {aspectBlock}
        {skillBlock}
        {stuntsBlock}
        {extrasBlock}
        {stressBlock}
        {consequencesBlock}

        {children}
      </div>
    );
  }
}
