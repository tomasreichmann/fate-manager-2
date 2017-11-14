import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { Loading, Button, FormGroup, Alert, Image, User } from 'components';
import { myFirebaseConnect, updateDb } from '../../redux/modules/firebase';
import { openModal } from '../../redux/modules/modal';
import { connect } from 'react-redux';
import { injectProps } from 'relpers';
import { resolveAccess, hasLimitedAccess, sortByKey } from 'utils/utils';
import autobind from 'autobind-decorator';
import { FaQrcode, FaEdit, FaTrash, FaEyeSlash } from 'react-icons/lib/fa';

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
      <Image className={ styles.Views_qr } modeContain imageUrl={'http://api.qrserver.com/v1/create-qr-code/?color=000000&bgcolor=FFFFFF&data=' + encodeURIComponent(window.location.origin + '/view/' + viewKey) + '&qzone=1&margin=0&size=800x800&ecc=L'} />
    });
  }

  @injectProps
  render({views = Map(), user, firebaseConnectDone}) {
    const styles = require('./Views.scss');

    return (
      <div className={styles.Views}>
        <Helmet title="Views"/>
        <Loading show={!firebaseConnectDone} children="Loading..." />

        <div className="container">

          { (!user && firebaseConnectDone) ? <Alert className={styles.Views_notLoggedIn} warning >To use all features, you must <Link to="/login/views" ><Button link >log in.</Button></Link></Alert> : null }

          <div className={styles.Views_list} >
            { views.size ? views.filter( (view) => {
              return resolveAccess(view, user.get('uid'));
            })
            .sort( sortByKey('name') )
            .map( (view, viewKey)=>{
              const viewColumns = [
                <Link to={ '/view/' + viewKey } >
                  <Button block className="text-left" link>
                    {hasLimitedAccess(view) ? [<FaEyeSlash key="icon" />, ' '] : null}
                    {view.get('name') || viewKey}
                  </Button>
                </Link>,
                <div className={styles.Views_item_created} >
                  {(new Date(view.get('created'))).toLocaleString()}
                </div>,
                <User uid={view.get('createdBy')} />,
                <Button info onClick={this.openQrModal} onClickParams={viewKey} ><FaQrcode /></Button>,
              ];

              if (view.get('createdBy') === user.get('uid')) {
                viewColumns.push(
                  <Link to={ '/view/' + viewKey + '/edit' } ><Button warning ><FaEdit /></Button></Link>,
                  <Button danger onClick={ this.deleteView } onClickParams={viewKey} confirmMessage="Really remove view forever?" ><FaTrash /></Button>
                );
              }

              return (<FormGroup childTypes={['flexible']} children={viewColumns}/>);
            }) : <Alert>No views yet</Alert> }
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
