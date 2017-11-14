import React, { Component, PropTypes } from 'react';
import classnames from 'classnames';

export default class FormGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    alignRight: PropTypes.bool,
    verticalCenter: PropTypes.bool,
    noWrap: PropTypes.bool,
    childTypes: PropTypes.array,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const styles = require('./FormGroup.scss');
    const {
      children = [],
      className = '',
      childTypes = [],
      alignRight,
      verticalCenter,
      noWrap,
      ...props
    } = this.props;

    const processedClassName = classnames(styles.FormGroup, {
      [styles.FormGroup__alignRight]: alignRight,
      [styles.FormGroup__verticalCenter]: verticalCenter,
      [styles.FormGroup__noWrap]: noWrap,
    }, className);

    return (<div className={processedClassName} {...props}>{
      ((typeof children.map === 'function') ? children : [children]).map( (child, childIndex)=>( <div key={'item-' + childIndex} className={
          (childTypes[childIndex] ? childTypes[childIndex].split(' ') : [])
          .map( (type)=>( styles['FormGroup_item__' + type] ) )
          .concat([styles.FormGroup_item])
          .join(' ')
      } >{child}</div> ) )
    }</div>);
  }
}
