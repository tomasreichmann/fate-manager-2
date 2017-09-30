import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS, OrderedMap } from 'immutable';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import { Loading, Button, Alert, FormGroup, CampaignList } from 'components';
import { Link } from 'react-router';
import autobind from 'autobind-decorator';
import { FaPlus } from 'react-icons/lib/fa';

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
        <Helmet title="Campaigns"/>
        <Loading show={!firebaseConnectDone} children="Loading" />

        <h1>Campaign Overview</h1>
        { !user ? <Alert className={styles['Blocks-notLoggedIn']} warning >To use all features, you must <Link to="/login/campaigns" ><Button link >log in.</Button></Link></Alert> : null }

        <div className={ styles['CampaignOverview-list'] }>
          <CampaignList campaigns={campaigns} user={user} />
        </div>

        <FormGroup childTypes={[null]}>
          <Button disabled={!user} block success onClick={pushState.bind(this, '/campaign/new/' )} ><FaPlus /> New campaign</Button>
        </FormGroup>

      </div>
    );
  }
}
