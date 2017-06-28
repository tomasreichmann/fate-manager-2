import React, { Component, PropTypes } from 'react';
import { Button, Input } from 'components';
import { updateSheet } from 'redux/modules/firebase';
import { Map } from 'immutable';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

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
  }

  deleteSheet(key) {
    console.log('deleteSheet', key );
    updateSheet(key, null);
  }

  @autobind
  select(value, key) {
    this.props.toggleSheetSelection(key);
  }

  @injectProps
  render({sheets = Map(), selection, pushState, user}) {
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
          <Button link className="text-left" block onClick={pushState.bind(this, '/sheet/' + encodeURIComponent(item.get('key')) )} >{item.get('name')}</Button>
        </div>
        <div className={styles['SheetList-item-actions']} >
          <Button warning onClick={pushState.bind(this, '/sheet/' + encodeURIComponent(item.get('key')) + '/edit' )} >Edit</Button>
          <Button danger disabled={!user} onClick={ this.deleteSheet.bind(this, item.get('key')) } confirmMessage="Really delete?" >Delete</Button>
        </div>
      </div> ) ) }
      { filteredSelection.size ? <div className={styles['SheetList-openAll']} ><Button link onClick={pushState.bind(this, '/sheet/' + filteredSelection.keySeq().map( (key)=>( encodeURIComponent(key) ) ).join(';') )} >Open: { filteredSelection.join(', ') }</Button></div> : null }
    </div>);
  }
}
