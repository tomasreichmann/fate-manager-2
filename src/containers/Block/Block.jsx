import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { updateSheet } from 'redux/modules/firebase';
import { connect } from 'react-redux';
import { Button, SheetBlock } from 'components';
import { List } from 'immutable';

@connect(
  state => ({
    sheets: state.firebase.getIn(['sheets', 'list']),
    templates: state.firebase.getIn(['templates', 'list']),
  }),
  {
    pushState: push
  }
)
export default class Block extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    templates: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
    this.deleteSheet = this.deleteSheet.bind(this);
  }

  redirect(to) {
    return ()=>{
      console.log('redirect', to );
      this.props.pushState(to);
    };
  }

  deleteSheet(key) {
    console.log('deleteSheet');
    updateSheet(key, null);
    this.props.pushState('/');
  }

  render() {
    const {sheets, templates, params} = this.props;
    console.log('this.props', this.props);
    const keys = params.keys.split(';');
    const styles = require('./Block.scss');
    const selectedSheets = sheets ? sheets.filter( (sheet)=>( keys.indexOf( sheet.get('key') ) > -1 ) ) : List();

    return (
      <div className={styles.Blocks + ' container'} >
        { selectedSheets.map( (sheet)=>( <div className={styles['Blocks-item']} key={sheet.get('key')} >
          <SheetBlock sheet={sheet} template={templates.get( sheet.get('template') || 'VS-P' )} updateSheet={updateSheet} >
            <div className={styles['Blocks-actions']} >
              <Button warning onClick={this.redirect( '/edit/' + encodeURIComponent(sheet.get('key')) )} >Edit</Button>
              <Button danger onClick={ this.deleteSheet.bind(this, sheet.get('key')) } confirmMessage="Really delete forever?" >Delete</Button>
            </div>
          </SheetBlock>
        </div> ) ) }
        { selectedSheets.size === 0 ? <p className="alert alert-warning" >No sheet found</p> : null }
      </div>
    );
  }
}
