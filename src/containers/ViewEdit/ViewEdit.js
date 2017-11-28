import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert, Editable, FormGroup, User, AccessControls } from 'components';
import { FaExternalLink } from 'react-icons/lib/fa';

@connect(
  (state) => ({
    user: state.firebase.get('user'),
    users: state.app.get('users')
  })
)
@myFirebaseConnect([
  {
    path: '/views/',
    pathResolver: (path, {params = {}})=>(
      path + params.key
    ),
    adapter: (snapshot)=>(
      { view: fromJS(snapshot.val()) || undefined }
    ),
  }
])
export default class ViewEdit extends Component {
  static propTypes = {
    view: PropTypes.object,
    user: PropTypes.object,
    params: PropTypes.object.isRequired,
  };

  @autobind
  updateView(value, { path }) {
    const { view } = this.props;
    updateDb('/views/' + view.get('key') + '/' + path, value);
  }

  @injectProps
  render({
    view,
    firebaseConnectDone,
    params = {},
    users
  }) {
    const styles = require('./ViewEdit.scss');
    const { key, name } = (view ? view.toObject() : {});

    return (
      <div className={ styles.ViewEdit + ' container' }>
        <Helmet title={'ViewEdit ' + (name || key)}/>
        { !firebaseConnectDone ? <Alert className={styles.ViewEdit_loading} info >loading...</Alert> : null }
        { view ?
          (<div className={ styles.ViewEdit + '-content' }>
            <h1>
              <FormGroup childTypes={['flexible']} >
                <Editable type="text" onSubmit={this.updateView} onSubmitParams={{ path: 'name' }} >{ view.get('name') || view.get('key') }</Editable>
                <Link to={'/view/' + key } target="_blank" ><Button primary ><FaExternalLink /></Button></Link>
              </FormGroup>
            </h1>
            <FormGroup verticalCenter >
              <span>Created on {(new Date(view.get('created'))).toLocaleString()}</span>
              <span>by&emsp;<User uid={view.get('createdBy')} /></span>
            </FormGroup>
            <AccessControls
              access={view.get('access')}
              users={users}
              onChange={this.updateView}
              onChangeParams={{ path: 'access' }}
            />
          </div>)
         : <Alert className={styles['ViewEdit-notFoung']} warning >View { params.key } not found. Back to <Link to="/views" ><Button primary >Views</Button></Link></Alert> }
      </div>
    );
  }
}
