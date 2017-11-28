import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS, Map, OrderedMap } from 'immutable';
import { connect } from 'react-redux';
import { injectProps } from 'relpers';
import sortByKey from '../../helpers/sortByKey';
import autobind from 'autobind-decorator';

import { myFirebaseConnect, getUserInterface, updateDb } from '../../redux/modules/firebase';
import { Editable, FormGroup, SheetList, CampaignList, Alert } from 'components';

@connect(
  (state, props) => {
    const uid = props.params.key;
    const currentUser = state.firebase.get('user');
    const isCurrentUser = currentUser.get('uid') === uid;
    const users = state.app.get('users');

    return {
      uid,
      user: users.get(uid),
      currentUser: currentUser,
      isCurrentUser,
    };
  }
)
@myFirebaseConnect([
  {
    path: '/sheets',
    orderByChild: 'createdBy',
    equalTo: (props) => ( props.params.key ),
    adapter: (snapshot)=>(
      { sheets: snapshot.val() ? fromJS(snapshot.val()).sort(sortByKey('name')) : new OrderedMap() }
    ),
  },
  {
    path: '/campaigns',
    orderByChild: 'createdBy',
    equalTo: (props) => ( props.params.key ),
    adapter: (snapshot)=>(
      { campaigns: snapshot.val() ? fromJS(snapshot.val()).sort(sortByKey('name')) : new OrderedMap() }
    ),
  }
])
export default class UserProfile extends Component {
  static propTypes = {
    user: PropTypes.object,
    params: PropTypes.object,
    userData: PropTypes.object,
  };

  constructor(props) {
    super(props);
    this.userInterface = getUserInterface();
  }

  @autobind
  updateProfile(value, prop) {
    if (prop) {
      this.userInterface
        .updateProfile(this.props.user.set(prop, value).toJS())
        .then( ()=>{
          updateDb('/users/' + this.props.uid + '/' + prop, value);
        }, (error)=>(
          console.error('update failed', error)
        ) )
      ;
    }
  }

  @injectProps
  render({
    sheets = new OrderedMap(),
    campaigns = new OrderedMap(),
    uid,
    isCurrentUser,
    currentUser = new Map(),
    user = new Map({uid: this.props.uid})
  }) {
    const styles = require('./UserProfile.scss');
    if (!uid) {
      return (<div className={styles.UserProfile}>
        <Helmet title={'User not found'}/>
        <Alert>User not found</Alert>
      </div>);
    }
    const name = (user.get('displayName') || uid);

    return (
      <div className={styles.UserProfile}>
        <Helmet title={ name }/>
        <div className="container">
          <h1>{ isCurrentUser
            ? <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'displayName'} placeholder="please fill in name" >
                { name || ' ' }
              </Editable>
            : name
          }</h1>

          {user.get('created') ? <p>Created {(new Date(user.get('created'))).toLocaleString()}</p> : null}

          <FormGroup className={ styles.UserProfile_photo } childTypes={[null, 'flexible']} >
            <img src={user.get('photoURL')} className={ styles.UserProfile_photo_img } />
            <div>
              <h3>Image URL</h3>
              {isCurrentUser ? <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'photoURL'} placeholder="https://i.imgur.com/VSCr50R.gif">{ user.get('photoURL') || '-none-'}</Editable> : null }
            </div>
          </FormGroup>

          <h2>Created campaigns</h2>
          <CampaignList campaigns={campaigns.filter( (campaign) => ( campaign.get('createdBy') === user.get('uid') ) )} user={currentUser} />

          <h2>Player in campaigns</h2>
          <CampaignList campaigns={campaigns.filter( (campaign) => ( !!campaign.getIn(['playerKeys', user.get('uid')]) ) )} user={currentUser} />

          <h2>Created sheets</h2>
          <SheetList sheets={sheets} user={currentUser} />

        </div>
      </div>
    );
  }
}
