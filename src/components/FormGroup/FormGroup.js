import React, { Component, PropTypes } from 'react';

export default class FormGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    alignRight: PropTypes.bool,
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
      ...props
    } = this.props;

    const modeCls = [];
    if ( alignRight ) {
      modeCls.push(styles['FormGroup--alignRight']);
    }

    const processedClassName = [styles.FormGroup].concat(modeCls, className.slice(' ')).join(' ');

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
