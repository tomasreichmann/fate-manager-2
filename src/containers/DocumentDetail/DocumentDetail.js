import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import { myFirebaseConnect, updateDb, pushToDb } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Alert, Editable, FormGroup, Input } from 'components';
import contentComponents from 'contentComponents';

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
        campaign: campaign,
        doc: campaign && campaign.getIn(['documents', params.docKey]) || undefined,
      };
    },
  },
  {
    path: '/views',
    adapter: (snapshot)=>{
      console.log('snapshot views', snapshot, snapshot.val());
      const views = fromJS(snapshot.val()) || undefined;
      return {
        views: views,
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

  constructor(props) {
    super(props);
    this.addContentSelects = {};
    this.sendToViewSelects = {};
  }

  @autobind
  updateDocument({ path }, value, method) {
    const { campaign, doc } = this.props;
    console.log('updateDocument', path, value, method);
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/' + path, value, method);
  }

  @autobind
  addContent(position) {
    const { campaign, doc } = this.props;
    const selectedElement = this.addContentSelects[position].value;
    const data = {
      component: selectedElement,
    };
    console.log('addContent', selectedElement);
    pushToDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/contentElements', (key) => ( {
      key,
      ...data,
    } ) );
  }

  @autobind
  updateContent(value, {key, path}) {
    const { campaign, doc } = this.props;
    console.log('updateContent', key, path, value, 'campaign', campaign, doc);
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/contentElements/' + key + '/' + path, value);
  }

  @autobind
  removeContent(key) {
    const { campaign, doc } = this.props;
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/contentElements/' + key, null);
  }

  @autobind
  sendToView({key, clear}) {
    console.log('sendToView', key, this.sendToViewSelects, this.sendToViewSelects[key]);
    const { doc } = this.props;
    const viewKey = this.sendToViewSelects[key].value;
    const contentElements = key === 'doc' ? doc.get('contentElements') : Map({key: doc.getIn(['contentElements', key])});
    updateDb('/views/' + viewKey + '/contentElements', clear ? null : contentElements.toJSON());
  }

  @injectProps
  render({
    doc,
    views = Map(),
    params = {},
  }) {
    const styles = require('./DocumentDetail.scss');

    const {
      contentElements = Map()
    } = (doc ? doc.toObject() : {});

    const viewOptions = views.map( (view, viewKey)=>({
      label: view.get('name') || viewKey,
      value: viewKey
    }) );

    const contentElementOptions = Map(contentComponents).map( (value, label) => ({
      label,
      value: label
    }) ).toList().toJSON();
    // console.log('contentElementOptions', contentElementOptions );
    // console.log('contentComponents', contentComponents );

    const DocumentDetailInstance = this;

    // console.log('DocumentDetail campaign', campaign && campaign.toJS() );
    // console.log('DocumentDetail doc', doc && doc.toJS() );
    // console.log('DocumentDetail contentElements', contentElements && contentElements.toJS() );

    const contentBlock = (<div className={ styles.DocumentDetail_contentBlock } >
      { contentElements.size ? contentElements.map( (componentElement, key)=>{
        const {component, componentProps = {}, preview} = componentElement ? componentElement.toJS() : {};
        const ContentElement = contentComponents[component];
        // console.log('componentElement', componentElement, component, componentProps, ContentElement);
        if (!ContentElement) {
          return <Alert warning>Malformed component</Alert>;
        }
        return (<div className={ styles.DocumentDetail_contentElement } key={key}>
          <FormGroup childTypes={['flexible']}>
            <strong>{component}</strong>
            <Input inline type="checkbox" label="Preview" value={preview} handleChange={this.updateContent} handleChangeParams={{key, path: 'preview'}} />
            <Button danger confirmMessage="Really permanently remove?" onClick={this.updateContent} onClick={this.removeContent} onClickParams={key} >Remove</Button>
          </FormGroup>
          <ContentElement {...componentProps} preview={preview} handleChange={this.updateContent} handleChangeParams={{key}} />
          <FormGroup childTypes={['flexible']}>
            <div></div>
            <Input inline type="select" options={ viewOptions } inputRef={ (sendToViewSelect)=>(DocumentDetailInstance.sendToViewSelects[key] = sendToViewSelect) } />
            <Button secondary onClick={this.sendToView} onClickParams={{key}} >Send</Button>
          </FormGroup>
          <hr />
        </div>);
      } ) :
        <Alert warning>No content yet. Add Some</Alert> }
      <hr />
      <FormGroup>
        <Input type="select" options={ contentElementOptions } inputRef={ (addContentSelect)=>(this.addContentSelects.last = addContentSelect) } />
        <Button primary onClick={this.addContent} onClickParams="last" >Add</Button>
      </FormGroup>
    </div>);


    return (
      <div className={ styles.DocumentDetail + ' container' }>
        <Helmet title="DocumentDetail"/>
        { doc ?
          (<div className={ styles.DocumentDetail + '-content' }>
            <h1>
              <FormGroup childTypes={['flexible']} >
                <Editable type="text" onSubmit={this.updateDocument} onSubmitParams={{ path: 'name' }} >{ doc.get('name') || doc.get('key') }</Editable>
                <Input inline type="select" options={ viewOptions } inputRef={ (sendToViewSelect)=>(DocumentDetailInstance.sendToViewSelects.doc = sendToViewSelect) } />
                <Button secondary onClick={this.sendToView} onClickParams={{ key: 'doc' }} >Send</Button>
                <Button warning onClick={this.sendToView} onClickParams={{ key: 'doc', clear: true }} >Clear</Button>
              </FormGroup>
            </h1>
            { contentBlock }
          </div>)
         : <Alert className={styles['DocumentDetail-notFoung']} warning >Document { params.key } not found. Back to <Link to="/campaigns" ><Button link>Campaign Overview</Button></Link></Alert> }
      </div>
    );
  }
}
