import React, { Component, PropTypes } from 'react';
import { push } from 'react-router-redux';
import { connect } from 'react-redux';
import { Button, SheetBlock } from 'components';

@connect(
    state => ({sheets: state.firebase.getIn(['sheets', 'list'])}),
    {pushState: push}
)
export default class Block extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
    this.redirect = this.redirect.bind(this);
  }

  redirect(to) {
    return ()=>{
      console.log('redirect', to );
      this.props.pushState(to);
    };
  }

  displayDeleteSheetConfirmation(item) {
    console.log('displayDeleteSheetConfirmation', item.toJS() );
  }

  render() {
    const {sheets, params} = this.props;
    console.log('this.props', this.props);
    const keys = params.keys.split(';');
    const styles = require('./Block.scss');
    const selectedSheets = sheets.filter( (sheet)=>( keys.indexOf( sheet.get('key') ) > -1 ) );

    return (
      <div className={styles.SheetBlock + ' container'} >
        { selectedSheets.map( (sheet)=>( <div className={styles['SheetBlock-item']} key={sheet.get('key')} >
          <SheetBlock sheet={sheet} >
            <div className={styles['SheetBlock-actions']} >
              <Button warning onClick={this.redirect( '/edit/' + encodeURIComponent(sheet.get('key')) )} >Edit</Button>
              <Button danger onClick={ this.displayDeleteSheetConfirmation.bind(this, sheet) } >Delete</Button>
            </div>
          </SheetBlock>
        </div> ) ) }
        { selectedSheets.length === 0 ? <p className="alert alert-warning" >No sheet found</p> : null }
      </div>
    );
  }
}
