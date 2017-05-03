import React, {Component, PropTypes} from 'react';
import { push } from 'react-router-redux';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
// import {load} from 'redux/modules/info';

@connect(
    state => ({sheets: state.firebase.getIn(['sheets', 'list'])}),

    {pushState: push}
    // dispatch => bindActionCreators({load}, dispatch)
)
export default class InfoBar extends Component {
  static propTypes = {
    sheets: PropTypes.object
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  displayDeleteSheetConfirmation(item) {
    console.log('displayDeleteSheetConfirmation', item.toJS() );
  }

  redirect(to) {
    return ()=>{
      console.log('redirect', to );
    };
  }

  render() {
    // const {info, load} = this.props; // eslint-disable-line no-shadow
    const {sheets} = this.props;
    const styles = require('./SheetList.scss');
    const text = {
      edit: 'edit',
      delete: 'delete'
    };
    return (
      <div className={styles.SheetList} >
        { sheets.map( (item)=>( <div className={styles['SheetList-item']} key={item.get('key')} >
          <div className={styles['SheetList-item-title']} >
            <button onClick={this.redirect('/block/' + encodeURIComponent(item.get('key')) )} >{item.get('name')}</button>
          </div>
          <div className={styles['SheetList-item-actions']} >
            <button className="edit button" onClick={this.redirect( '/edit/' + encodeURIComponent(item.get('key')) )} >{text.edit}</button>
            <button className="delete button button-danger" onClick={ this.displayDeleteSheetConfirmation.bind(this, item) } >{text.delete}</button>
          </div>
        </div> ) ) }
      </div>
    );
  }
}
