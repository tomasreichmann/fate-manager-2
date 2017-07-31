import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Map, OrderedMap, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import { sortByKey } from 'utils/utils';
import autobind from 'autobind-decorator';
import { Loading, Button, Alert, Editable, SheetList, FormGroup, Input } from 'components';

@connect(
  (state) => ({
    user: state.firebase.get('user'),
    templates: state.firebase.getIn(['templates', 'list']),
  }),
  {
    pushState: push,
  }
)
@myFirebaseConnect([
  {
    path: '/campaigns/',
    pathResolver: (path, {params = {}})=>(
      console.log('campaign pathResolver params', params),
      path + params.key
    ),
    adapter: (snapshot)=>{
      console.log('campaign snapshot', snapshot, snapshot.val());
      return { campaign: fromJS(snapshot.val()) || undefined };
    },
  },
  {
    path: '/sheets',
    adapter: (snapshot)=>{
      let availableSheets = new OrderedMap();
      snapshot.forEach( (child)=>{
        availableSheets = availableSheets.set(child.val().key, fromJS(child.val()));
      });
      console.log('CampaignOverview snapshot availableSheets', availableSheets.toJS() );
      return { availableSheets };
    },
    orderByChild: 'name',
  },
  {
    path: '/users',
    adapter: (snapshot)=>{
      let availablePlayers = new OrderedMap();
      snapshot.forEach( (child)=>{
        availablePlayers = availablePlayers.set(child.val().uid, fromJS(child.val()));
      });
      console.log('CampaignOverview snapshot availablePlayers', availablePlayers.toJS() );
      return { availablePlayers };
    },
    orderByChild: 'displayName',
  }
])
export default class CampaignDetail extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    firebaseConnectDone: PropTypes.bool,
    params: PropTypes.object.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      selectedSheets: {}
    };
  }

  @autobind
  toggleSheetSelection(keys) {
    console.log('toggleSheetSelection', keys);
    const sheetKeys = Array.isArray(keys) ? keys : [keys];
    const selectedSheets = sheetKeys.reduce( (updatedSelectedKeys, sheetKey) => (
      {
        ...updatedSelectedKeys,
        [sheetKey]: !updatedSelectedKeys[sheetKey],
      }
    ), this.state.selectedSheets );

    this.setState({
      selectedSheets
    });
  }

  @autobind
  addExistingSheet() {
    console.log('addExistingSheet');
    const sheetKey = this.addExistingSheetSelect.value;
    if (sheetKey) {
      updateDb('/campaigns/' + this.props.campaign.get('key') + '/sheetKeys/' + sheetKey, sheetKey, 'set');
    }
  }

  @autobind
  assignNewSheet() {
    const templateKey = this.newSheetTemplateSelect.value;
    this.props.pushState('/campaign/' + this.props.campaign.get('key') + '/new-sheet/' + templateKey);
  }

  @autobind
  assignPlayer() {
    console.log('assignPlayer');
    const playerKey = this.assignPlayerSelect.value;
    if (playerKey) {
      updateDb('/campaigns/' + this.props.campaign.get('key') + '/playerKeys/' + playerKey, playerKey, 'set');
    }
  }

  @autobind
  unassignPlayer(playerKey) {
    console.log('unassignPlayer', playerKey);
    if (playerKey) {
      updateDb('/campaigns/' + this.props.campaign.get('key') + '/playerKeys/' + playerKey, null);
    }
  }

  @autobind
  removeSheetFromCampaign(sheetKey) {
    console.log('removeSheetFromCampaign', sheetKey);
    if (sheetKey) {
      updateDb('/campaigns/' + this.props.campaign.get('key') + '/sheetKeys/' + sheetKey, null);
    }
  }

  @autobind
  deleteDocument(docKey) {
    console.log('deleteDocument', docKey);
    if (docKey) {
      updateDb('/campaigns/' + this.props.campaign.get('key') + '/documents/' + docKey, null);
    }
  }

  @autobind
  updateCampaign({ path }, value) {
    const { campaign } = this.props;
    console.log('updateCampaign', path, value);
    updateDb('/campaigns/' + campaign.get('key') + '/' + path, value);
  }

  @injectProps
  render({
    campaign,
    templates,
    availableSheets = new OrderedMap(),
    availablePlayers = new OrderedMap(),
    params = {},
    user,
    firebaseConnectDone,
  }) {
    const styles = require('./CampaignDetail.scss');
    const { sheetKeys = Map(), playerKeys = Map(), key: campaignKey, documents = Map() } = (campaign ? campaign.toObject() : {});
    const sheets = availableSheets.filter((sheet = Map())=>( sheetKeys.includes(sheet.get('key')) ));
    const players = availablePlayers.filter((player = Map())=>( playerKeys.includes(player.get('uid')) ));
    const CampaignDetailInstance = this;
    console.log('CampaignDetail sheets', sheetKeys.toJS(), sheets.toJS() );
    console.log('CampaignDetail prop keys, props', Object.keys(this.props), this.props);
    console.log('CampaignDetail campaign', campaign && campaign.toJS() );

    const assignPlayerOptions = availablePlayers
      .filter( (availablePlayer)=>( !players.includes(availablePlayer) ) )
      .map( (availablePlayer)=>({ label: availablePlayer.get('displayName'), value: availablePlayer.get('uid') } ) )
    ;

    const playersBlock = (<div className={styles.CampaignDetail_players} >
      <h2>Players</h2>
      <div className={styles.CampaignDetail_documents_list} >
      { players.size ? players.sort(sortByKey('displayName')).map( (player, playerKey) => (
        <FormGroup key={playerKey} childTypes={['flexible', null]} >
          <Link to={'/user/' + playerKey} ><Button link >{availablePlayers.getIn([playerKey, 'displayName']) || availablePlayers.getIn([playerKey, 'uid'])}</Button></Link>
          <Button warning onClick={ this.unassignPlayer } onClickParams={playerKey} confirmMessage="Really unassign?" >Unassign</Button>
        </FormGroup>
      ) )
      : <Alert warning >No players yet</Alert>}
      </div>
      <FormGroup>
        <Input
          type="select"
          inputRef={(assignPlayerSelect)=>(this.assignPlayerSelect = assignPlayerSelect)}
          options={assignPlayerOptions}
        />
        <Button disabled={!assignPlayerOptions.size} success onClick={this.assignPlayer} >Assign player</Button>
      </FormGroup>
    </div>);

    const addExistingSheetOptions = availableSheets
      .filter( (availableSheet)=>( !sheets.includes(availableSheet) ) )
      .map( (availableSheet)=>({ label: availableSheet.get('name'), value: availableSheet.get('key') } ) )
    ;

    const selectedSheets = fromJS(this.state.selectedSheets);

    const sheetsBlock = (<div className={styles.CampaignDetail_sheets} >
      <h2>Sheets</h2>
      { sheets.size ? <SheetList
        sheets={sheets}
        selection={selectedSheets}
        toggleSheetSelection={this.toggleSheetSelection}
        user={user}
        actions={[<Button onClick={this.removeSheetFromCampaign} warning >Unassign</Button>]}
      />
      : <Alert warning >No sheets assigned to campaign yet</Alert>}
      <FormGroup>
        <Input
          type="select"
          inputRef={(addExistingSheetSelect)=>(this.addExistingSheetSelect = addExistingSheetSelect)}
          options={addExistingSheetOptions}
        />
        <Button disabled={!addExistingSheetOptions.size} success onClick={this.addExistingSheet} >Assign sheet</Button>
      </FormGroup>
      <FormGroup>
        <Input
          type="select"
          options={templates.map( (template)=>( { label: template.get('name'), value: template.get('key') } ) )}
          label="template"
          inputRef={ (select)=>(CampaignDetailInstance.newSheetTemplateSelect = select) }
        />
        <Button primary onClick={ this.assignNewSheet } >Assign new sheet</Button>
      </FormGroup>
    </div>);

    const documentsBlock = (<div className={styles.CampaignDetail_documents} >
      <h2>Documents</h2>
      <div className={styles.CampaignDetail_documents_list} >
      { documents.size ? documents.map( (doc, docKey) => (
        <FormGroup key={docKey} childTypes={['flexible', null]} >
          <Link to={'/campaign/' + campaignKey + '/document/' + docKey} ><Button link >{doc.get('name')}</Button></Link>
          <Button danger onClick={ this.deleteDocument } onClickParams={docKey} confirmMessage="Really delete?" >Delete</Button>
        </FormGroup>
      ) )
      : <Alert warning >No documents yet</Alert>}
      </div>
      <FormGroup>
        <Link to={'/campaign/' + campaignKey + '/new-document'} ><Button primary >Create new document</Button></Link>
      </FormGroup>
    </div>);

    return (
      <div className={ styles.CampaignDetail + ' container' }>
        <Loading show={!firebaseConnectDone} children="Loading" />
        { campaign ?
          (<div className={ styles.CampaignDetail + '-content' }>
            <Helmet title={(campaign.get('name') || campaign.get('key')) + ' campaign'}/>
            <h1>Campaign: <Editable type="text" onSubmit={this.updateCampaign} onSubmitParams={{ path: 'name' }} >{ campaign.get('name') || campaign.get('key') }</Editable></h1>
            { playersBlock }
            { sheetsBlock }
            { documentsBlock }
          </div>)
         : <Alert className={styles['CampaignDetail-notFoung']} warning >Campaign { params.key } not found. Try refreshing or back to <Link to="/campaigns" ><Button primary >Campaign Overview</Button></Link></Alert> }

      </div>
    );
  }
}
