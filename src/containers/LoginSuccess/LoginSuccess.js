import React, {Component, PropTypes} from 'react';
import {connect} from 'react-redux';
import {logout} from 'redux/modules/firebase';

@connect(
  state => ({user: state.firebase.get('user') }),
  {logout}
)
export default
class LoginSuccess extends Component {
  static propTypes = {
    user: PropTypes.object,
    route: PropTypes.shape({
      isNewUser: PropTypes.bool
    }),
    logout: PropTypes.func
  }

  render() {
    const {user, logout: logoutAction, route } = this.props;
    return (user &&
      <div className="container">
        <h1>{ route.isNewUser ? 'Registration successfull' : 'Login successfull'}</h1>

        <div>
          { route.isNewUser ? <p>You have been just successfully registered as {user.get('displayName') || user.get('email')}</p>
          : <p>You have just successfully logged in as {user.get('displayName') || user.get('email')}</p> }

          <div>
            <button className="btn btn-danger" onClick={logoutAction}><i className="fa fa-sign-out"/>{' '}Log Out</button>
          </div>
        </div>
      </div>
    );
  }
}
