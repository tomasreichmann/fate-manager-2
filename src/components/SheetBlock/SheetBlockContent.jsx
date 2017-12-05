import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { SheetBlock, Input, Button, Alert } from 'components';
import { injectProps } from 'relpers';
import { updateDb, myFirebaseConnect } from 'redux/modules/firebase';
import { connect } from 'react-redux';
import { fromJS } from 'immutable';
import { Link } from 'react-router';
import { FaEdit } from 'react-icons/lib/fa';
import { sortByKey, resolveAccess } from 'utils/utils';

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
export default class SheetBlockContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
    templates: PropTypes.object,
    sheets: PropTypes.object,
    user: PropTypes.object,
  }

  @injectProps
  render({
    preview = false,
    handleChange,
    handleChangeParams,
    templates = new Map(),
    sheets = new Map(),
    sheetKeys = [],
    user = new Map(),
    ...props,
  } = {}) {
    const styles = require('./SheetBlockContent.scss');
    const selectedSheets = sheetKeys.map( (sheetKey) => (
      sheets.get(sheetKey)
    ) );

    const sheetKeysValue = (typeof sheetKeys === 'object' && 'map' in sheetKeys) ? sheetKeys : [sheetKeys];

    if (preview) {
      if (selectedSheets.length === 0) {
        return <Alert className={ styles.SheetBlockContent_blocks } {...props} >No sheets selected</Alert>;
      }
      return (<div className={ styles.SheetBlockContent_blocks } {...props} > { selectedSheets.map( (sheet, sheetIndex) => (
        sheet ?
        <div className={ styles.SheetBlockContent_blocks_item } key={sheetIndex} >
          <SheetBlock sheet={sheet} template={templates.get( sheet.get('template') )} updateDb={updateDb} >
            <div className={ styles.SheetBlockContent_blocks_actions }>
              <Link to={'/sheet/' + encodeURIComponent(sheet.get('key')) + '/edit'} ><Button warning><FaEdit /> Edit</Button></Link>
            </div>
          </SheetBlock>
        </div>
        :
        <Alert key={sheetIndex} warning >Sheet {sheetKeys[sheetIndex]} not found</Alert>
      ) ) }
      </div>);
    }

    const sheetOptions = sheets
      .filter((sheet) => {
        return resolveAccess(sheet, user.get('uid'));
      })
      .map((sheet)=>(
        { label: sheet.get('name') || sheet.get('key'), value: sheet.get('key') }
      ))
      .sort(sortByKey('label'));

    return (<div {...props} >
      <Input
        label="Sheets"
        type="select"
        name="sheetKeys"
        size={ Math.min(sheets.size || 0, 10) }
        options={sheetOptions}
        value={sheetKeysValue}
        multiple
        handleChange={handleChange}
        handleChangeParams={{...handleChangeParams, path: 'componentProps/sheetKeys' }}
      />
    </div>);
  }
}
