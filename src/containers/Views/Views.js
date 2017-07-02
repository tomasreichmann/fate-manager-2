import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { Button, FormGroup, Alert } from 'components';
import { myFirebaseConnect } from '../../redux/modules/firebase';
import { connect } from 'react-redux';
import { injectProps } from 'relpers';

@connect(
  state => ({
    user: state.firebase.get('user')
  })
)
@myFirebaseConnect([
  {
    path: '/views',
    adapter: (snapshot)=>(
      { views: fromJS(snapshot.val()) || undefined }
    ),
  }
])
export default class Views extends Component {
  static propTypes = {
    views: PropTypes.object,
    pushState: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  @injectProps
  render({views = Map(), user, firebaseConnectDone}) {
    const styles = require('./Views.scss');

    console.log('Views render', views && views.toJS() );

    return (
      <div className={styles.Views}>
        <Helmet title="Views"/>

        <div className="container">

          { !firebaseConnectDone ? <Alert className={styles.Views_loading} info >loading...</Alert> : null }
          { (!user && firebaseConnectDone) ? <Alert className={styles.Views_notLoggedIn} warning >To use all features, you must <Link to="/login/views" ><Button link >log in.</Button></Link></Alert> : null }

          <div className={styles.Views_list} >
            { views.size ? views.map( (view, viewKey)=>(
              <FormGroup childTypes={['flexible']} >
                <Link to={ '/view/' + viewKey } ><Button link>{view.get('name') || viewKey}</Button></Link>
                <Link to={ '/view/' + viewKey + '/edit' } ><Button warning >Edit</Button></Link>
              </FormGroup>
            ) ) : <Alert>No views yet</Alert> }
          </div>

          <hr />

          { user ? <FormGroup>
            <Link to="/view/new"><Button block primary>New view</Button></Link>
          </FormGroup> : null }

        </div>

      </div>
    );
  }
}
