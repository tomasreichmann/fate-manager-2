import React, { Component, PropTypes } from 'react';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    label: PropTypes.any,
    className: PropTypes.string,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
    superscriptBefore: PropTypes.any,
    superscriptAfter: PropTypes.any,
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  inputTemplates = {
    text: ({path, value, className, styles, ...props})=>(
      <input
        {...props}
        className={ [styles.Input].concat(className.split(' ')).join(' ')}
        type="text"
        key={path}
        data-model={path}
        value={value}
        onChange={this.handleChange}
      />
    ),
    textarea: ({path, value, className, styles, ...props})=>(
      <textarea
        {...props}
        className={[styles.Input, styles['Input--textarea']].concat(className.split(' ')).join(' ')}
        data-model={path}
        key={path}
        value={value}
        onChange={this.handleChange}
      ></textarea>
    ),
    checkbox: ({path, value, className, styles, ...props})=>(
      <input
        {...props}
        className={[styles.Input, styles['Input--checkbox']].concat(className.split(' ')).join(' ')}
        type="checkbox"
        key={path}
        data-model={path}
        checked={!!value}
        onChange={this.handleChange}
      />
    )
  }

  handleChange(event) {
    console.log('handleChange', this.props.handleChange, this.props.handleChangeParams);
    if (this.props.handleChange) {
      this.props.handleChange((this.props.type === 'checkbox' || this.props.type === 'stressbox') ? event.target.checked : event.target.value, ...this.props.handleChangeParams );
    }
  }

  render() {
    const styles = require('./Input.scss');
    const {
      label,
      className = '',
      type = 'text',
      superscriptBefore,
      superscriptAfter,
      ...props
    } = this.props;

    return type in this.inputTemplates ? <label className={[styles.Label, styles['Label--' + type]].join(' ')}>
      {superscriptBefore ? <span className={[styles['Label-superscript'], styles['Label-superscript--before']].join(' ')} >{superscriptBefore}</span> : null}
      {label ? <span className={styles.Label} >{label}</span> : null}
      {this.inputTemplates[type]({
        ...props,
        type,
        className,
        styles,
      })}
      {type === 'checkbox' ? <span className={styles['Input-fauxCheckbox']} ></span> : null}
      {superscriptAfter ? <span className={[styles['Label-superscript'], styles['Label-superscript--after']].join(' ')} >{superscriptAfter}</span> : null}
      </label>
    : null;
  }
}
