import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';

export default class Button extends Component {
  static propTypes = {
    className: PropTypes.string,
    onClick: PropTypes.func,
    onClickParams: PropTypes.object,
    primary: PropTypes.bool,
    secondary: PropTypes.bool,
    success: PropTypes.bool,
    warning: PropTypes.bool,
    danger: PropTypes.bool,
    link: PropTypes.bool,
    block: PropTypes.bool,
    disabled: PropTypes.bool,
    confirmMessage: PropTypes.any,
    confirmPositionTop: PropTypes.bool,
    confirmPositionRight: PropTypes.bool,
    confirmPositionBottom: PropTypes.bool,
    confirmPositionLeft: PropTypes.bool,
    clipBottomLeft: PropTypes.bool,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.onClickHandler = this.onClickHandler.bind(this);
  }

  onClickHandler(event) {
    const args = this.props.onClickParams ? [this.props.onClickParams, event] : [event];
    this.props.onClick(...args);
    this.button.blur();
  }

  onClickConfirm(event) {
    event.preventDefault();
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
      onClick,
      onClickParams,
      confirmMessage,
      confirmPositionTop,
      confirmPositionRight,
      confirmPositionBottom,
      confirmPositionLeft,
      clipBottomLeft,
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
      disabled,
      confirm: confirmMessage,
      confirmPositionTop,
      confirmPositionRight,
      confirmPositionBottom,
      confirmPositionLeft,
      clipBottomLeft,
    }).reduce( (output, value, key)=>(
      value ? output.concat([ styles['Button--' + key] ]) : output
    ), className.split(' ') );

    const processedClassName = [styles.Button].concat(classNames).join(' ');

    const onClickProp = {};
    if ( onClick ) {
      if ( confirmMessage ) {
        onClickProp.onClick = this.onClickConfirm;
      } else {
        onClickProp.onClick = this.onClickHandler;
      }
    }

    return (<button className={processedClassName} {...onClickProp} {...props} ref={ (button)=>( this.button = button ) }>
      {confirmMessage ? <div className={styles['Button-confirmMessage']} onClick={this.onClickHandler} >{confirmMessage}</div> : null}
      {children}
    </button>);
  }
}
