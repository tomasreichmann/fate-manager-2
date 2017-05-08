import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
// import { Button, SheetBlock } from 'components';

@connect(
    state => ({sheets: state.firebase.getIn(['sheets', 'list'])}),
    {pushState: push}
)
export default class EditSheet extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(to) {
    return ()=>{
      console.log('redirect', to );
      this.props.pushState(to);
    };
  }

  displayDeleteSheetConfirmation(item) {
    console.log('displayDeleteSheetConfirmation', item.toJS() );
  }

  render() {
    const {sheets, params} = this.props;
    console.log('this.props', this.props);
    const key = params.key;
    console.log('key', key);
    const sheet = sheets.get(key);

    const styles = require('./EditSheet.scss');

    return (
      <div className={styles.Blocks + ' container'} >
        { sheet.get('name') }
        { !sheet ? <p className="alert alert-warning" >Sheet not found</p> : null }
      </div>
    );
  }
}
