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
import { Modal } from 'components';
import config from '../../config';

@connect(
  state => ({
    user: state.firebase.get('user'),
    modal: state.modal,
    routeBeforeLogin: state.firebase.get('routeBeforeLogin'),
    session: state.firebase.get('session'),
    sheetsLoaded: state.firebase.getIn(['sheets', 'loaded']),
  }),
  {logout, pushState: push, connectSession, connectSheets}
)
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    modal: PropTypes.object,
    session: PropTypes.object,
    sheetsLoaded: PropTypes.bool,
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
    console.log('App | componentWillReceiveProps', this.props.location.pathname, nextProps.location.pathname, 'save?', this.props.session && (this.props.location.pathname !== nextProps.location.pathname ));
    if (nextProps.session && nextProps.location.pathname && (this.props.location.pathname !== nextProps.location.pathname )) {
      console.log('App | saveRoute', this.props.location.pathname);
      saveRoute(nextProps.location.pathname);
    }
    if (!this.props.user && nextProps.user) {
      console.log('App | user just logged in, get session and sheets');
      // on user login connect session
      this.props.connectSession();
      this.props.connectSheets();
      // this.props.pushState('/loginSuccess');
    } else if ((!this.props.session || !this.props.sheetsLoaded) && nextProps.session && nextProps.sheetsLoaded) {
      console.log('App | both session and sheets are connected, redirect to routeBeforeLogin or session last route');
      // On session connect redirect to route before login, last page or home
      const redirectTo = (nextProps.routeBeforeLogin && decodeURIComponent(nextProps.routeBeforeLogin)) || nextProps.session.get('route') || '/';
      this.props.pushState(redirectTo);
    } else if (this.props.user && !nextProps.user) {
      console.log('App | just logged out, redirect to /login');
      // logout
      this.props.pushState('/login');
    }
  }

  handleLogout = (event) => {
    event.preventDefault();
    this.props.logout();
  };

  render() {
    const styles = require('./App.scss');
    const {user, modal} = this.props;

    return (
      <div className={styles.app}>
        <Helmet {...config.app.head} />
        <Navbar fixedTop inverse>
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
              <LinkContainer to="/sheets">
                <NavItem eventKey={1} >
                  Sheets
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/campaigns">
                <NavItem eventKey={2} >
                  Campaigns
                </NavItem>
              </LinkContainer>
              <LinkContainer to="/views">
                <NavItem eventKey={3} >
                  Views
                </NavItem>
              </LinkContainer>
              {user ?
                <LinkContainer to="/logout">
                  <NavItem eventKey={8} onClick={this.handleLogout}>
                    Logout
                  </NavItem>
                </LinkContainer>
                :
                <LinkContainer to="/login">
                  <NavItem eventKey={8}>Login</NavItem>
                </LinkContainer>
              }
              {user ? <LinkContainer to={'/user'}>
                <NavItem eventKey={9} >
                  Profile: {user.get('displayName') || user.get('email')}
                </NavItem>
              </LinkContainer> : null }
            </Nav>
          </Navbar.Collapse>
        </Navbar>

        <div className={styles.appContent}>
          {this.props.children}
        </div>

        <hr />

        <footer className="text-center">
          created by <a href="https://tomasreichmann.cz" target="_blank" >Tomáš Reichmann</a> 2017
        </footer>

        {modal && modal.isOpen ? <Modal {...modal} /> : null }
      </div>
    );
  }
}
