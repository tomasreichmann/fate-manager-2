import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { fromJS, Map } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert } from 'components';
import contentComponents from '../../contentComponents';

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
export default class View extends Component {
  static propTypes = {
    view: PropTypes.object,
    user: PropTypes.object,
    params: PropTypes.object.isRequired,
  };

  @autobind
  updateView({ path }, value) {
    const { view } = this.props;
    console.log('updateView', path, value);
    updateDb('/views/' + view.get('key') + '/' + path, value);
  }

  @injectProps
  render({
    view,
    firebaseConnectDone,
    params = {},
  }) {
    const styles = require('./View.scss');
    const { key, name, contentElements = Map() } = (view ? view.toObject() : {});
    console.log('View view', view && view.toJS() );
    console.log('View key', key, 'name', name );
    console.log('View prop keys, props', Object.keys(this.props), this.props);

    console.log('contentComponents', contentComponents);

    const contentBlock = contentElements.size ?
      contentElements.map( (contentElement, contentElementKey) => {
        const ContentComponent = contentComponents[contentElement.get('component')] || contentComponents.AlertContent;
        const componentProps = (contentElement.get('componentProps') || Map()).toJSON();
        console.log('componentProps', componentProps, 'ContentComponent', ContentComponent);
        return <ContentComponent {...componentProps} key={contentElementKey} preview="true" />;
      } )
      : <Alert>Empty</Alert>
    ;

    return (
      <div className={ styles.View + ' container' }>
        <Helmet title={'View ' + (name || key)}/>
        { !firebaseConnectDone ? <Alert className={styles.ViewEdit_loading} info >loading...</Alert> : null }
        { view ?
          (<div className={ styles.View + '-content' }>
            <h1>{ view.get('name') || view.get('key') }</h1>
            { contentBlock }
          </div>)
         : <Alert className={styles['View-notFoung']} warning >View { params.key } not found. Back to <Link to="/views" ><Button primary >Views</Button></Link></Alert> }
      </div>
    );
  }
}
