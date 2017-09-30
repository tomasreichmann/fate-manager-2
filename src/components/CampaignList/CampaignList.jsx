import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button, User, FormGroup, Alert } from 'components';
import { updateDb } from 'redux/modules/firebase';
import { OrderedMap } from 'immutable';
import { injectProps } from 'relpers';
import { FaTrash, FaUserTimes } from 'react-icons/lib/fa';

export default class CampaignList extends Component {

  static propTypes = {
    campaigns: PropTypes.object,
  };

  constructor(props) {
    super(props);
  }

  deleteCampaign(key) {
    updateDb('/campaigns/' + key, null);
  }

  @injectProps
  render({campaigns = new OrderedMap(), user}) {
    console.log('CampaignList campaigns', campaigns.toJS());
    console.log('CampaignList user', user);

    const styles = require('./CampaignList.scss');

    const filteredCampaigns = campaigns.filter( (campaign) => {
      return campaign.get('sharing') !== 'private' || user && campaign.get('createdBy') === user.get('uid');
    } );

    return (<div className={styles.CampaignList} >
      { filteredCampaigns.size ? filteredCampaigns.map( (campaign)=>(
        <FormGroup childTypes={['flexible', null]} className={styles['CampaignOverview-item']} key={campaign.get('key')} >
          <div className={styles['CampaignOverview-item-title']} >
            <Link to={'/campaign/' + encodeURIComponent(campaign.get('key'))} >
              <Button link className="text-left" block >
                {campaign.get('sharing') === 'private' ? [<FaUserTimes />, ' '] : null}
                {campaign.get('name') || campaign.get('key')}
              </Button>
            </Link>
          </div>
          <div className={styles['CampaignOverview-item-createdBy']} >
            <User uid={campaign.get('createdBy')} />
          </div>
          <div className={styles['CampaignOverview-item-actions']} >
            <Button danger disabled={!user || user.get('uid') !== campaign.get('createdBy')} onClick={ this.deleteCampaign } onClickParams={campaign.get('key')} confirmMessage="Really delete?" ><FaTrash /></Button>
          </div>
        </FormGroup>
      ) ) : <Alert warning >No campaigns</Alert> }
    </div>);
  }
}
