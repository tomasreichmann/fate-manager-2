import React, { Component, PropTypes } from 'react';
import { Input, FormGroup, Alert, Button, Togglable } from 'components';
import { Map } from 'immutable';
import { intersperse } from '../../utils/utils';
import classnames from 'classnames';
import marked from 'marked';
import autobind from 'autobind-decorator';

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
    this.state = {
      showFullDescription: false,
      showFullImage: false,
    };
  }

  getAspectTypeName(type) {
    console.log('getAspectTypeName', type);
    const templateAspectTypes = this.props.template.getIn(['aspects', 'types']);
    const templateAspect = templateAspectTypes && templateAspectTypes.size
      ? templateAspectTypes.find((aspect) => ( aspect.get('value') === type ))
      : undefined
    ;
    console.log('getAspectTypeName templateAspectTypes', templateAspectTypes.toJS());
    console.log('getAspectTypeName templateAspect', templateAspect && templateAspect.toJS());
    return templateAspect ? templateAspect.get('label') : undefined;
  }

  handleChange(value, {key, path}) {
    console.log('handleChange', value, path);
    const sessionPath = key + '/' + path;
    this.props.updateDb('/sheets/' + sessionPath, value);
  }

  @autobind
  toggleDescription() {
    this.setState({
      showFullDescription: !this.state.showFullDescription
    });
  }

  @autobind
  toggleImage() {
    this.setState({
      showFullImage: !this.state.showFullImage
    });
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

    const headingRefresh = <span className={styles.SheetBlock_heading_refresh}>{refresh}</span>;

    // description ---
    const descriptionBlock = description ? (<Togglable
      className={styles.SheetBlock_description}
      label="toggle full description"
      collapsedContent={<div
        className={styles.SheetBlock_description__hidden}
        dangerouslySetInnerHTML={{__html: marked(description)}}
      />}
    >
      <div
        dangerouslySetInnerHTML={{__html: marked(description)}}
      />
    </Togglable>) : null;

    // image ---
    const imageBlock = image ? (<div className={styles.SheetBlock_imageBlock}>
      <div className={classnames(styles.SheetBlock_imageWrapper, {[styles.SheetBlock_imageWrapper__clipped]: !this.state.showFullImage})} >
        <img
          src={image}
          className={styles.SheetBlock_image}
        />
      </div>
      <Button link inline active={this.state.showImage} onClick={this.toggleImage} >toggle full image</Button>
      <hr />
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
        const aspectLabel = this.getAspectTypeName(aspect.get('type'));
        return <span className={classNames} key={'aspect-' + aspectKey} ><strong>{aspect.get('title')}</strong>{aspectLabel ? ' (' + aspectLabel + ')' : null}</span>;
      }),
      ', ') : null
    ;
    const aspectBlock = aspectElements ? (<div className={styles.SheetBlock_aspectsBlock} >
      <h3>Aspects</h3>
      <p className={styles.SheetBlock_aspects}>{aspectElements}</p>
    </div>) : null;

    // skills ---
    const skillsElements = intersperse(skills.sort().reverse().reduce( ( elements, level, skillSlug ) => (
      level > 0 ? elements.concat([<span className={styles.SheetBlock_skill} >{template.getIn(['skills', skillSlug, 'name'])} {level}</span>]) : elements
    ), [] ), ', ');
    const skillBlock = skillsElements ? <p className={styles.SheetBlock_skills}>{skillsElements}</p> : null;

    // stunts ---
    const stuntsBlock = stunts && stunts.size ? (<div><h3>Stunts</h3>{stunts.map( (stunt, index)=>(
        <p key={index} className={styles.SheetBlock_stunt}>{stunt}</p>
      ) )}</div>) : null;

    // extras ---
    const extrasBlock = extras && extras.size ? (<div><h3>Extras</h3><p>{extras.join(', ')}</p></div>) : null;

    // stress ---
    const stressBlock = stress ? (<div className={styles.SheetBlock_stressBlock} >
      <h2>Stress</h2>
      <FormGroup childTypes={['flexible', 'flexible']} >
        { template.get('stress').map( (stressLane, stressLaneIndex)=>(
          <div>
            <p>{stressLane.get('label')}</p>
            <div className={styles.SheetBlock_stressBlock_boxes}>
              { (stress.get(stressLaneIndex.toString()) || []).map( (isUsed, boxIndex)=>(
                <span key={'stressBox-' + boxIndex} className={styles.SheetBlock_stressBox}><Input type="checkbox" value={isUsed} inline superscriptAfter={boxIndex + 1} handleChange={this.handleChange} handleChangeParams={{key, path: 'stress/' + stressLaneIndex + '/' + boxIndex}} /></span>
              ) ) }
            </div>
          </div>
        ) ) }
      </FormGroup>
    </div>) : null;

    // consequences ---

    const consequencesBlock = consequences ? (<div className={styles.SheetBlock_consequencesBlock} >
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
      <h2 className={styles.SheetBlock_name} ><span>{name}</span>{headingRefresh}</h2>
      <div className={styles.SheetBlock_imageDescriptionWrapper} >
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
    </div>) : <Alert className={styles.SheetBlock_notFound} warning >No sheet to display</Alert>;
  }
}
