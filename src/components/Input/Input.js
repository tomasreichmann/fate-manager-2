import React, { Component, PropTypes } from 'react';

export default class Input extends Component {
  static propTypes = {
    type: PropTypes.string,
    className: PropTypes.string,
    handleChange: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  inputTemplates = {
    text: ({path, val, className, styles})=>(
      <input
        className={ ['Input'].concat(className.split(' ')).map( (cls) => ( styles[cls] ) ).join(' ') }
        type="text"
        key={path}
        data-model={path}
        value={val}
        onChange={this.handleChange}
      />
    ),
    textarea: ({path, val, className, styles})=>(
      <textarea
        className={['Input', 'Input--textarea'].concat(className.split(' ')).map( (cls) => ( styles[cls] ) ).join(' ') }
        data-model={path}
        key={path}
        value={val}
        onChange={this.handleChange}
      ></textarea>
    ),
    checkbox: ({path, val, className, styles})=>(
      <input
        className={'Input Input--checkbox ' + className + ' ' + styles.Input}
        type="checkbox"
        key={path}
        data-model={path}
        checked={!!val}
        onChange={this.handleChange}
      />
    )
  }

  handleChange(event) {
    this.props.handleChange(this.props.type === 'checkbox' ? event.target.checked : event.target.value);
  }

  render() {
    const styles = require('./Input.scss');
    const {
      handleChange = (()=>{ return null; }),
      className = '',
      type = 'text',
      ...props
    } = this.props;

    return type in this.inputTemplates ? this.inputTemplates[type]({
      ...props,
      type,
      className,
      styles,
      handleChange
    }) : null;
  }
}
