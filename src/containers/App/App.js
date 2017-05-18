import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { connectSheets, logout, connectSession, saveRoute } from 'redux/modules/firebase';
import { push } from 'react-router-redux';
import config from '../../config';

@connect(
  state => ({
    user: state.firebase.get('user'),
    routeBeforeLogin: state.firebase.get('routeBeforeLogin'),
    session: state.firebase.get('session'),
  }),
  {logout, pushState: push, connectSession, connectSheets}
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    session: PropTypes.object,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    connectSession: PropTypes.func.isRequired,
    connectSheets: PropTypes.func.isRequired,
    saveRoute: PropTypes.func.isRequired,
    routeBeforeLogin: PropTypes.string,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
  };

  static contextTypes = {
    store: PropTypes.object.isRequired
  };

  componentWillReceiveProps(nextProps) {
    console.log('componentWillReceiveProps', this.props.location.pathname, nextProps.location.pathname, 'save?', this.props.session && (this.props.location.pathname !== nextProps.location.pathname ));
    if (this.props.session && (this.props.location.pathname !== nextProps.location.pathname )) {
      saveRoute(nextProps.location.pathname);
    }
    if (!this.props.user && nextProps.user) {
      // on user login connect session
      this.props.connectSession();
      this.props.connectSheets();
      // this.props.pushState('/loginSuccess');
    } else if (!this.props.session && nextProps.session) {
      // On session connect redirect to route before login, last page or home
      const redirectTo = decodeURIComponent(nextProps.routeBeforeLogin) || nextProps.session.get('route') || '/';
      this.props.pushState(redirectTo);
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/login');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const {user} = this.props;
    const styles = require('./App.scss');

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head}/>
        <Navbar fixedTop>
          <Navbar.Header>
            <Navbar.Brand>
              <IndexLink to="/" activeStyle={{color: '#33e0ff'}}>
                <div className={styles.brand}/>
                <span>{config.app.title}</span>
              </IndexLink>
            </Navbar.Brand>
            <Navbar.Toggle/>
          </Navbar.Header>

          <Navbar.Collapse eventKey={0}>
            <Nav navbar>
              {user && <LinkContainer to="/chat">
                <NavItem eventKey={1}>Chat</NavItem>
              </LinkContainer>}

              <LinkContainer to="/about">
                <NavItem eventKey={5}>About Us</NavItem>
              </LinkContainer>

              {!user &&
              <LinkContainer to="/login">
                <NavItem eventKey={6}>Login</NavItem>
              </LinkContainer>}
              {user &&
              <LinkContainer to="/logout">
                <NavItem eventKey={7} className="logout-link" onClick={this.handleLogout}>
                  Logout
                </NavItem>
              </LinkContainer>}
            </Nav>
            {user &&
            <p className={styles.loggedInMessage + ' navbar-text'}>Logged in as <strong>{user.get('displayName') || user.get('email')}</strong>.</p>}
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <hr />

        <footer className="text-center">
          created by <a href="https://tomasreichmann.cz" target="_blank" >Tomáš Reichmann</a> 2017
        </footer>
      </div>
    );
  }
}
