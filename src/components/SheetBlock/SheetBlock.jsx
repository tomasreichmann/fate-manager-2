import React, { Component, PropTypes } from 'react';
import { Input, FormGroup, Alert, Togglable } from 'components';
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

    const hasData = this.props.sheet && (this.props.sheet.size > 0) && this.props.template;

    const headingRefresh = <span className={styles.SheetBlock_heading_refresh}>{refresh}</span>;

    // description ---
    const descriptionBlock = description ? (<Togglable
      className={classnames(styles.SheetBlock_description, styles.SheetBlock_contentBlock)}
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
    const imageBlock = image ? (<Togglable
      className={classnames(styles.SheetBlock_imageBlock, styles.SheetBlock_contentBlock)}
      label="toggle full image"
      collapsedContent={
        <div
          key="imageWrapper"
          className={classnames(styles.SheetBlock_imageWrapper, styles.SheetBlock_imageWrapper__clipped)}
        ><img
          src={image}
          className={styles.SheetBlock_image}
        /></div>
      }
    >
      <div key="imageWrapper" className={styles.SheetBlock_imageWrapper}>
        <img
          src={image}
          className={styles.SheetBlock_image}
        />
      </div>
    </Togglable>) : null;

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
    const aspectBlock = aspectElements ? (<Togglable
        className={classnames(styles.SheetBlock_aspectBlock, styles.SheetBlock_contentBlock)}
        defaultCollapsed={false}
        position="top"
        label={<h3>Aspects</h3>}
      >
      <p className={styles.SheetBlock_aspects}>{aspectElements}</p>
    </Togglable>) : null;

    // skills ---
    const skillsElements = intersperse(skills.sort().reverse().reduce( ( elements, level, skillSlug ) => (
      level > 0 ? elements.concat([<span className={styles.SheetBlock_skill} >{template.getIn(['skills', skillSlug, 'name'])} {level}</span>]) : elements
    ), [] ), ', ');
    const skillBlock = skillsElements ? <Togglable
      className={classnames(styles.SheetBlock_skillsBlock, styles.SheetBlock_contentBlock)}
      defaultCollapsed={false}
      position="top"
      label={<h3>Skills</h3>}
    >
      <p className={styles.SheetBlock_skills}>{skillsElements}</p>
    </Togglable>
    : null;

    // stunts ---
    const stuntsBlock = stunts && stunts.size ? (<Togglable
      className={classnames(styles.SheetBlock_stuntsBlock, styles.SheetBlock_contentBlock)}
      defaultCollapsed={false}
      position="top"
      label={<h3>Stunts</h3>}
    >
      {stunts.map( (stunt, index)=>(
        <p key={index} className={styles.SheetBlock_stunt}>{stunt}</p>
      ) )}
    </Togglable>) : null;

    // extras ---
    const extrasBlock = extras && extras.size ? (
      <Togglable
      className={classnames(styles.SheetBlock_extrasBlock, styles.SheetBlock_contentBlock)}
      defaultCollapsed={false}
      position="top"
      label={<h3>Extras</h3>}
    >
      <p>{extras.join(', ')}</p>
    </Togglable>) : null;

    // stress ---
    const stressBlock = stress ? (<div className={classnames(styles.SheetBlock_stressBlock, styles.SheetBlock_contentBlock)} >
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

    const consequencesBlock = consequences ? (<div className={classnames(styles.SheetBlock_consequencesBlock, styles.SheetBlock_contentBlock)} >
      <h2>Consequences</h2>
      <div className={styles.SheetBlock_consequenceList} >
        { consequences.toMap().mapEntries( (consequenceEntry, consequenceIndex)=>{
          const consequenceKey = consequenceEntry[0];
          const consequence = consequenceEntry[1];
          return [consequenceKey, (<FormGroup key={'consequence-' + consequenceKey} className={styles.SheetBlock_consequence} childTypes={['flexible', null]}>
            <Input
              label={template.getIn(['consequences', consequenceIndex, 'label']) || template.get('consequences').last().get('label') }
              value={consequence}
              handleChange={this.handleChange}
              handleChangeParams={{key, path: 'consequences/' + consequenceKey}}
              superscriptAfter={template.getIn(['consequences', consequenceIndex, 'value']) || template.get('consequences').last().get('value')}
            />
          </FormGroup>)];
        } )}
      </div>
    </div>) : null;

    return hasData ? (<div className={styles.SheetBlock} key={key} >
      <h2 className={styles.SheetBlock_name} ><span>{name}</span>{headingRefresh}</h2>
      <div className={styles.SheetBlock_contentWrapper} >
        {(imageBlock)
          ? <div className={styles.SheetBlock_blockWrapper} >
              {imageBlock}
            </div>
          : null
        }
        {(descriptionBlock)
          ? <div className={styles.SheetBlock_blockWrapper} >
              {descriptionBlock}
            </div>
          : null
        }
        {(aspectBlock || skillBlock)
          ? <div className={styles.SheetBlock_blockWrapper} >
              {aspectBlock}
              {skillBlock}
            </div>
          : null
        }
        {(stuntsBlock || extrasBlock)
          ? <div className={styles.SheetBlock_blockWrapper} >
              {stuntsBlock}
              {extrasBlock}
            </div>
          : null
        }
        {(stressBlock || consequencesBlock)
          ? <div className={styles.SheetBlock_blockWrapper} >
              {stressBlock}
              {consequencesBlock}
            </div>
          : null
        }
      </div>
      {children}
    </div>) : <Alert className={styles.SheetBlock_notFound} warning >No sheet to display</Alert>;
  }
}
