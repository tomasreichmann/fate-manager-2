import React, { Component, PropTypes } from 'react';
import { Map } from 'immutable';
import classnames from 'classnames';
import { Button } from 'components';
import { injectProps } from 'relpers';
import { connect } from 'react-redux';
import { Link } from 'react-router';

@connect(
  state => ({
    users: (typeof state.app === 'object' && 'get' in state.app) ? state.app.get('users') : console.error('state.app', state.app) && new Map(),
  })
)
export default class User extends Component {
  static propTypes = {
    uid: PropTypes.string,
    users: PropTypes.object,
  }

  @injectProps
  render({
    uid,
    className,
    users = Map(),
    ...props,
  } = {}) {
    const styles = require('./User.scss');

    const user = users.get(uid);
    if (!user) {
      return <span>null</span>;
    }
    const {displayName, photoURL} = user.toObject();
    const image = photoURL ? <img src={photoURL} className={styles.User_image} /> : null;
    return (
      <Link to={'user/' + uid} className={classnames(className, styles.User)} {...props}>
        {image}
        <Button link >{displayName || uid}</Button>
      </Link>
    );
  }
}
