import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { push } from 'react-router-redux';
import { updateDb, pushToDb, myFirebaseConnect2 } from 'redux/modules/firebase';
import { connect } from 'react-redux';
import { Loading, Button, SheetBlock, Alert, Breadcrumbs } from 'components';
import { Map, fromJS } from 'immutable';
import { Link } from 'react-router';
import { FaTrash, FaClone, FaEdit} from 'react-icons/lib/fa';
import { resolveAccess } from 'utils/utils';
import autobind from 'autobind-decorator';

@connect(
  state => ({
    user: state.firebase.get('user'),
    templates: state.firebase.getIn(['templates', 'list']),
  }),
  {
    pushState: push
  }
)
@myFirebaseConnect2((props) => {
  console.log('myFirebaseConnect2', props);
  const connectors = [{
    path: '/sheets',
    getProps: (snapshot) => {
      const unAthorized = [];
      const sheets = fromJS(snapshot.val()).filter( (sheet) => {
        const sheetKey = sheet.get('key');
        const keys = props.params.keys.split(';');
        if (!keys.includes(sheetKey)) {
          return false;
        }
        const hasAccess = resolveAccess(sheet, props.user ? props.user.get('uid') : null);
        if (!hasAccess) {
          unAthorized.push(sheetKey);
          return false;
        }
        return true;
      } );

      console.log('/sheets getProps', {
        sheets,
        unAthorized,
      });

      return {
        sheets,
        unAthorized,
      };
    },
  }];

  if (props.params.campaignKey) {
    connectors.push({
      path: '/campaigns/' + props.params.campaignKey,
      getProps: (snapshot) => ({ campaignName: snapshot.val().name || props.params.campaignKey })
    });
  }

  return connectors;
})
export default class Block extends Component {

  static propTypes = {
    sheets: PropTypes.object,
    user: PropTypes.object,
    templates: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    firebaseConnectDone: PropTypes.bool,
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);
  }

  @autobind
  redirect(to) {
    return ()=>{
      this.props.pushState(to);
    };
  }

  @autobind
  deleteSheet(key) {
    updateDb('/sheets/' + key, null);
    this.props.pushState('/sheets');
  }

  @autobind
  duplicateSheet(sheet) {
    const nameSequenceRegex = /\s(\d+)$/;
    pushToDb('/sheets', (key) => {
      this.props.pushState('/sheet/' + key);
      return sheet
        .set('key', key)
        .update('name', (name) => {
          const hasSequence = nameSequenceRegex.test(name);
          return hasSequence ? name.replace( /\s(\d+)$/, (match, part1) => (
            ' ' + (parseInt(part1, 10) + 1)
          )) : name + ' 2';
        })
        .toJSON();
    } );
  }

  render() {
    const {sheets = new Map({}), campaignName, templates, params, user, firebaseConnectDone, unAthorized = [] } = this.props;
    console.log('campaignName', campaignName);
    const styles = require('./Block.scss');
    const selectedSheetNames = sheets.size ? sheets.map( (sheet) => ( sheet.get('name') || sheet.get('key') ) ).join(', ') : params.keys.split(';').join(', ');

    const breadcrumbLinks = [{url: '/', label: '⌂'}];
    if (params.campaignKey) {
      breadcrumbLinks.push({url: '/campaign/' + params.campaignKey, label: campaignName || params.campaignKey});
    } else {
      breadcrumbLinks.push({url: '/sheets', label: 'Sheets'});
    }

    return (
      <div className={styles.Blocks}>
        <Helmet title={selectedSheetNames}/>
        <Breadcrumbs links={[
          ...breadcrumbLinks,
          {label: sheets.map( (sheet)=>( sheet.get('name') || sheet.get('key') )).join(', ') }
        ]} />
        <div className={styles.Blocks_list}>
          <Loading show={!firebaseConnectDone} message="Loading" />
          { unAthorized.length ? <Alert warning className={styles.Blocks_alert} >You are unathorized to view {unAthorized.length} sheets: {unAthorized.join(', ')}</Alert> : null }
          { user ? null : <Alert className={styles.Blocks_alert} warning >To use all features, you must <Link to={ '/login/' + encodeURIComponent('sheet/' + params.keys) } ><Button link >log in</Button></Link>.</Alert> }
          { firebaseConnectDone ? sheets.map( (sheet)=>( <div className={styles.Blocks_item} key={sheet.get('key')} >
            <SheetBlock sheet={sheet} template={templates.get( sheet.get('template') )} updateDb={updateDb} >
              <div className={styles.Blocks_actions} >
                <Button primary disabled={!user} onClick={this.duplicateSheet} onClickParams={sheet} clipBottomLeft ><FaClone /></Button>
                <Link to={'/sheet/' + encodeURIComponent(sheet.get('key')) + '/edit'} ><Button warning noClip ><FaEdit /></Button></Link>
                <Button danger disabled={!user} onClick={ this.deleteSheet.bind(this, sheet.get('key')) } confirmMessage="Really delete forever?" ><FaTrash /></Button>
              </div>
            </SheetBlock>
          </div> ) ) : null }
          { (firebaseConnectDone && sheets.size === 0) ? <Alert warning className={styles.Blocks_alert} >No sheet found</Alert> : null }
        </div>
      </div>
    );
  }
}
