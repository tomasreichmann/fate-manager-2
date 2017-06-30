import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { myFirebaseConnect, updateDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert, Editable } from 'components';

@connect(
  (state) => ({
    user: state.firebase.get('user')
  }),
  {
    pushState: push
  }
)
@myFirebaseConnect([
  {
    path: '/campaigns/',
    pathResolver: (path, {params = {}})=>(
      console.log('pathResolver params', params),
      path + params.campaignKey
    ),
    adapter: (snapshot, {params = {}})=>{
      console.log('snapshot campaign', snapshot, snapshot.val());
      const campaign = fromJS(snapshot.val()) || undefined;
      return {
        campaign: fromJS(snapshot.val()) || undefined,
        doc: campaign && campaign.getIn(['documents', params.docKey]) || undefined,
      };
    },
  }
])
export default class DocumentDetail extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    doc: PropTypes.object,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
  };

  @autobind
  updateDocument({ path }, value, method) {
    const { campaign, doc } = this.props;
    console.log('updateDocument', path, value, method);
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/' + path, value, method);
  }

  @injectProps
  render({
    campaign,
    doc,
    params = {},
  }) {
    const styles = require('./DocumentDetail.scss');
    const { contentElements = Map() } = (doc ? doc.toObject() : {});
    console.log('DocumentDetail campaign', campaign && campaign.toJS() );
    console.log('DocumentDetail doc', doc && doc.toJS() );
    console.log('DocumentDetail contentElements', contentElements && contentElements.toJS() );

    return (
      <div className={ styles.DocumentDetail + ' container' }>
        <Helmet title="DocumentDetail"/>
        { doc ?
          (<div className={ styles.DocumentDetail + '-content' }>
            <h1><Editable type="text" onSubmit={this.updateDocument} onSubmitParams={{ path: 'name' }} >{ doc.get('name') || doc.get('key') }</Editable></h1>
          </div>)
         : <Alert className={styles['DocumentDetail-notFoung']} warning >Document { params.key } not found. Back to <Link to="/campaigns" ><Button link>Campaign Overview</Button></Link></Alert> }
      </div>
    );
  }
}
