import React, {Component, PropTypes} from 'react';
import { push } from 'react-router-redux';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';
import { Button, Input } from 'components';
import {toggleSheetSelection} from 'redux/modules/firebase';

@connect(
  state => ({
    sheets: state.firebase.getIn(['sheets', 'list']),
    selection: state.firebase.getIn(['sheets', 'selected']),
  }),

  dispatch => bindActionCreators({
    toggleSheetSelection,
    pushState: push,
  }, dispatch)
)
export default class SheetList extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    selection: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    toggleSheetSelection: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
    this.select = this.select.bind(this);
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

  select(value, key) {
    this.props.toggleSheetSelection(key);
  }

  render() {
    // const {info, load} = this.props; // eslint-disable-line no-shadow
    const {sheets, selection} = this.props;
    const styles = require('./SheetList.scss');
    const filteredSelection = selection
      .filter( (isSelected)=>(isSelected) )
      .map( (isSelected, key) => (
        sheets.getIn([key, 'name'])
      ) )
    ;
    return (<div className={styles.SheetList} >
      { sheets.map( (item)=>( <div className={styles['SheetList-item']} key={item.get('key')} >
        <div className={styles['SheetList-item-select']} >
          <Input type="checkbox" handleChange={this.select} handleChangeParams={item.get('key')} value={!!selection.get(item.get('key'))}/>
        </div>
        <div className={styles['SheetList-item-title']} >
          <Button link className="text-left" block onClick={this.redirect('/block/' + encodeURIComponent(item.get('key')) )} >{item.get('name')}</Button>
        </div>
        <div className={styles['SheetList-item-actions']} >
          <Button warning onClick={this.redirect( '/edit/' + encodeURIComponent(item.get('key')) )} >Edit</Button>
          <Button danger onClick={ this.displayDeleteSheetConfirmation.bind(this, item) } >Delete</Button>
        </div>
      </div> ) ) }
      { filteredSelection.size ? <div className={styles['SheetList-openAll']} ><Button link onClick={this.redirect('/block/' + filteredSelection.keySeq().map( (key)=>( encodeURIComponent(key) ) ).join(';') )} >Open: { filteredSelection.join(', ') }</Button></div> : null }
    </div>);
  }
}
