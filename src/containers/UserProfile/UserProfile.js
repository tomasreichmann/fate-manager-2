import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { fromJS, Map } from 'immutable';
// import { Button, FormGroup, Input, Alert } from 'components';
import { Editable, FormGroup } from 'components';
import { myFirebaseConnect, getUser, getUserInterface, updateDb } from '../../redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

@myFirebaseConnect([
  {
    path: '/users/',
    pathResolver: (path, props)=>(
      path + props.params.key
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
    params: PropTypes.object,
    userData: PropTypes.object,
  };
  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  constructor(props) {
    super(props);

    this.userInterface = getUserInterface();

    if (this.userInterface.uid === props.params.key) {
      this.state = {
        currentUser: true,
        userInfo: getUser()
      };
    } else {
      this.state = {
        currentUser: false,
      };
    }
  }

  @autobind
  updateProfile(prop, value) {
    console.log('updateProfile', value, prop);
    if (prop) {
      this.userInterface
        .updateProfile({
          [prop]: value
        })
        .then( ()=>{
          this.setState({
            userInfo: getUser()
          });
          updateDb('/users/' + this.userInterface.uid + '/' + prop, value);
        }, (error)=>(
          console.log('update failed', error)
        ) )
      ;
    }
  }

  @injectProps
  render() {
    const user = this.state.userInfo || this.props.userData || Map();
    const isCurrentUser = this.state.currentUser;
    console.log('user', user.toJS(), 'isCurrentUser', isCurrentUser);
    const styles = require('./UserProfile.scss');
    const name = (user.get('displayName') || user.get('uid'));

    return (
      <div className={styles.UserProfile}>
        <Helmet title={ name }/>

        <div className="container">

          <h1>User profile: { isCurrentUser ? <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'displayName'} >{ name || ' ' }</Editable> : name }</h1>

          <FormGroup className={ styles.UserProfile_photo } >
            <img src={user.get('photoURL')} className={ styles.UserProfile_photo_img } />
            {isCurrentUser ? <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'photoURL'} >{ user.get('photoURL') || '-none-'}</Editable> : null }
          </FormGroup>

        </div>

      </div>
    );
  }
}
