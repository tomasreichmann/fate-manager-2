import React, { Component, PropTypes } from 'react';

export default class FormGroup extends Component {
  static propTypes = {
    className: PropTypes.string,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const styles = require('./FormGroup.scss');
    const {
      children,
      className,
      ...props
    } = this.props;

    const processedClassName = [styles.FormGroup].concat( className ? [className] : [] ).join(' ');

    console.log('processedClassName', processedClassName);

    return (<div className={styles.FormGroup} {...props}>{
      children.map( (child)=>( <div className={styles['FormGroup-item']} >{child}</div> ) )
    }</div>);
  }
}
