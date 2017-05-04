import React, { Component, PropTypes } from 'react';
// import { Button } from 'components';
import { intersperse } from '../../utils/utils';

export default class SheetBlock extends Component {

  static propTypes = {
    sheet: PropTypes.object,
    children: PropTypes.any,
  };

  render() {
    const { sheet, children } = this.props;
    const { name, key, refresh, aspects, consequences, stress, stunts, extras } = sheet.toObject();
    console.log('sheet', sheet);
    console.log('name', name, 'key', key, 'refresh', refresh, 'aspects', aspects, 'consequences', consequences, 'stress', stress, 'stunts', stunts, 'extras', extras);
    const styles = require('./SheetBlock.scss');

    const headingRefresh = <span className={styles['SheetBlock-heading-refresh']}>{refresh}</span>;
    const {
      main: mainAspect,
      trouble: troubleAspect,
      ...otherAspects
    } = aspects.toObject();
    const aspectClassNameMap = { 0: 'Aspect-main', 1: 'Aspect-trouble' };
    const aspectElements = intersperse([ mainAspect, troubleAspect, ...otherAspects ].reduce( (output, aspect, index)=>{
      const classNames = [
        styles.Aspect,
        styles[aspectClassNameMap[index] || 'Aspect-other']
      ].join(' ');
      return aspect ? output.concat([<span className={classNames} key={'aspect-' + index} >{aspect}</span>]) : aspectElements;
    }, [] ), ', ');

    console.log('aspects', aspects.toObject(), [ mainAspect, troubleAspect, ...otherAspects ]);
    console.log('aspectElements', aspectElements);

    const aspectBlock = aspectElements ? <p className={styles['SheetBlock-aspects']}>{aspectElements}</p> : null;
    const consequencesBlock = consequences ? null : null;
    const stressBlock = stress ? null : null;
    const stuntsBlock = stunts && stunts.size ? (<div><h3>Stunts</h3>{stunts.map( (stunt)=>(
        <p className={styles['SheetBlock-stunt']}>{stunt}</p>
      ) )}</div>) : null;
    const extrasBlock = extras ? null : null;

    return (
      <div className={styles.SheetBlock + ' container'} key={key} >
        <h2 className={styles['SheetBlock-name']} ><span>{name}</span>{headingRefresh}</h2>
        {aspectBlock}
        {consequencesBlock}
        {stressBlock}
        {stuntsBlock}
        {extrasBlock}
        {children}
      </div>
    );
  }
}
