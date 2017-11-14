import React, { Component, PropTypes, cloneElement } from 'react';
import { Link } from 'react-router';
import { Button, Input, User, Alert, FormGroup } from 'components';
import { updateDb } from 'redux/modules/firebase';
import { Map } from 'immutable';
import { injectProps } from 'relpers';
import { intersperse } from 'utils/utils';
import autobind from 'autobind-decorator';
import { FaEdit, FaTrash, FaUserTimes, FaEyeSlash } from 'react-icons/lib/fa';
import { resolveAccess, hasLimitedAccess } from 'utils/utils';

export default class SheetList extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    selection: PropTypes.object,
    actions: PropTypes.array,
    toggleSheetSelection: PropTypes.func,
    user: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.state = {
      selection: Map({})
    };
  }

  @autobind
  getListItem(item) {
    const {actions = [], selection = this.state.selection, user} = this.props;
    const styles = require('./SheetList.scss');
    const columns = [
      <div className={styles.SheetList_item_select} >
        <Input type="checkbox" handleChange={this.select} handleChangeParams={item.get('key')} value={!!selection.get(item.get('key'))}/>
      </div>
    ];
    const limitedAccess = hasLimitedAccess(item);
    if (limitedAccess) {
      columns.push(<div className={styles.SheetList_item_limited_access} ><FaEyeSlash /></div>);
    }
    columns.push(
      <div className={styles.SheetList_item_title} >
        <Link to={'/sheet/' + encodeURIComponent(item.get('key'))} ><Button link className="text-left" block >{item.get('npc') ? <FaUserTimes style={{marginRight: '1rem', fontSize: '1.2em'}} /> : null}{item.get('name')}</Button></Link>
      </div>,
      <div className={styles.SheetList_item_created} >
        {(new Date(item.get('created'))).toLocaleString()}
      </div>,
      <div className={styles.SheetList_item_user} >
        <User uid={item.get('createdBy')} />
      </div>,
      <div className={styles.SheetList_item_actions} >
        <Link to={'/sheet/' + encodeURIComponent(item.get('key')) + '/edit'} ><Button warning clipBottomLeft ><FaEdit /></Button></Link>
        <Button noClip={!!actions.length} danger disabled={!user} onClick={ this.deleteSheet.bind(this, item.get('key')) } confirmMessage="Really delete?" ><FaTrash /></Button>
        { actions.map( (ActionComponent, actionIndex)=>( cloneElement(ActionComponent, { onClickParams: item.get('key'), key: actionIndex }) ) ) }
      </div>,
    );

    const childTypes = limitedAccess ? [null, null, 'flexible'] : [null, 'flexible'];

    return (<FormGroup className={styles.SheetList_item} key={item.get('key')} childTypes={childTypes} >
      {columns}
    </FormGroup>);
  }

  @autobind
  select(value, key) {
    const { toggleSheetSelection = this.toggleSheetSelection } = this.props;
    toggleSheetSelection(key);
  }

  @autobind
  toggleSheetSelection(keys) {
    console.log('toggleSheetSelection keys', keys, this.state);
    const toggleSheetKeys = Array.isArray(keys) ? keys : [keys];
    return this.setState({
      selection: toggleSheetKeys.reduce( (updatedSelectedKeys, sheetKey) => (
        updatedSelectedKeys.update(sheetKey, (selected) => (!selected) )
      ), this.state.selection )
    });
  }

  @autobind
  selectAll(value) {
    console.log('selectAll(value)', value);
    const {selection = this.state.selection, sheets = Map(), toggleSheetSelection = this.toggleSheetSelection} = this.props;

    if (!value) {
      toggleSheetSelection( Array.from(sheets.keys()) );
    } else {
      const unselectedSheetKeys = Array.from(sheets.keys())
        .filter( (sheetKey)=>( !selection.get( sheetKey ) ) )
      ;
      toggleSheetSelection(unselectedSheetKeys);
    }
  }

  deleteSheet(key) {
    console.log('deleteSheet', key );
    updateDb('/sheets/' + key, null);
  }

  @injectProps
  render({sheets = Map(), selection = this.state.selection, user}) {
    const styles = require('./SheetList.scss');
    const filteredSelection = selection
      .filter( (isSelected)=>(isSelected) )
      .map( (isSelected, key) => (
        sheets.getIn([key, 'name'])
      ) )
    ;
    return (<div className={styles.SheetList} >
      <label className={styles.SheetList_item_select_label}><FormGroup className={styles.SheetList_item_select} key="selectAll" >
        <Input type="checkbox" handleChange={this.selectAll} value={filteredSelection.size === sheets.size} inline />
        Select all
      </FormGroup></label>
      { sheets.size ? sheets
          .filter( (campaign) => {
            return resolveAccess(campaign, user.get('uid'));
          })
          .map( this.getListItem ) : <Alert warning >No sheets</Alert> }
      { filteredSelection.size ? <div className={styles.SheetList_openAll} >
        <Link to={'/sheet/' + filteredSelection.keySeq().map( (key)=>( encodeURIComponent(key) ) ).join(';')} >
          Open all selected: {
            intersperse(filteredSelection.toArray().map((item, index)=>(
              <Button key={index} link >{ item }</Button>
            )), ', ')
          }
        </Link>
      </div> : null }
    </div>);
  }
}
