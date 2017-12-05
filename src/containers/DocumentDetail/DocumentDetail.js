import React, { Component, PropTypes } from 'react';
import Helmet from 'react-helmet';
import { partial, range, get } from 'lodash';
import { Map, fromJS } from 'immutable';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { push } from 'react-router-redux';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';

import { myFirebaseConnect, updateDb, getPushKey } from 'redux/modules/firebase';
import { injectProps } from 'relpers';
import { sortByKey } from 'utils/utils';
import autobind from 'autobind-decorator';
import { Loading, Button, Alert, Editable, FormGroup, Input, Breadcrumbs, User, AccessControls } from 'components';
import contentComponents from 'contentComponents';
import * as FaIcons from 'react-icons/lib/fa';
import { FaChevronDown, FaChevronUp, FaTrash, FaEdit, FaExternalLink, FaEraser} from 'react-icons/lib/fa';
import { MdCast } from 'react-icons/lib/md';

@connect(
  (state) => ({
    user: state.firebase.get('user'),
    users: state.app.get('users')
  }),
  {
    pushState: push
  }
)
@myFirebaseConnect([
  {
    path: '/campaigns/',
    pathResolver: (path, {params = {}})=>(
      path + params.campaignKey
    ),
    adapter: (snapshot, {params = {}})=>{
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
      const views = fromJS(snapshot.val()).sort(sortByKey('name')) || undefined;
      return {
        views,
      };
    }
  }
])
export default class DocumentDetail extends Component {
  static propTypes = {
    campaign: PropTypes.object,
    doc: PropTypes.object,
    user: PropTypes.object,
    pushState: PropTypes.func.isRequired,
    params: PropTypes.object.isRequired,
    firebaseConnectDone: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.sendToViewSelects = {};
  }

  getAddContentGroup = (placementKey, placeBelow) => {
    const contentButtons = new Map(contentComponents)
      .sort(sortByKey('label'))
      .toList()
      .toJSON()
      .map(({componentName, icon, label}, index, all) => {
        const Icon = FaIcons[icon];
        const isFirst = index === 0;
        const isLast = index === all.length - 1;
        return <Button key={componentName} clipBottomLeft={isFirst} noClip={!isFirst && !isLast} primary onClick={this.addContent} onClickParams={{placementKey, componentName, placeBelow}} ><Icon/>&emsp;{label}</Button>;
      });
    return (<FormGroup children={[<h5>{'Add content ' + (placeBelow ? 'after' : 'before')}</h5>, contentButtons]} />);
  };

  @autobind
  updateDocument(value, { path }, method) {
    const { campaign, doc } = this.props;
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/' + path, value, method);
  }

  @autobind
  addContent({placementKey, componentName, placeBelow}) {
    const { campaign, doc } = this.props;

    const documentPath = '/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key');
    const contentElementsSubPath = 'contentElements';
    const contentElementsPath = documentPath + '/' + contentElementsSubPath;

    const contentElements = doc.get('contentElements') || Map();
    const lastOrderNumber = this.maxOrder(doc.get('contentElements') || []) + 1;

    const newContentElementKey = getPushKey(contentElementsPath);
    const newContentElement = new Map({
      order: lastOrderNumber,
      component: componentName,
      label: get(contentComponents, componentName, {}).label || componentName,
      key: newContentElementKey,
    });

    const sortedComponentElements = this
      .sortByOrder(contentElements)
      .toList()
      .push(newContentElement);

