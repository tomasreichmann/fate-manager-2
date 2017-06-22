import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Map } from 'immutable';
import { SheetList, Button } from 'components';
import { openModal, closeModal } from 'redux/modules/modal';

@connect(
  state => ({
    fullState: state,
    templates: state.firebase.getIn(['templates', 'list']),
    sheets: state.firebase.getIn(['sheets', 'list']),
    selection: state.firebase.getIn(['sheets', 'selected']),
  }),
  {
    openModal,
    closeModal,
  }
)
export default class Home extends Component {
  static propTypes = {
    fullState: PropTypes.object,
    sheets: PropTypes.object,
    templates: PropTypes.object,
    openModal: PropTypes.func,
    closeModal: PropTypes.func,
  };
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.migrateSheetAspects = this.migrateSheetAspects.bind(this);
    this.newSheetDialog = this.newSheetDialog.bind(this);
  }

  newSheetDialog() {
    console.log('newSheetDialog');
    this.props.openModal({
      children: <div>XXX</div>,
      closeModal: this.props.closeModal
    });
  }

  migrateSheetAspects() {
    console.log('sheets', this.props.sheets );
    console.log('templates', this.props.templates );
    const newSheets = this.props.sheets.map( (sheet)=>{
      const template = this.props.templates.get( sheet.get('template') || -1 );
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
    const styles = require('./Home.scss');
    const {sheets} = this.props;
    // require the logo image both from client and server

    console.log('render sheets', sheets );

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">

          <SheetList sheets={sheets} />

          <hr />

          {false && <p><Button block danger onClick={this.migrateSheetAspects} >DANGEROUS: migrateSheetAspects!</Button></p>}
          <p><Button block success onClick={this.newSheetDialog}>New sheet!</Button></p>

        </div>

      </div>
    );
  }
}
