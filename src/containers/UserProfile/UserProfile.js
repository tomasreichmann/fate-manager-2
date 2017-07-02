import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { fromJS, Map } from 'immutable';
// import { Button, FormGroup, Input, Alert } from 'components';
import { Editable, FormGroup } from 'components';
import { myFirebaseConnect, getUser, getUserInterface } from '../../redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

@myFirebaseConnect([
  {
    path: '/users/',
    pathResolver: (path)=>(
      path + getUserInterface().uid
    ),
    adapter: (snapshot)=>(
      console.log('snapshot user', snapshot.val()),
      { userData: fromJS(snapshot.val()) || undefined}
    ),
  }
])
export default class UserProfile extends Component {
  static propTypes = {
    user: PropTypes.object,
  };
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.userInterface = getUserInterface();
    this.state = {
      userInfo: getUser()
    };
  }

  @autobind
  updateProfile(prop, value) {
    console.log('updateProfile', value, prop);
    if (prop) {
      this.userInterface
        .updateProfile({
          [prop]: value
        })
        .then( ()=>(
          this.setState({
            userInfo: getUser()
          })
        ), (error)=>(
          console.log('update failed', error)
        ) )
      ;
    }
  }

  @injectProps
  render() {
    const user = this.state.userInfo || Map();
    console.log('user', user.toJS());
    const styles = require('./UserProfile.scss');
    const name = (user.get('displayName') || user.get('uid'));

    return (
      <div className={styles.UserProfile}>
        <Helmet title={'User profile: ' + name }/>

        <div className="container">

          <h1>User profile: <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'displayName'} >{ name || ' ' }</Editable></h1>

          <FormGroup className={ styles.UserProfile_photo } >
            <img src={user.get('photoURL')} className={ styles.UserProfile_photo_img } />
            <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'photoURL'} >{ user.get('photoURL') || '-none-'}</Editable>
          </FormGroup>

        </div>

      </div>
    );
  }
}
