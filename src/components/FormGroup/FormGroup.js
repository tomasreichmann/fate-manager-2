import React, { Component, PropTypes } from 'react';

export default class FormGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
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
      ...props
    } = this.props;

    const processedClassName = [styles.FormGroup].concat(className.slice(' ')).join(' ');

    return (<div className={processedClassName} {...props}>{
      ((typeof children.map === 'function') ? children : [children]).map( (child, childIndex)=>( <div key={'item-' + childIndex} className={
          (childTypes[childIndex] ? childTypes[childIndex].split(' ') : [])
          .map( (type)=>( styles['FormGroup-item--' + type] ) )
          .concat([styles['FormGroup-item']])
          .join(' ')
      } >{child}</div> ) )
    }</div>);
  }
}
