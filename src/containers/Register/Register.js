import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import {register, logout} from 'redux/modules/firebase';
import { Button, Alert, Input } from 'components';

@connect(
  state => ({
    user: state.firebase.get('user'),
    errorMessage: state.firebase.getIn(['registerError', 'message']),
  } ),
  {register, logout, pushState: push})
export default class Register extends Component {
  static propTypes = {
    user: PropTypes.object,
    register: PropTypes.func,
    logout: PropTypes.func,
    pushState: PropTypes.func.isRequired,
    errorMessage: PropTypes.object,
    params: PropTypes.shape({
      routeBeforeLogin: PropTypes.string
    }),
  }

  handleSubmit = (event) => {
    event.preventDefault();
    const email = this.emailElement;
    const password = this.passwordElement;
    console.log('register', email.value, password.value);
    this.props.register(email.value, password.value, this.props.params.routeBeforeLogin);
    password.value = '';
  }

  goLogin = (event) => {
    event.preventDefault();
    this.props.pushState('/login/' + (encodeURIComponent(this.props.params.routeBeforeLogin) || ''));
  }

  render() {
    const {user, logout: logoutAction} = this.props;
    const styles = require('./Register.scss');
    console.log('user', user);
    return (
      <div className={styles.registerPage + ' container'}>
        <Helmet title="Register"/>
        <h1>Register</h1>
        {user ?
        <div>
          <Alert warning message={'You are already registered and logged in as ' + (user.get('displayName') || user.get('email'))} />
          <div>
            <Button danger onClick={logoutAction}><i className="fa fa-sign-out"/>{' '}Log Out</Button>
          </div>
        </div>
        :
        <form className="register-form form-inline" onSubmit={this.handleSubmit}>
          <div className={styles.formRow}>
            <Input inputRef={(el) => (this.emailElement = el)} type="email" label="Email" placeholder="Email" />
          </div>
          <div className={styles.formRow}>
            <Input inputRef={(el) => (this.passwordElement = el)} type="password" label="Password" placeholder="Password" />
          </div>

          { this.props.errorMessage ? (<div className={styles.formRow}><Alert message={this.props.errorMessage} /></div>) : null }

          <div className={styles.formRow}>
            <Button success block onClick={this.handleSubmit}><i className="fa fa-user"/>{' '}Register and log in</Button>
            <Button link block onClick={this.goLogin}><i className="fa fa-sign-in"/>{' '}Log In</Button>
          </div>
        </form>
        }
      </div>
    );
  }
}
