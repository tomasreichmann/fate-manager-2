import React, { Component, PropTypes } from 'react';
import { Alert, FormGroup, Input, RadioButtonGroup } from 'components';
import { injectProps } from 'relpers';
import autobind from 'autobind-decorator';

export default class AlertContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
    children: PropTypes.any,
    message: PropTypes.any,
    danger: PropTypes.bool,
    warning: PropTypes.bool,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    success: PropTypes.bool,
    info: PropTypes.bool,
  }

  @autobind
  handleBrandChange(brand) {
    const { handleChangeParams, children = 'no message', message } = this.props;
    const updatedComponentProps = {
      message: message || children,
      danger: false,
      warning: false,
      primary: false,
      secondary: false,
      success: false,
      info: false,
      [brand]: true
    };
    this.props.handleChange(updatedComponentProps, { ...handleChangeParams, path: 'componentProps' });
  }

  @injectProps
  render({
    preview = false,
    children = '',
    handleChange,
    handleChangeParams,
    ...props,
  } = {}) {
    const styles = require('./AlertContent.scss');
    const { message } = this.props;
    const brandMap = {
      danger: this.props.danger,
      warning: this.props.warning,
      primary: this.props.primary,
      secondary: this.props.secondary,
      success: this.props.success,
      info: this.props.info,
    };
    const brands = Object.keys(brandMap);
    const brandOptions = brands.map(brand => ({ label: brand, value: brand }));
    const brandSelection = brands.find((brand) => brandMap[brand]);
    return preview ? <Alert {...props}>{children}</Alert> : (<div className={styles.AdminContent} {...props} >
      <FormGroup childTypes={['flexible']}>
        <Input label="Message" type="textarea" value={children || message} placeholder="no message" handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/children' }} />
      </FormGroup>
      <RadioButtonGroup value={brandSelection} options={brandOptions} onChange={this.handleBrandChange}/>
    </div>);
  }
}
