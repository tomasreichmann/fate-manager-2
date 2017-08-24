import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert, Editable, FormGroup } from 'components';

@connect(
  (state) => ({
    user: state.firebase.get('user')
  })
)
@myFirebaseConnect([
  {
    path: '/views/',
    pathResolver: (path, {params = {}})=>(
      console.log('pathResolver params', params),
      path + params.key
    ),
    adapter: (snapshot)=>(
      console.log('snapshot view', snapshot, snapshot.val()),
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
    console.log('updateView', path, value);
    updateDb('/views/' + view.get('key') + '/' + path, value);
  }

  @injectProps
  render({
    view,
    firebaseConnectDone,
    params = {}
  }) {
    const styles = require('./ViewEdit.scss');
    const { key, name } = (view ? view.toObject() : {});
    console.log('ViewEdit view', view && view.toJS() );
    console.log('ViewEdit key', key, 'name', name );
    console.log('ViewEdit prop keys, props', Object.keys(this.props), this.props);

    return (
      <div className={ styles.ViewEdit + ' container' }>
        <Helmet title={'ViewEdit ' + (name || key)}/>
        { !firebaseConnectDone ? <Alert className={styles.ViewEdit_loading} info >loading...</Alert> : null }
        { view ?
          (<div className={ styles.ViewEdit + '-content' }>
            <h1>
              <FormGroup childTypes={['flexible']} >
                <Editable type="text" onSubmit={this.updateView} onSubmitParams={{ path: 'name' }} >{ view.get('name') || view.get('key') }</Editable>
                <Link to={'/view/' + key } ><Button link >Open view</Button></Link>
              </FormGroup>
            </h1>
          </div>)
         : <Alert className={styles['ViewEdit-notFoung']} warning >View { params.key } not found. Back to <Link to="/views" ><Button primary >Views</Button></Link></Alert> }
      </div>
    );
  }
}
