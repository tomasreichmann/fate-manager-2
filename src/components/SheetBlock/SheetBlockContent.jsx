import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { SheetBlock, Input, Button, Alert } from 'components';
import { injectProps } from 'relpers';
import { updateDb, myFirebaseConnect } from 'redux/modules/firebase';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { Link } from 'react-router';
import { FaClose } from 'react-icons/lib/fa';

@connect(
  state => ({
    templates: state.firebase.getIn(['templates', 'list']),
  })
)
@myFirebaseConnect([
  {
    path: '/sheets',
    adapter: (snapshot)=>(
      { sheets: fromJS(snapshot.val()) }
    ),
  }
])
export default class BlockContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
    templates: PropTypes.object,
    sheets: PropTypes.object,
  }

  @injectProps
  render({
    preview = false,
    handleChange,
    handleChangeParams,
    templates = Map(),
    sheets = Map(),
    sheetKeys = [],
    ...props,
  } = {}) {
    const styles = require('./SheetBlockContent.scss');
    console.log('sheetKeys', sheetKeys);
    const selectedSheets = sheetKeys.map( (sheetKey) => (
      sheets.get(sheetKey)
    ) );

    const sheetKeysValue = (typeof sheetKeys === 'object' && 'map' in sheetKeys) ? sheetKeys : [sheetKeys];

    console.log('selectedSheets', selectedSheets);
    console.log('options', selectedSheets.map( (sheet)=>( { label: sheet.get('name') || sheet.get('key'), value: sheet.get('key') } ) ));

    return preview ?
    (<div className={ styles.SheetBlockContent_blocks } {...props} > { selectedSheets.map( (sheet, sheetIndex) => (
      sheet ?
      <div className={ styles.SheetBlockContent_blocks_item } >
        <SheetBlock sheet={sheet} template={templates.get( sheet.get('template') )} updateDb={updateDb} >
          <div className={ styles.SheetBlockContent_blocks_actions }>
            <Link to={'/sheet/' + encodeURIComponent(sheet.get('key')) + '/edit'} ><Button warning><FaClose /></Button></Link>
          </div>
        </SheetBlock>
      </div>
      :
      <Alert warning >Sheet {sheetKeys[sheetIndex]} not found</Alert>
    ) ) }
    </div>)
    :
    (<div {...props} >
      <Input label="Sheets" type="select" name="sheetKeys" size={ Math.min(sheets.size || 0, 10) } options={ sheets.map( (sheet)=>( { label: sheet.get('name') || sheet.get('key'), value: sheet.get('key') } ) ) } value={sheetKeysValue} multiple handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/sheetKeys' }} />
    </div>);
  }
}
