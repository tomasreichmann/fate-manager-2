import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert, Editable, SheetList, FormGroup, Input } from 'components';

@connect(
  (state) => ({
    user: state.firebase.get('user')
  }),
  {
    pushState: push
  }
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
    updateDb('/campaigns/' + this.props.campaign.get('key') + '/sheetKeys', sheetKey, 'push');
  }

  @autobind
  handleChange({ path }, value) {
    const { campaign } = this.props;
    console.log('handleChange', path, value);
    updateDb('/campaigns/' + campaign.get('key') + '/' + path, value);
  }

  @injectProps
  render({campaign, availableSheets = Map(), selection = Map(), pushState, params = {}, user}) {
    const styles = require('./CampaignDetail.scss');
    const { sheetKeys = Map(), key: campaignKey } = (campaign ? campaign.toObject() : {});
    const sheets = availableSheets.filter((sheet = Map())=>( sheetKeys.includes(sheet.get('key')) ));
    console.log('CampaignDetail sheets', sheetKeys.toJS(), sheets.toJS() );
    console.log('CampaignDetail prop keys, props', Object.keys(this.props), this.props);
    console.log('CampaignDetail campaign', campaign && campaign.toJS() );

    const sheetsBlock = (<div className={styles.CampaignDetail_sheets} >
      <h2>Sheets</h2>
      { sheets.size ? <SheetList sheets={sheets} selection={selection} toggleSheetSelection={this.toggleSheetSelection} pushState={pushState} user={user} />
      : <Alert warning >No sheets assigned to campaign yet</Alert>}
      <FormGroup>
        <Input
          type="select"
          inputRef={(addExistingSheetSelect)=>(this.addExistingSheetSelect = addExistingSheetSelect)}
          options={availableSheets.map( (availableSheet)=>({ label: availableSheet.get('name'), value: availableSheet.get('key') } ) )}
        />
        <Button success onClick={this.addExistingSheet} >Add existing sheet</Button>
        <Link to={'/campaign/' + campaignKey + '/new-sheet'} ><Button primary >Add new sheet</Button></Link>
      </FormGroup>
    </div>);

    return (
      <div className={ styles.CampaignDetail + ' container' }>
        <Helmet title="CampaignDetail"/>
        { campaign ?
          (<div className={ styles.CampaignDetail + '-content' }>
            <h1>Campaign: <Editable type="text" onSubmit={this.handleChange} onSubmitParams={{ path: 'name' }} >{ campaign.get('name') || campaign.get('key') }</Editable></h1>
            { sheetsBlock }
          </div>)
         : <Alert className={styles['CampaignDetail-notFoung']} warning >Campaign { params.key } not found. Back to <Button primary onClick={pushState} onClickParams="/campaigns" >Campaign Overview</Button></Alert> }

      </div>
    );
  }
}
