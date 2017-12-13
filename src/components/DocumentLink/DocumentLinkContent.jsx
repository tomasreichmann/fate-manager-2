import React, { Component, PropTypes } from 'react';
import { DocumentLink, FormGroup, Input } from 'components';
import { injectProps } from 'relpers';

export default class DocumentLinkContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
    children: PropTypes.any,
    className: PropTypes.string,
    uri: PropTypes.string,
    replace: PropTypes.bool,
  }

  @injectProps
  render({
    handleChange,
    handleChangeParams,
    ...componentProps,
  } = {}) {
    const {
      className = '',
      preview = false,
      children = '',
      uri,
      replace,
      ...otherComponentProps
    } = componentProps;
    const styles = require('./DocumentLinkContent.scss');
    return preview ? <DocumentLink {...componentProps} /> : (<div className={styles.AdminContent} >
      <FormGroup>
        <Input label="Replace" type="checkbox" value={!!replace} placeholder="link text" handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/replace' }} />
        <Input label="URI" type="text" value={uri} placeholder="link text" handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/uri' }} />
        <Input label="Label" type="text" value={children} placeholder="link text" handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/children' }} />
      </FormGroup>
      <div>
        Preview: <DocumentLink {...componentProps} />
      </div>
    </div>);
  }
}
