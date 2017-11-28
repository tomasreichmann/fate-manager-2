import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { fromJS, OrderedMap } from 'immutable';
import { SheetList, Button, FormGroup, Input, Alert, Loading } from 'components';
import { push } from 'react-router-redux';
import { myFirebaseConnect, toggleSheetSelection } from '../../redux/modules/firebase';
import { FaPlus } from 'react-icons/lib/fa';

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
    adapter: (snapshot)=>{
      let sheets = new OrderedMap();
      snapshot.forEach( (child)=>{
        sheets = sheets.set(child.val().key, fromJS(child.val()));
      });
      return { sheets };
    },
    orderByChild: 'name',
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
    this.newSheet = this.newSheet.bind(this);
  }

  newSheet() {
    const templateKey = this.newSheetTemplateSelect.value;
    this.props.pushState('/sheet/new/' + templateKey);
  }

  render() {
    const styles = require('./Sheets.scss');
    const {sheets, selection, templates, toggleSelection, user, firebaseConnectDone} = this.props;
    const SheetsInstance = this;

    return (
      <div className={styles.Sheets}>
        <Helmet title="Sheets"/>
        <Loading show={!firebaseConnectDone} message="Loading" />

        <div className="container">

          { user ? null : <Alert warning>To use all features, you must <Link to={"/login/sheets" } ><Button link >log in</Button></Link>.</Alert> }

          <SheetList sheets={sheets} selection={selection} toggleSheetSelection={toggleSelection} user={user} />

          <hr />


          { <FormGroup>
            <Input
              type="select"
              options={templates.map( (template)=>( { label: template.get('name'), value: template.get('key') } ) )}
              label="template"
              inputRef={ (select)=>(SheetsInstance.newSheetTemplateSelect = select) }
            />
            <Button disabled={!user} block success onClick={this.newSheet}><FaPlus />&emsp;New sheet</Button>
          </FormGroup> }

        </div>

      </div>
    );
  }
}
