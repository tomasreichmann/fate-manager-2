import React, { Component, PropTypes } from 'react';
import { killEvent } from 'relpers';
import autobind from 'autobind-decorator';
import { Button, FormGroup } from 'components';
import classnames from 'classnames';
import { FaAngleDown, FaAngleUp } from 'react-icons/lib/fa';

const LabelWrapper = ({isCollapsed, label, toggle}) => {
  const styles = require('./Togglable.scss');
  const indicator = (<span className={classnames(styles.Togglable_indicator, {
    [styles.Togglable_indicator__collapsed]: isCollapsed
  })} >
    { isCollapsed ? <FaAngleDown /> : <FaAngleUp /> }
  </span>);
  return (<FormGroup childTypes={['flexible']} className={styles.Togglable_label} >
    <Button onClick={toggle} block link className="text-left" >{label}</Button>
    {indicator}
  </FormGroup>);
};

export default class Togglable extends Component {
  static propTypes = {
    className: PropTypes.string,
    onToggle: PropTypes.func,
    onToggleParams: PropTypes.object,
    children: PropTypes.any,
    collapsedContent: PropTypes.any,
    labelWrapper: PropTypes.any,
    label: PropTypes.any,
    position: PropTypes.string,
    defaultCollapsed: PropTypes.object,
  };

  static defaultProps = {
    onToggle: isToggled => isToggled,
    collapsedContent: null,
    labelWrapper: LabelWrapper,
    label: 'Toggle',
    position: 'bottom',
    defaultCollapsed: true,
  };

  constructor(props) {
    super(props);
    this.state = {
      isCollapsed: this.props.defaultCollapsed
    };
  }

  @autobind
  @killEvent
  toggle() {
    this.setState({
      isCollapsed: !this.state.isCollapsed
    });
    const params = [this.state.isCollapsed];
    if (this.props.onToggleParams) {
      params.push(this.props.onToggleParams);
    }
    this.props.onToggle(...params);
  }

  render() {
    const styles = require('./Togglable.scss');
    const {
      className,
      collapsedContent = 'collapsedContent',
      labelWrapper: LabelWrapperComponent,
      label,
      position,
      children,
      ...props,
    } = this.props;
    const { isCollapsed } = this.state;

    const cls = classnames([
      styles.Togglable,
      className,
      {
        [styles.Togglable__collapsed]: this.state.isCollapsed
      },
    ]);

    const labelWrapperComponent = <LabelWrapperComponent toggle={this.toggle} isCollapsed={isCollapsed} label={label} />;
    let labelTop = null;
    let labelBottom = null;
    if (position === 'bottom') {
      labelBottom = labelWrapperComponent;
    } else {
      labelTop = labelWrapperComponent;
    }

    return (<div className={cls} {...props} >
      {labelTop}
      { isCollapsed
        ? collapsedContent
        : children
      }
      {labelBottom}
    </div>);
  }
}