    if (placementKey) {
      const placementIndex = sortedComponentElements.findIndex((contentElement) => (
        contentElement.get('key') === placementKey
      ));
      const placeBelowShift = placeBelow ? -1 : 0;
      const positionShift = sortedComponentElements.size - 1 - placementIndex + placeBelowShift;

      const updatedComponentElements = range(positionShift).reduce((updatedElements, stepIndex) => {
        const targetIndex = sortedComponentElements.size - 1 - stepIndex - 1;
        const targetKey = sortedComponentElements.getIn([targetIndex, 'key']);
        const targetOrder = updatedElements.getIn([targetKey, 'order']);
        const sourceOrder = updatedElements.getIn([newContentElementKey, 'order']);
        return updatedElements
        .setIn([newContentElementKey, 'order'], targetOrder)
        .setIn([targetKey, 'order'], sourceOrder);
      }, contentElements.set(newContentElementKey, newContentElement));

      this.updateDocument(updatedComponentElements.toJSON(), { path: contentElementsSubPath });
    } else {
      this.updateDocument(newContentElement.toJSON(), { path: contentElementsSubPath + '/' + newContentElementKey });
    }
    this.updateDocument(newContentElementKey, { path: 'editingContentKey' });
  }

  @autobind
  updateContent(value, {key, path}) {
    const { campaign, doc } = this.props;
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/contentElements/' + key + '/' + path, value);
  }

  maxOrder(contentElements) {
    return contentElements.reduce( (maxOrder, contentElement)=>(Math.max( maxOrder, contentElement.get('order') || 0 ) ), 0 );
  }

  sortByOrder(contentElements) {
    return contentElements.sort( sortByKey('order') );
  }

  @autobind
  moveContent({key, shift}) {
    const { campaign, doc } = this.props;
    const contentElements = doc.get('contentElements') || Map();
    const sortedContentElements = this.sortByOrder(contentElements).toList();
    const currentElement = contentElements.get(key);
    const currentIndex = sortedContentElements.indexOf( currentElement );
    const targetIndex = currentIndex + shift;
    const targetElement = sortedContentElements.get(targetIndex);
    const targetKey = targetElement.get('key');
    const currentOrder = currentElement.get('order') || this.maxOrder(doc.get('contentElements') || []) + 1;
    const targetOrder = targetElement.get('order') || this.maxOrder(doc.get('contentElements') || []) + 2;

    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/contentElements/' + key + '/order', targetOrder );
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/contentElements/' + targetKey + '/order', currentOrder );
  }

  @autobind
  removeContent(key) {
    const { campaign, doc } = this.props;
    updateDb('/campaigns/' + campaign.get('key') + '/documents/' + doc.get('key') + '/contentElements/' + key, null);
  }

  @autobind
  openViewInNewTab(viewSelectKey) {
    window.open('/view/' + this.sendToViewSelects[viewSelectKey].value);
  }

  @autobind
  sendToView({key, clear}) {
    const { doc } = this.props;
    const viewKey = this.sendToViewSelects[key].value;
    const contentElements = key === 'doc' ? doc.get('contentElements') : Map({key: doc.getIn(['contentElements', key])});
    updateDb('/views/' + viewKey + '/contentElements', clear ? null : contentElements.toJSON());
  }

  @injectProps
  render({
    doc,
    views = Map(),
    campaign,
    params = {},
    firebaseConnectDone,
    users,
    user,
  }) {
    const styles = require('./DocumentDetail.scss');

    const {
      contentElements = Map()
    } = (doc ? doc.toObject() : {});
    const docName = doc ? (doc.get('name') || doc.get('key')) : 'not available';

    const viewOptions = views.map( (view, viewKey)=>({
      label: view.get('name') || viewKey,
      value: viewKey
    }) );

    const sortedContentElements = this.sortByOrder(contentElements);
    const DocumentDetailInstance = this;
    const editingContentKey = doc ? doc.get('editingContentKey', null) : null;

    const contentBlock = (<div className={ styles.DocumentDetail_contentBlock } >
      { sortedContentElements.size ? sortedContentElements.map( (componentElement, key)=>{
        const {component, componentProps = {}, view} = componentElement ? componentElement.toJS() : {};
        const ContentElement = contentComponents[component] && contentComponents[component].component;
        if (!ContentElement) {
          console.warn('Malformed component', component, componentProps);
          // TODO list malformed data
          return (<Alert warning>
            Malformed component "{component}" with key {key}- <Button danger confirmMessage="Really permanently remove?" onClick={this.removeContent} onClickParams={key} ><FaTrash /></Button>
            <pre>{JSON.stringify(componentProps)}</pre>
          </Alert>);
        }

        const isBeingEdited = key === editingContentKey;
        const getClassName = (state) => {
          const cls = classnames([styles.DocumentDetail_contentElement, styles['DocumentDetail_contentElement_' + state]]);
          return cls;
        };

        return (<Transition in={isBeingEdited} timeout={100}>
          {(state) => (
            <div className={ getClassName(state) } key={key}>
              <FormGroup childTypes={[null, 'flexible', null]}>
                <div>
                  { isBeingEdited ? [
                    <Button secondary clipBottomLeft disabled={componentElement === sortedContentElements.first()} onClick={this.moveContent} onClickParams={{ shift: -1, key}} ><FaChevronUp /></Button>,
                    <Button secondary disabled={componentElement === sortedContentElements.last()} onClick={this.moveContent} onClickParams={{ shift: 1, key}} ><FaChevronDown /></Button>
                  ] : null }
                </div>
                <h4 style={{margin: 0}}>{ componentElement.get('label') || get(contentComponents, componentElement.get('componentName'), {}).label || componentElement.get('componentName') }</h4>
                <div>
                  { isBeingEdited
                    ? <Button inline success clipBottomLeft
                        onClick={partial(this.updateDocument, null, {path: 'editingContentKey'}, undefined)}
                      ><FaEdit /> Preview</Button>
                    : <Button inline warning clipBottomLeft active={isBeingEdited}
                        onClick={partial(this.updateDocument, key, {path: 'editingContentKey'}, undefined)}
                      ><FaEdit /> Edit</Button>
                  }
                  <Button danger confirmMessage="Really permanently remove?" onClick={this.removeContent} onClickParams={key} ><FaTrash /> Delete</Button>
                </div>
              </FormGroup>
              <ContentElement {...componentProps} preview={!isBeingEdited} handleChange={this.updateContent} handleChangeParams={{key}} admin user={user} />
              <FormGroup childTypes={['flexible']}>
                <div></div>
                <Input inline type="select" label="View" options={ viewOptions } value={view} handleChange={this.updateContent} handleChangeParams={{key, path: 'view'}} inputRef={ (sendToViewSelect)=>(DocumentDetailInstance.sendToViewSelects[key] = sendToViewSelect) } />
                <div>
                  <Button secondary clipBottomLeft onClick={this.sendToView} onClickParams={{ key }} ><MdCast /> Send</Button>
                  <Button primary noClip onClick={this.openViewInNewTab} onClickParams={key} ><FaExternalLink /> Open</Button>
                  <Button warning onClick={this.sendToView} onClickParams={{ key, clear: true }} ><FaEraser /> Clear</Button>
                </div>
              </FormGroup>
              { isBeingEdited ? this.getAddContentGroup(key, true) : null }
              <hr />
            </div>
          )}
        </Transition>);
      } ) :
        <Alert warning>No content yet. Add Some</Alert> }
      { (doc) ? this.getAddContentGroup(null, false) : null }
    </div>);

    return (
      <div className={ styles.DocumentDetail }>
        <Breadcrumbs links={[
          {url: '/', label: '⌂'},
          {url: '/campaigns', label: 'campaigns'},
          {
            url: (campaign ? ('/campaign/' + campaign.get('key')) : null),
            label: (campaign ? (campaign.get('name') || campaign.get('key')) : '-')
          },
          {label: docName }
        ]} />
        <Helmet title={docName }/>
        <Loading show={!firebaseConnectDone} message="Loading" />
        <div className="container" >
          { doc ?
            (<div className={ styles.DocumentDetail + '-content' }>
              <FormGroup childTypes={['flexible', null]} >
                <div />
                <Input label="View" inline type="select" options={ viewOptions } inputRef={ (sendToViewSelect)=>(DocumentDetailInstance.sendToViewSelects.doc = sendToViewSelect) } />
                <div>
                  <Button secondary clipBottomLeft onClick={this.sendToView} onClickParams={{ key: 'doc' }} ><MdCast /> Send All</Button>
                  <Button primary noClip onClick={this.openViewInNewTab} onClickParams={'doc'} ><FaExternalLink /> Open</Button>
                  <Button warning onClick={this.sendToView} onClickParams={{ key: 'doc', clear: true }} ><FaEraser /> Clear</Button>
                </div>
              </FormGroup>
              <h1>
                <Editable type="text" onSubmit={this.updateDocument} onSubmitParams={{ path: 'name' }} >{ docName }</Editable>
              </h1>
              <FormGroup verticalCenter >
                <span>Created on {(new Date(doc.get('created'))).toLocaleString()}</span>
                <span>by&emsp;<User uid={doc.get('createdBy')} /></span>
              </FormGroup>
              <AccessControls
                access={doc.get('access')}
                users={users}
                onChange={this.updateDocument}
                onChangeParams={{ path: 'access' }}
              />
              <hr />
              { contentBlock }
            </div>)
          : <Alert className={styles['DocumentDetail-notFoung']} warning >Document { params.key } not found. Back to <Link to="/campaigns" ><Button link>Campaign Overview</Button></Link></Alert> }
        </div>
      </div>
    );
  }
}
