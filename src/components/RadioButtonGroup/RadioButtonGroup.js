import React, { Component, PropTypes } from 'react';
import autobind from 'autobind-decorator';
import { Button } from 'components';
import classnames from 'classnames';

export default class RadioButtonGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func,
    onChangeParams: PropTypes.any,
    value: PropTypes.any,
    block: PropTypes.bool,
    options: PropTypes.object,
  };

  static defaultProps = {
    onChange: () => {},
    onChangeParams: {},
    options: [],
    value: null,
    block: false,
  };

  constructor(props) {
    super(props);
    this.state = {
      value: props.value
    };
  }

  componentWillReceiveProps({ value }) {
    if (value !== this.state.value) {
      this.setState({ value });
    }
  }

  @autobind
  onChange({ value, onChangeParams = {} }) {
    console.log('onChange value', value);
    this.props.onChange(value, {
      ...this.props.onChangeParams,
      ...onChangeParams,
    });
    this.setState({value});
  }

  render() {
    const styles = require('./RadioButtonGroup.scss');
    const {
      className = '',
      block,
      options = [],
      ...props,
    } = this.props;

    const cls = classnames([
      styles.RadioButtonGroup,
      className,
      block ? styles.RadioButtonGroup__block : null
    ]);

    return (<span className={cls} {...props} >
      { options.map( ({ label, value, buttonProps = { primary: true }, onChangeParams = {} }, optionIndex) => {
        const propsWithActive = {
          ...buttonProps,
          active: value === this.state.value,
        };
        if ( optionIndex === 0 ) {
          propsWithActive.clipBottomLeft = true;
        } else if ( optionIndex < options.length - 1 ) {
          propsWithActive.noClip = true;
        }
        return <Button {...propsWithActive} onClick={this.onChange} onClickParams={{ value, onChangeParams }} key={optionIndex} >{ label || value }</Button>;
      } ) }
    </span>);
  }
}
