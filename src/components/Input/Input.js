import React, { Component, PropTypes } from 'react';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    label: PropTypes.any,
    inline: PropTypes.bool,
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
    text: ({path, inputRef, type, value, styles, ...props})=>(
      <input
        {...props}
        ref={inputRef}
        className={ [styles.Input].join(' ')}
        type={type}
        key={path}
        data-model={path}
        value={value}
        onChange={this.handleChange}
      />
    ),
    textarea: ({path, inputRef, value, styles, ...props})=>(
      <textarea
        {...props}
        ref={inputRef}
        className={[styles.Input, styles['Input--textarea']].join(' ')}
        data-model={path}
        key={path}
        value={value}
        onChange={this.handleChange}
      ></textarea>
    ),
    checkbox: ({path, inputRef, value, styles, ...props})=>(
      <input
        {...props}
        ref={inputRef}
        className={[styles.Input, styles['Input--checkbox']].join(' ')}
        type="checkbox"
        key={path}
        data-model={path}
        checked={!!value}
        onChange={this.handleChange}
      />
    )
  }

  handleChange(event) {
    if (this.props.handleChange) {
      this.props.handleChange((this.props.type === 'checkbox' || this.props.type === 'stressbox')
        ? event.target.checked
        : event.target.value, this.props.handleChangeParams );
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
      inline,
      ...props,
    } = this.props;

    const template = type in this.inputTemplates ? type : 'text';
    const classNames = [styles.Label, styles['Label--' + type]].concat(className.split(' '));
    if (inline) {
      classNames.push(styles['Label--inline']);
    }

    return (<label className={classNames.join(' ')}>
      {superscriptBefore ? <span className={[styles['Label-superscript'], styles['Label-superscript--before']].join(' ')} >{superscriptBefore}</span> : null}
      {label ? <span className={styles.Label} >{label}</span> : null}
      {this.inputTemplates[template]({
        ...props,
        type,
        styles,
      })}
      {type === 'checkbox' ? <span className={styles['Input-fauxCheckbox']} ></span> : null}
      {superscriptAfter ? <span className={[styles['Label-superscript'], styles['Label-superscript--after']].join(' ')} >{superscriptAfter}</span> : null}
    </label>);
  }
}
