import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';

export default class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    success: PropTypes.bool,
    warning: PropTypes.bool,
    danger: PropTypes.bool,
    link: PropTypes.bool,
    block: PropTypes.bool,
    disabled: PropTypes.bool,
    children: PropTypes.any
  };

  constructor(props) {
    super(props);
  }

  render() {
    const styles = require('./Button.scss');
    const {
      className = '',
      children,
      primary,
      secondary,
      success,
      warning,
      danger,
      link,
      block,
      disabled,
      ...props
    } = this.props;

    const classNames = Map({
      primary,
      secondary,
      success,
      warning,
      danger,
      link,
      block,
      disabled
    }).reduce( (output, value, key)=>(
      value ? output.concat([ styles['Button--' + key] ]) : output
    ), className.split(' ') );

    const processedClassName = [styles.Button].concat(classNames).join(' ');

    return <button className={processedClassName} {...props}>{children}</button>;
  }
}
