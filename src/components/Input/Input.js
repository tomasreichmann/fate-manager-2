import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';
import Textarea from 'react-textarea-autosize';
import { RadioButtonGroup } from 'components';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    label: PropTypes.any,
    inline: PropTypes.bool,
    inherit: PropTypes.bool,
    multiple: PropTypes.bool,
    inputRef: PropTypes.func,
    inputClassName: PropTypes.string,
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
    text: ({path, inputRef, type, value, styles, inputClassName, ...props})=>(
      <input
        {...props}
        ref={inputRef}
        className={classnames([styles.Input], inputClassName)}
        type={type}
        key={path}
        data-model={path}
        value={value}
        onChange={this.handleChange}
      />
    ),
    textarea: ({path, inputRef, value, styles, inputClassName, ...props})=>(
      <Textarea
        {...props}
        inputRef={inputRef}
        className={classnames([styles.Input, styles['Input--textarea']], inputClassName)}
        data-model={path}
        key={path}
        value={value}
        onChange={this.handleChange}
      />
    ),
    checkbox: ({path, inputRef, value, styles, inputClassName, ...props})=>{
      const checkedProperty = value !== undefined ? { checked: !!value } : { defaultChecked: false };
      // console.log('path', path, 'inputRef', inputRef, 'value', value, 'styles', styles, '...props', props );
      return (<input
        {...props}
        ref={inputRef}
        className={classnames([styles.Input, styles['Input--checkbox']], inputClassName)}
        type="checkbox"
        key={path}
        data-model={path}
        {...checkedProperty}
        onChange={this.handleChange}
      />);
    },
    radioButtonGroup: ({path, value, styles, ...props})=>(
      <RadioButtonGroup
        {...props}
        className={classnames([styles.Input, styles['Input--radioButtonGroup']])}
        key={path}
        data-model={path}
        value={value}
        onChange={(selectedValue) => { return this.handleChange({ target: { value: selectedValue }}); } }
      />
    ),
    select: ({path, options = [], inputRef, value, styles, inputClassName, ...props})=>(
      <select
        {...props}
        ref={inputRef}
        className={classnames([styles.Input, styles['Input--select']], inputClassName)}
        type="select"
        key={path}
        data-model={path}
        value={value}
        onChange={this.handleChange}
      >
        { options.map( (option, optionIndex) => (
          <option key={optionIndex} value={ option.value } >{option.label || option.value}</option>
        ) ) }
      </select>
    )
  }

  handleChange(event) {
    if (this.props.handleChange) {
      let value = event.target.value;
      if (this.props.type === 'checkbox' || this.props.type === 'stressbox') {
        value = event.target.checked;
      } else if ( this.props.type === 'select' && this.props.multiple ) {
        const options = event.target.options;
        value = Array.from(options).filter( (option)=>(option.selected) ).map( (option) => (
          option.value
        ) );
      }
      this.props.handleChange(value, this.props.handleChangeParams );
    }
  }

  render() {
    const styles = require('./Input.scss');
    const {
      label,
      className = '',
      inputClassName = '',
      type = 'text',
      superscriptBefore,
      superscriptAfter,
      inline,
      inherit,
      ...props,
    } = this.props;

    const template = type in this.inputTemplates ? type : 'text';
    const classNames = classnames(styles.Label, styles['Label--' + type], {
      [styles['Label--inline']]: inline,
      [styles['Label--inherit']]: inherit,
    }, className);

    return (<label className={classNames}>
      {superscriptBefore ? <span className={classnames(styles['Label-superscript'], styles['Label-superscript--before'])} >{superscriptBefore}</span> : null}
      {label ? <span className={styles['Label-text']} >{label}</span> : null}
      <div className={styles['Label-inputWrap']} >
      {this.inputTemplates[template]({
        ...props,
        inputClassName,
        type,
        styles,
      })}
      {type === 'checkbox' ? <span className={styles['Input-fauxCheckbox']} ></span> : null}
      {superscriptAfter ? <span className={[styles['Label-superscript'], styles['Label-superscript--after']].join(' ')} >{superscriptAfter}</span> : null}
      </div>
    </label>);
  }
}
