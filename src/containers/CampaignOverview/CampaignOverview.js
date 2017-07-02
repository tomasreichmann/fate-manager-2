import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { myFirebaseConnect } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import { Button, Alert, FormGroup } from 'components';
import { Link } from 'react-router';
import autobind from 'autobind-decorator';

@connect(
  state => ({
    user: state.firebase.get('user')
  }),
  {
    pushState: push
  }
)
@myFirebaseConnect([
  {
    path: '/campaigns',
    adapter: (snapshot)=>(
      console.log('snapshot', snapshot, snapshot.val()),
      { campaigns: fromJS(snapshot.val()) || Map() }
    ),
  }
])
export default class CampaignOverview extends Component {
  static propTypes = {
    campaigns: PropTypes.object,
    user: PropTypes.object,
    firebaseConnectDone: PropTypes.bool,
    pushState: PropTypes.func.isRequired,
  };

  @autobind
  deleteCampaign(key) {
    console.log('deleteCampaign', key);
  }

  @injectProps
  render({campaigns = Map(), user, pushState, firebaseConnectDone}) {
    const styles = require('./CampaignOverview.scss');

    console.log('firebaseConnectDone', firebaseConnectDone);

    return (
      <div className={ styles.CampaignOverview + ' container' }>
        <Helmet title="CampaignOverview"/>
        <h1>Campaign Overview</h1>
        { !firebaseConnectDone ? <Alert className={styles['Blocks-loading']} info >loading...</Alert> : null }
        { (!user && firebaseConnectDone) ? <Alert className={styles['Blocks-notLoggedIn']} warning >To use all features, you must <Link to="/login/campaigns" ><Button link >log in.</Button></Link></Alert> : null }

        <div className={ styles['CampaignOverview-list'] }>
          { campaigns.size ? campaigns.map( (campaign)=>(
            <FormGroup childTypes={['flexible', null]} className={styles['CampaignOverview-item']} key={campaign.get('key')} >
              <div className={styles['CampaignOverview-item-title']} >
                <Button link className="text-left" block onClick={pushState.bind(this, '/campaign/' + encodeURIComponent(campaign.get('key')) )} >{campaign.get('name') || campaign.get('key')}</Button>
              </div>
              <div className={styles['CampaignOverview-item-actions']} >
                <Button danger disabled={!user} onClick={ this.deleteCampaign } onClickParams={campaign.get('key')} confirmMessage="Really delete?" >Delete</Button>
              </div>
            </FormGroup>
          ) ) : <Alert warning >No campaigns available</Alert> }
        </div>

        <FormGroup childTypes={[null]}>
          <Button disabled={!user} block success onClick={pushState.bind(this, '/campaign/new/' )} >New campaign</Button>
        </FormGroup>

      </div>
    );
  }
}
