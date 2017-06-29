import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert, Editable } from 'components';

@connect(
  () => ({
//    user: state.firebase.get('user')
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
  }
])
export default class CampaignDetail extends Component {
  static propTypes = {
    campaign: PropTypes.object,
//    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  @autobind
  handleChange({ path }, value) {
    const { campaign } = this.props;
    console.log('handleChange', path, value);
    updateDb('/campaigns/' + campaign.get('key') + '/' + path, value);
  }

  @injectProps
  render({campaign, pushState, params = {}}) {
    const styles = require('./CampaignDetail.scss');

    return (
      <div className={ styles.CampaignDetail + ' container' }>
        <Helmet title="CampaignDetail"/>
        { campaign ?
          (<div className={ styles.CampaignDetail + '-content' }>
            <h1>Campaign: <Editable type="text" onSubmit={this.handleChange} onSubmitParams={{ path: 'name' }} >{ campaign.get('name') || campaign.get('key') }</Editable></h1>
          </div>)
         : <Alert className={styles['CampaignDetail-notFoung']} warning >Campaign { params.key } not found. Back to <Button primary onClick={pushState} onClickParams="/campaigns" >Campaign Overview</Button></Alert> }
      </div>
    );
  }
}
