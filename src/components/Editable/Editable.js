import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import { killEvent } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, Input, FormGroup } from 'components';

export default class Editable extends Component {
  static propTypes = {
    className: PropTypes.string,
    onSubmit: PropTypes.func,
    onSubmitParams: PropTypes.object,
    children: PropTypes.any,
    type: PropTypes.string,
    inputProps: PropTypes.object,
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
    if (typeof this.props.onSubmit === 'function') {
      this.props.onSubmit(this.props.onSubmitParams, this.inputElement.value);
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
      type,
      inputProps = {},
      children,
      ...props,
    } = this.props;

    const classNames = Map({
      type,
    }).reduce( (output, value, key)=>(
      value ? output.concat([ styles['Editable--' + key] ]) : output
    ), className.split(' ') );

    const processedClassName = [styles.Editable].concat(classNames).join(' ');

    return (<span className={processedClassName} {...props} >
      { this.state.editing ?
        <FormGroup className={styles['Editable-form' ]} childTypes={['flexible', null, null]} >
          <Input inherit defaultValue={ inputProps.value || children } {...inputProps} inputRef={ (input)=>(this.inputElement = input) } />
          <Button block danger clip-bottom-left onClick={this.onCancel} >Cancel</Button>
          <Button block success onClick={this.onSubmit} >OK</Button>
        </FormGroup>
      : <span className={styles['Editable-content' ]} onClick={this.onEdit} >{children}</span>}
    </span>);
  }
}
