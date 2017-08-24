import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { Button } from 'components';
import { intersperse } from '../../utils/utils';
import classnames from 'classnames';

export default class Breadcrumbs extends Component {
  static propTypes = {
    className: PropTypes.string,
    links: PropTypes.array,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const styles = require('./Breadcrumbs.scss');
    const {
      className = '',
      links = []
    } = this.props;

    const classNames = classnames(styles.Breadcrumbs, className);

    return (<div className={classNames}>{
      intersperse(
        links.map( (item, index) => {
          return item.url ? <Link key={index} to={item.url} className={styles.Breadcrumbs_link} ><Button link>{item.label}</Button></Link> : <span key={index} className={styles.Breadcrumbs_text} >{item.label}</span>;
        }),
        ' ▸ '
      )
    }</div>);
  }
}
