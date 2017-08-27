import React, { Component, PropTypes } from 'react';
import { killEvent } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Input, FormGroup } from 'components';
import classnames from 'classnames';
import { FaBan, FaCheck } from 'react-icons/lib/fa';

export default class Editable extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onSubmitParams: PropTypes.object,
    children: PropTypes.any,
    type: PropTypes.string,
    block: PropTypes.bool,
    inputProps: PropTypes.object,
    placeholder: PropTypes.string,
    processChildren: PropTypes.func,
  };

  constructor(props) {
    super(props);
    this.state = {
      editing: false
    };
  }

  @autobind
  @killEvent
  onSubmit() {
    console.log('onSUbmit this.inputElement', this.inputElement);
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.inputElement.value, this.props.onSubmitParams);
    }
    this.setState({
      editing: false
    });
  }

  @autobind
  @killEvent
  onCancel() {
    this.setState({
      editing: false
    });
  }

  @autobind
  @killEvent
  onEdit() {
    this.setState({
      editing: true
    });
  }

  render() {
    const styles = require('./Editable.scss');
    const {
      className = '',
      type = 'text',
      block = false,
      inputProps = {},
      processChildren = value => value,
      placeholder = '[empty]',
      children,
      ...props,
    } = this.props;

    const cls = classnames([
      styles.Editable,
      className,
      {
        type: styles['Editable__' + type],
      },
      block ? styles.Editable__block : null
    ]);

    const processedChildren = processChildren(children);

    return (<span className={cls} {...props} >
      { this.state.editing ?
        <FormGroup className={styles.Editable_form} alignRight={block} childTypes={[block ? 'full' : 'flexible', null]} >
          <Input
            inherit
            type={type}
            inputClassName={styles.Editable_input}
            defaultValue={ inputProps.value || children }
            placeholder={placeholder}
            {...inputProps}
            inputRef={ (input)=>(this.inputElement = input) }
          />
          <div>
            <Button inline danger clipBottomLeft onClick={this.onCancel} ><FaBan /></Button>
            <Button inline success onClick={this.onSubmit} ><FaCheck /></Button>
          </div>
        </FormGroup>
      : <span className={styles.Editable_content} onClick={this.onEdit} >{processedChildren || placeholder}</span>}
    </span>);
  }
}
