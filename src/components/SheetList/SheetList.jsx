import React, { Component, PropTypes, cloneElement } from 'react';
import { Link } from 'react-router';
import { Button, Input } from 'components';
import { updateDb } from 'redux/modules/firebase';
import { Map } from 'immutable';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

export default class SheetList extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    selection: PropTypes.object,
    actions: PropTypes.array,
    toggleSheetSelection: PropTypes.func.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  deleteSheet(key) {
    console.log('deleteSheet', key );
    updateDb('/sheets/' + key, null);
  }

  @autobind
  select(value, key) {
    this.props.toggleSheetSelection(key);
  }

  @injectProps
  render({sheets = Map(), actions = [], selection, user}) {
    // const {info, load} = this.props; // eslint-disable-line no-shadow
    console.log('SheetList sheets', sheets.toJS());
    console.log('SheetList ', sheets.toJS());

    const styles = require('./SheetList.scss');
    const filteredSelection = selection
      .filter( (isSelected)=>(isSelected) )
      .map( (isSelected, key) => (
        sheets.getIn([key, 'name'])
      ) )
    ;
    return (<div className={styles.SheetList} >
      { sheets
          .sort( (sheetA, sheetB)=>( sheetA.get('name') > sheetB.get('name') ) )
          .map( (item)=>( <div className={styles['SheetList-item']} key={item.get('key')} >
        <div className={styles['SheetList-item-select']} >
          <Input type="checkbox" handleChange={this.select} handleChangeParams={item.get('key')} value={!!selection.get(item.get('key'))}/>
        </div>
        <div className={styles['SheetList-item-title']} >
          <Link to={'/sheet/' + encodeURIComponent(item.get('key'))} ><Button link className="text-left" block >{item.get('name')}</Button></Link>
        </div>
        <div className={styles['SheetList-item-actions']} >
          <Link to={'/sheet/' + encodeURIComponent(item.get('key')) + '/edit'} ><Button warning >Edit</Button></Link>
          <Button danger disabled={!user} onClick={ this.deleteSheet.bind(this, item.get('key')) } confirmMessage="Really delete?" >Delete</Button>
          { actions.map( (ActionComponent)=>( cloneElement(ActionComponent, { onClickParams: item.get('key') }) ) ) }
        </div>
      </div> ) ) }
      { filteredSelection.size ? <div className={styles['SheetList-openAll']} ><Link to={'/sheet/' + filteredSelection.keySeq().map( (key)=>( encodeURIComponent(key) ) ).join(';')} ><Button link>Open: { filteredSelection.join(', ') }</Button></Link></div> : null }
    </div>);
  }
}
