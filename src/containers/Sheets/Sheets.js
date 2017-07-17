import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { SheetList, Button, FormGroup, Input, Alert, Loading } from 'components';
import { push } from 'react-router-redux';
import { myFirebaseConnect, toggleSheetSelection } from '../../redux/modules/firebase';

@connect(
  state => ({
    templates: state.firebase.getIn(['templates', 'list']),
    selection: state.firebase.getIn(['sheets', 'selected']),
    user: state.firebase.get('user'),
  }),
  dispatch => bindActionCreators({
    toggleSelection: toggleSheetSelection,
    pushState: push,
  }, dispatch)
)
@myFirebaseConnect([
  {
    path: '/sheets',
    adapter: (snapshot)=>(
      { sheets: fromJS(snapshot.val()) }
    ),
  }
])
export default class Sheets extends Component {
  static propTypes = {
    sheets: PropTypes.object,
    user: PropTypes.object,
    templates: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    selection: PropTypes.object,
    firebaseConnectDone: PropTypes.bool,
    toggleSelection: PropTypes.func.isRequired,
  };
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.migrateSheetAspects = this.migrateSheetAspects.bind(this);
    this.newSheet = this.newSheet.bind(this);
  }

  newSheet() {
    console.log('newSheet');
    const templateKey = this.newSheetTemplateSelect.value;
    this.props.pushState('/sheet/new/' + templateKey);
  }

  migrateSheetAspects() {
    console.log('sheets', this.props.sheets );
    console.log('selection', this.props.selection );
    console.log('templates', this.props.templates );
    const newSheets = this.props.sheets.map( (sheet)=>{
      const template = this.props.templates.get( sheet.get('template') || '-1' );
      return sheet.update('aspects', (aspects)=>{
        return aspects.map( (aspect, aspectIndex)=>{
          if (typeof aspect === 'string') {
            const typeMap = {
              0: template.getIn(['aspects', 'types', 0, 'value']),
              1: template.getIn(['aspects', 'types', 1, 'value']),
              2: template.getIn(['aspects', 'types', 2, 'value']),
            };
            return Map({
              type: typeMap[ Math.min(aspectIndex, 2) ],
              title: aspect,
            });
          }
          return aspect;
        } );
      } );
    });
    console.log(JSON.stringify(newSheets.toJSON()));
  }

  render() {
    const styles = require('./Sheets.scss');
    const {sheets, selection, templates, toggleSelection, user, firebaseConnectDone} = this.props;
    // require the logo image both from client and server

    console.log('render sheets', sheets, sheets && sheets.toJS() );

    const SheetsInstance = this;

    return (
      <div className={styles.Sheets}>
        <Helmet title="Sheets"/>
        <Loading show={!firebaseConnectDone} message="Loading" />

        <div className="container">

          { user ? null : <Alert warning>To use all features, you must <Link to={"/login/sheets" } ><Button link >log in</Button></Link>.</Alert> }

          <SheetList sheets={sheets} selection={selection} toggleSheetSelection={toggleSelection} user={user} />

          <hr />

          {false && <p><Button block danger onClick={this.migrateSheetAspects} >DANGEROUS: migrateSheetAspects!</Button></p>}

          { <FormGroup childTypes={[null, 'flexible']}>
            <Input
              type="select"
              options={templates.map( (template)=>( { label: template.get('name'), value: template.get('key') } ) )}
              label="template"
              inputRef={ (select)=>(SheetsInstance.newSheetTemplateSelect = select) }
            />
            <Button disabled={!user} block success onClick={this.newSheet}>New sheet</Button>
          </FormGroup> }

        </div>

      </div>
    );
  }
}
