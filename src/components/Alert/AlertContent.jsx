import React, { Component, PropTypes } from 'react';
import { Alert, FormGroup, Input } from 'components';
import { injectProps } from 'relpers';

export default class AlertContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    formRef: PropTypes.func,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
  }

  @injectProps
  render({
    preview = false,
    children = 'no message',
    handleChange,
    handleChangeParams,
    ...props,
  } = {}) {
    const {
      message,
      danger,
      warning,
      primary,
      secondary,
      success,
      info,
    } = props;
    const styles = require('./AlertContent.scss');
    console.log('preview', preview);
    return preview ? <Alert {...props}>{children}</Alert> : (<div className={styles.AdminContent} {...props} >
      <FormGroup childTypes={['flexible']}>
        <Input label="Message" type="textarea" name="message" value={message} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/message' }} />
      </FormGroup>
      <FormGroup>
        <Input inline label="Danger" type="checkbox" name="danger" value={danger} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/danger' }} />
        <Input inline label="Warning" type="checkbox" name="warning" value={warning} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/warning' }} />
        <Input inline label="Primary" type="checkbox" name="primary" value={primary} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/primary' }} />
        <Input inline label="Secondary" type="checkbox" name="secondary" value={secondary} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/secondary' }} />
        <Input inline label="Success" type="checkbox" name="success" value={success} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/success' }} />
        <Input inline label="Info" type="checkbox" name="info" value={info} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/info' }} />
      </FormGroup>
    </div>);
  }
}
