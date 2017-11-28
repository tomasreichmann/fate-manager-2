import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import { push } from 'react-router-redux';
import Helmet from 'react-helmet';
import {login, logout} from 'redux/modules/firebase';
import { Button, Alert, Input } from 'components';
import { FaSignOut, FaSignIn, FaUserPlus } from 'react-icons/lib/fa';

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
    this.props.login(email.value, password.value, this.props.params.routeBeforeLogin);
    password.value = '';
  }

  goRegister = (event) => {
    event.preventDefault();
    this.props.pushState('/register/' + (encodeURIComponent(this.props.params.routeBeforeLogin || '')));
  }

  render() {
    const {user, logout: logoutAction} = this.props;
    const styles = require('./Login.scss');
    return (
      <div className={styles.loginPage + ' container'}>
        <Helmet title="Login"/>
        <h1>Login</h1>
        {user ?
        <div>
          <p>You are currently logged in as {user.get('displayName') || user.get('email') }.</p>

          <div>
            <Button danger onClick={logoutAction}><FaSignOut />&emsp;Log out</Button>
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
            <Button success block onClick={this.handleSubmit}><FaSignIn />&emsp;Log in</Button>
            <Button link block onClick={this.goRegister}><FaUserPlus />&emsp;Register</Button>
          </div>
        </form>
        }
      </div>
    );
  }
}
