import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import {login, logout} from 'redux/modules/firebase';
import { Button, Alert, Input } from 'components';

@connect(
  state => ({
    user: state.firebase.get('user'),
    errorMessage: state.firebase.getIn(['loginError', 'message']),
  } ),
  {login, logout, pushState: push})
export default class Login extends Component {
  static propTypes = {
    user: PropTypes.object,
    login: PropTypes.func,
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
    console.log('login', email.value, password.value, this.props.params.routeBeforeLogin);
    this.props.login(email.value, password.value, this.props.params.routeBeforeLogin);
    password.value = '';
  }

  goRegister = (event) => {
    event.preventDefault();
    this.props.pushState('/register/' + (encodeURIComponent(this.props.params.routeBeforeLogin) || ''));
  }

  render() {
    const {user, logout: logoutAction} = this.props;
    const styles = require('./Login.scss');
    console.log('user', user);
    return (
      <div className={styles.loginPage + ' container'}>
        <Helmet title="Login"/>
        <h1>Login</h1>
        {user ?
        <div>
          <p>You are currently logged in as {user.get('displayName') || user.get('email') }.</p>

          <div>
            <Button danger onClick={logoutAction}><i className="fa fa-sign-out"/>{' '}Log Out</Button>
          </div>
        </div>
        :
        <form className="login-form form-inline" onSubmit={this.handleSubmit}>
          <div className={styles.formRow}>
            <Input inputRef={(el) => (this.emailElement = el)} type="email" label="Email" placeholder="Email" />
          </div>
          <div className={styles.formRow}>
            <Input inputRef={(el) => (this.passwordElement = el)} type="password" label="Password" placeholder="Password" />
          </div>

          { this.props.errorMessage ? (<div className={styles.formRow}><Alert message={this.props.errorMessage} /></div>) : null }

          <div className={styles.formRow}>
            <Button success block onClick={this.handleSubmit}><i className="fa fa-sign-in"/>{' '}Log In</Button>
            <Button link block onClick={this.goRegister}><i className="fa fa-user"/>{' '}Register</Button>
          </div>
        </form>
        }
      </div>
    );
  }
}
