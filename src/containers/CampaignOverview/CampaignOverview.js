import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS, OrderedMap } from 'immutable';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import { Loading, Button, Alert, FormGroup } from 'components';
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
    adapter: (snapshot)=>{
      let campaigns = new OrderedMap();
      snapshot.forEach( (child)=>{
        campaigns = campaigns.set(child.val().key, fromJS(child.val()));
      });
      console.log('CampaignOverview snapshot new campaigns', 'campaigns', campaigns.toJS() );
      return { campaigns };
    },
    orderByChild: 'name',
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
    updateDb('/campaigns/' + key, null);
  }

  @injectProps
  render({campaigns = new OrderedMap(), user, pushState, firebaseConnectDone}) {
    const styles = require('./CampaignOverview.scss');

    return (
      <div className={ styles.CampaignOverview + ' container' }>
        <Helmet title="CampaignOverview"/>
        <Loading show={!firebaseConnectDone} children="Loading" />

        <h1>Campaign Overview</h1>
        { !user ? <Alert className={styles['Blocks-notLoggedIn']} warning >To use all features, you must <Link to="/login/campaigns" ><Button link >log in.</Button></Link></Alert> : null }

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
