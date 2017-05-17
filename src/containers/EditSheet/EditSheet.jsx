import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Input, Button } from 'components';
import { updateSession, updateSheet, discardSheetUpdates } from 'redux/modules/firebase';

@connect(
  state => ({
    sheets: state.firebase.getIn(['sheets', 'list']),
    editedSheets: state.firebase.getIn(['session', 'editedSheets'])
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

  render() {
    const {params, editedSheets} = this.props;
    const styles = require('./EditSheet.scss');
    console.log('this.props', this.props, editedSheets);
    const key = params.key;
    const sheet = editedSheets.get(key);

    return (
      <div className={styles.EditSheet + ' container'} >
        { sheet ?
          <form className={styles['EditSheet-form']}>
            <h2><Input value={sheet.get('name')} handleChange={this.handleChange} handleChangeParams={{path: 'name'}} /></h2>
            <div className={styles['EditSheet-actions']} >
              <Button danger onClick={this.discard} >Discard updates</Button>
              <Button primary onClick={this.viewAsBlock} >Leave unsaved and view as Block</Button>
              <Button success onClick={this.save} >Save</Button>
            </div>
          </form>
        : <p className="alert alert-warning" >Sheet not found</p> }
      </div>
    );
  }
}
