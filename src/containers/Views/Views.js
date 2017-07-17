import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { Loading, Button, FormGroup, Alert, Image } from 'components';
import { myFirebaseConnect, updateDb } from '../../redux/modules/firebase';
import { openModal } from '../../redux/modules/modal';
import { connect } from 'react-redux';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

@connect(
  state => ({
    user: state.firebase.get('user')
  }),
  {
    openModal
  }
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
    openModal: PropTypes.func,
  };

  constructor(props) {
    super(props);
  }

  @autobind
  deleteView(viewKey) {
    console.log('deleteView', viewKey);
    updateDb('/views/' + viewKey, null);
  }

  @autobind
  openQrModal(viewKey) {
    const styles = require('./Views.scss');
    this.props.openModal({children:
      <Image className={ styles.Views_qr } modeContain imageUrl={'http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=' + encodeURIComponent(window.location.origin + '/views/' + viewKey) + '&qzone=1&margin=0&size=800x800&ecc=L'} />
    });
  }

  @injectProps
  render({views = Map(), user, firebaseConnectDone}) {
    const styles = require('./Views.scss');

    console.log('Views render', views && views.toJS() );

    return (
      <div className={styles.Views}>
        <Helmet title="Views"/>
        <Loading show={!firebaseConnectDone} children="Loading..." />

        <div className="container">

          { (!user && firebaseConnectDone) ? <Alert className={styles.Views_notLoggedIn} warning >To use all features, you must <Link to="/login/views" ><Button link >log in.</Button></Link></Alert> : null }

          <div className={styles.Views_list} >
            { views.size ? views.map( (view, viewKey)=>(
              <FormGroup childTypes={['flexible']} >
                <Link to={ '/view/' + viewKey } ><Button link>{view.get('name') || viewKey}</Button></Link>
                <Button info onClick={this.openQrModal} onClickParams={viewKey} >QR code</Button>
                <Link to={ '/view/' + viewKey + '/edit' } ><Button warning >Edit</Button></Link>
                <Button disabled={!user} onClick={this.deleteView} onClickParams={viewKey} danger confirmMessage="Really remove view forever?" >Delete</Button>
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
