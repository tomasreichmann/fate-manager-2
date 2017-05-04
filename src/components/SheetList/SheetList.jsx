import React, {Component, PropTypes} from 'react';
import { push } from 'react-router-redux';
// import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button } from 'components';
// import {load} from 'redux/modules/info';

@connect(
    state => ({sheets: state.firebase.getIn(['sheets', 'list'])}),

    {pushState: push}
    // dispatch => bindActionCreators({load}, dispatch)
)
export default class InfoBar extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    pushState: PropTypes.func.isRequired
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  displayDeleteSheetConfirmation(item) {
    console.log('displayDeleteSheetConfirmation', item.toJS() );
  }

  redirect(to) {
    return ()=>{
      console.log('redirect', to );
      this.props.pushState(to);
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
            <Button link className="text-left" block onClick={this.redirect('/block/' + encodeURIComponent(item.get('key')) )} >{item.get('name')}</Button>
          </div>
          <div className={styles['SheetList-item-actions']} >
            <Button warning onClick={this.redirect( '/edit/' + encodeURIComponent(item.get('key')) )} >{text.edit}</Button>
            <Button danger onClick={ this.displayDeleteSheetConfirmation.bind(this, item) } >{text.delete}</Button>
          </div>
        </div> ) ) }
      </div>
    );
  }
}
