import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Input, Button } from 'components';
import { updateSession, updateSheet, discardSheetUpdates } from 'redux/modules/firebase';

@connect(
  state => ({
    sheets: state.firebase.getIn(['sheets', 'list']),
    templates: state.firebase.getIn(['templates', 'list']),
    editedSheets: state.firebase.getIn(['session', 'editedSheets']),
  }),
  {
    pushState: push,
    updateSession,
    discardSheetUpdates,
  }
)
export default class EditSheet extends Component {

  static propTypes = {
    editedSheets: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    updateSession: PropTypes.func.isRequired,
    discardSheetUpdates: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    templates: PropTypes.object,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
    this.handleChange = this.handleChange.bind(this);
    this.discard = this.discard.bind(this);
    this.save = this.save.bind(this);
    this.viewAsBlock = this.viewAsBlock.bind(this);
  }

  redirect(to) {
    return ()=>{
      console.log('redirect', to );
      this.props.pushState(to);
    };
  }

  discard(event) {
    event.preventDefault();
    console.log('discard');
    this.props.discardSheetUpdates(this.props.params.key);
    this.props.pushState('/');
  }

  save(event) {
    event.preventDefault();
    console.log('save');
    const key = this.props.params.key;
    updateSheet(key, this.props.editedSheets.get(key).toJSON() );
    this.props.pushState('/block/' + key);
    this.props.discardSheetUpdates(this.props.params.key);
  }

  viewAsBlock(event) {
    event.preventDefault();
    console.log('viewAsBlock');
    const key = this.props.params.key;
    this.props.pushState('/block/' + key);
  }

  handleChange(value, {path}) {
    const sessionPath = 'editedSheets/' + this.props.params.key + '/' + path;
    this.props.updateSession(sessionPath, value);
  }

  changeSkill(skillSlug, value, event) {
    const sessionPath = 'editedSheets/' + this.props.params.key + '/skills/' + skillSlug;
    this.props.updateSession(sessionPath, value);
    event.preventDefault();
  }

  render() {
    const {params, editedSheets, templates} = this.props;
    const styles = require('./EditSheet.scss');
    console.log('this.props', this.props, editedSheets);
    const key = params.key;
    const sheet = editedSheets.get(key);
    const template = templates.get( editedSheets.get('template') || -1 );
    console.log('sheet', sheet.toJS());
    console.log('template', template.toJS());

    console.log('description', sheet.get('description'));
    console.log('aspects', sheet.get('aspects'));
    console.log('skills', sheet.get('skills'));
    console.log('extras', sheet.get('extras'));
    console.log('stunts', sheet.get('stunts'));
    console.log('stress', sheet.get('stress'));
    console.log('consequences', sheet.get('consequences'));

    if (!template || !sheet) {
      return <div className={styles.EditSheet + ' container'} ><p className="alert alert-warning" >Sheet or template not found</p></div>;
    }


    const descriptionBlock = (<div className={styles['EditSheet-descriptionBlock']} >
      <Input label="Description" type="textarea" value={sheet.get('description')} handleChange={this.handleChange} handleChangeParams={{path: 'description'}} />
    </div>);

    const aspectsBlock = (<div className={styles['EditSheet-aspectsBlock']} >
      <h2>Aspects</h2>
      {template.get('aspects').map( (aspect, index)=>(
        <Input key={'aspect-' + index} label={aspect.get('type')} value={sheet.getIn(['aspects', index])} handleChange={this.handleChange} handleChangeParams={{path: 'aspects/' + index}} />
      ) )}
    </div>);

    const skillsBlock = (<div className={styles['EditSheet-skillsBlock']} >
      <h2>Skills</h2>
      { sheet.get('skills').sort().reverse().reduce( ( elements, level, skillSlug ) => (
        level > 0 ? elements.concat([<div className={styles['EditSheet-skill']} ><strong>{template.getIn(['skills', skillSlug, 'name'])} {level}</strong> <Button danger clipBottomLeft onClick={this.changeSkill.bind(this, skillSlug, level - 1)} >&ndash;</Button><Button success onClick={this.changeSkill.bind(this, skillSlug, level + 1)} >+</Button> </div>]) : elements
      ), [] ) }
    </div>);

    const extrasBlock = (<div className={styles['EditSheet-extrasBlock']} >
      <Input label="Extras" type="textarea" value={sheet.get('extras')} handleChange={this.handleChange} handleChangeParams={{path: 'extras'}} />
    </div>);

    const stuntsBlock = (<div className={styles['EditSheet-stuntsBlock']} >
      <Input label="Stunts" type="textarea" value={sheet.get('stunts')} handleChange={this.handleChange} handleChangeParams={{path: 'stunts'}} />
    </div>);

    const stressBlock = (<div className={styles['EditSheet-stressBlock']} >
      <h2>Stress</h2>
      { template.get('stress').map( (stressLane, stressLaneIndex)=>(
        <div className={styles['EditSheet-stressLane']} key={stressLaneIndex} >
          <strong>{stressLane.get('label')}: </strong>
          { (sheet.getIn(['stress', stressLaneIndex.toString()]) || []).map( (isUsed, boxIndex)=>(
            <Input type="checkbox" className={styles['EditSheet-stressBox']} value={isUsed} inline superscriptAfter={boxIndex + 1} handleChange={this.handleChange} handleChangeParams={{path: 'stress/' + stressLaneIndex + '/' + boxIndex}} />
          ) ) }
        </div>
      ) ) }
    </div>);

    const consequencesBlock = (<div className={styles['EditSheet-consequencesBlock']} >
      <h2>Consequences</h2>
      {template.get('consequences').map( (consequence, index)=>(
      <Input key={'consequence-' + index} label={consequence.get('label')} value={sheet.getIn(['consequences', index])} handleChange={this.handleChange} handleChangeParams={{path: 'consequences/' + index}} superscriptAfter={consequence.get('value')} />
    ) )}</div>);

    return (
      <div className={styles.EditSheet + ' container'} >
        <form className={styles['EditSheet-form']}>
          <h2 className={styles['EditSheet-heading']}>
            <div><Input label="Name" value={sheet.get('name')} handleChange={this.handleChange} handleChangeParams={{path: 'name'}} /></div>
            <div><Input value={sheet.get('refresh')} label="Refresh" handleChange={this.handleChange} handleChangeParams={{path: 'refresh'}} /></div>
          </h2>
          {descriptionBlock}
          {aspectsBlock}
          {skillsBlock}
          {extrasBlock}
          {stuntsBlock}
          {stressBlock}
          {consequencesBlock}
          <hr />
          <div className={styles['EditSheet-actions']} >
            <Button danger onClick={this.discard} >Discard updates</Button>
            <Button primary onClick={this.viewAsBlock} >Leave unsaved and view as Block</Button>
            <Button success onClick={this.save} >Save</Button>
          </div>
        </form>
      </div>
    );
  }
}
