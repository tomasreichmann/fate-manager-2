import React, { Component, PropTypes } from 'react';
// import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { fromJS, Map, OrderedMap } from 'immutable';
// import { Button, FormGroup, Input, Alert } from 'components';
import { Editable, FormGroup, SheetList } from 'components';
import { myFirebaseConnect, getUser, getUserInterface, updateDb } from '../../redux/modules/firebase';
import { injectProps } from 'relpers';
import sortByKey from '../../helpers/sortByKey';
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
  },
  {
    path: '/sheets',
    orderByChild: 'createdBy',
    equalTo: (props) => ( props.params.key ),
    adapter: (snapshot)=>(
      { sheets: snapshot.val() ? fromJS(snapshot.val()).sort(sortByKey('name')) : new OrderedMap() }
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
  updateProfile(value, prop) {
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
  render({sheets = Map()}) {
    const user = this.state.userInfo || this.props.userData || Map();
    const isCurrentUser = this.state.currentUser;
    console.log('UserProfile user', user.toJS(), 'isCurrentUser', isCurrentUser);
    console.log('UserProfile sheets', sheets.toJS());
    const styles = require('./UserProfile.scss');
    const name = (user.get('displayName') || user.get('uid'));

    return (
      <div className={styles.UserProfile}>
        <Helmet title={ name }/>

        <div className="container">

          <h1>{ isCurrentUser ? <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'displayName'} placeholder="please fill in name" >{ name || ' ' }</Editable> : name }</h1>

          <FormGroup className={ styles.UserProfile_photo } childTypes={[null, 'flexible']} >
            <img src={user.get('photoURL')} className={ styles.UserProfile_photo_img } />
            <div>
              <h3>Image URL</h3>
              {isCurrentUser ? <Editable type="text" onSubmit={this.updateProfile} onSubmitParams={'photoURL'} >{ user.get('photoURL') || '-none-'}</Editable> : null }
            </div>
          </FormGroup>

          <h2>Created sheets</h2>

          <SheetList sheets={sheets} user={user} />

        </div>

      </div>
    );
  }
}
