import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert, Editable, SheetList, FormGroup, Input } from 'components';

@connect(
  (state) => ({
    user: state.firebase.get('user')
  })
)
@myFirebaseConnect([
  {
    path: '/campaigns/',
    pathResolver: (path, {params = {}})=>(
      console.log('pathResolver params', params),
      path + params.key
    ),
    adapter: (snapshot)=>(
      console.log('snapshot campaign', snapshot, snapshot.val()),
      { campaign: fromJS(snapshot.val()) || undefined }
    ),
  },
  {
    path: '/sheets',
    adapter: (snapshot)=>(
      console.log('snapshot campaign', snapshot, snapshot.val()),
      { availableSheets: fromJS(snapshot.val()) || undefined }
    ),
  }
])
export default class CampaignDetail extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  @autobind
  toggleSheetSelection(sheet) {
    console.log('toggleSheetSelection', sheet);
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
    availableSheets = Map(),
    selection = Map(),
    params = {},
    user
  }) {
    const styles = require('./CampaignDetail.scss');
    const { sheetKeys = Map(), key: campaignKey, documents = Map() } = (campaign ? campaign.toObject() : {});
    const sheets = availableSheets.filter((sheet = Map())=>( sheetKeys.includes(sheet.get('key')) ));
    console.log('CampaignDetail sheets', sheetKeys.toJS(), sheets.toJS() );
    console.log('CampaignDetail prop keys, props', Object.keys(this.props), this.props);
    console.log('CampaignDetail campaign', campaign && campaign.toJS() );

    const addExistingSheetOptions = availableSheets
      .filter( (availableSheet)=>( !sheets.includes(availableSheet) ) )
      .map( (availableSheet)=>({ label: availableSheet.get('name'), value: availableSheet.get('key') } ) )
    ;

    const sheetsBlock = (<div className={styles.CampaignDetail_sheets} >
      <h2>Sheets</h2>
      { sheets.size ? <SheetList
        sheets={sheets}
        selection={selection}
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
        <Link to={'/campaign/' + campaignKey + '/new-sheet'} ><Button primary >Assign new sheet</Button></Link>
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
        <Helmet title="CampaignDetail"/>
        { campaign ?
          (<div className={ styles.CampaignDetail + '-content' }>
            <h1>Campaign: <Editable type="text" onSubmit={this.updateCampaign} onSubmitParams={{ path: 'name' }} >{ campaign.get('name') || campaign.get('key') }</Editable></h1>
            { sheetsBlock }
            { documentsBlock }
          </div>)
         : <Alert className={styles['CampaignDetail-notFoung']} warning >Campaign { params.key } not found. Back to <Link to="/campaigns" ><Button primary >Campaign Overview</Button></Link></Alert> }

      </div>
    );
  }
}
