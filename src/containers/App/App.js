import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { IndexLink } from 'react-router';
import { LinkContainer } from 'react-router-bootstrap';
import { fromJS } from 'immutable';
import Navbar from 'react-bootstrap/lib/Navbar';
import Nav from 'react-bootstrap/lib/Nav';
import NavItem from 'react-bootstrap/lib/NavItem';
import Helmet from 'react-helmet';
import { myFirebaseConnect, updateDb, getInitialUser, connectSheets, logout, connectSession, saveRoute } from 'redux/modules/firebase';
import { updateApp } from 'redux/modules/app';
import { closeModal } from 'redux/modules/modal';
import { push } from 'react-router-redux';
import { Modal } from 'components';
import config from '../../config';
import autobind from 'autobind-decorator';

const packageJson = require('../../../package.json');
const { version = '0.0.0' } = packageJson;

@connect(
  state => ({
    user: state.firebase.get('user'),
    modal: state.modal,
    routeBeforeLogin: state.firebase.get('routeBeforeLogin'),
    session: state.firebase.get('session'),
    sheetsLoaded: state.firebase.getIn(['sheets', 'loaded']),
  }),
  {getInitialUser, logout, pushState: push, connectSession, connectSheets, closeModal, updateApp}
)
@myFirebaseConnect([
  {
    path: '/version',
    adapter: (snapshot)=>(
      { version: snapshot.val() }
    ),
  },
  {
    path: '/users',
    adapter: (snapshot)=>(
      { users: fromJS(snapshot.val()).map( (user) => ( user.delete('editedSheets') ) ) }
    ),
  }
])
export default class App extends Component {
  static propTypes = {
    children: PropTypes.object.isRequired,
    user: PropTypes.object,
    users: PropTypes.object,
    modal: PropTypes.object,
    session: PropTypes.object,
    sheetsLoaded: PropTypes.bool,
    logout: PropTypes.func.isRequired,
    pushState: PropTypes.func.isRequired,
    connectSession: PropTypes.func.isRequired,
    connectSheets: PropTypes.func.isRequired,
    updateApp: PropTypes.func.isRequired,
    closeModal: PropTypes.func.isRequired,
    routeBeforeLogin: PropTypes.string,
    getInitialUser: PropTypes.func.isRequired,
    location: PropTypes.shape({
      pathname: PropTypes.string
    }),
  };

  static defaultProps = {
    version: null
  };

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    this.props.getInitialUser();
    if (this.props.users) {
      this.props.updateApp({ path: 'users', value: this.props.users});
    }
  }

  componentWillReceiveProps(nextProps) {
    const versionDifference = nextProps.version !== null ? this.compareVersions(nextProps.version, version) : 0;
    if (versionDifference !== 0) {
      console.warn('there is a version difference', versionDifference);
    }

    // save users to redux
    if (nextProps.users && nextProps.users !== this.props.users) {
      this.props.updateApp({ path: 'users', value: nextProps.users});
    }

    if ( versionDifference < 0 && process.env.NODE_ENV === 'production' ) {
      console.info('notify database of new version', version, 'version difference', versionDifference);
      updateDb('version', version).then( ()=>(window.location.reload()) );
    } else if (versionDifference > 0) {
      window.location.reload();
    }

    if (nextProps.session && nextProps.location.pathname && (this.props.location.pathname !== nextProps.location.pathname )) {
      saveRoute(nextProps.location.pathname);
    }
    if (!this.props.user && nextProps.user) {
      // on user login connect session
      this.props.connectSession();
      this.props.connectSheets();
      // this.props.pushState('/loginSuccess');
    } else if ((!this.props.session || !this.props.sheetsLoaded) && nextProps.session && nextProps.sheetsLoaded) {
      // On session connect redirect to route before login, last page or home if not home or on login success page
      if (nextProps.location.pathname === '/' || /^\/login\//.test(nextProps.location.pathname)) {
        const routeBeforeLogin = nextProps.routeBeforeLogin || nextProps.params.routeBeforeLogin;
        const redirectTo = (routeBeforeLogin && decodeURIComponent(routeBeforeLogin)) || nextProps.session.get('route') || '/';
        this.props.pushState(redirectTo);
      }
    } else if (this.props.user && !nextProps.user) {
      // logout
      this.props.pushState('/login');
    }
  }

  compareVersions(serverVersion = '0.0.0', clientVersion = '0.0.0') {
    const serverSubversions = serverVersion.split('.');
    const clientSubversions = clientVersion.split('.');
    for (let subversionIndex = 0; subversionIndex < serverSubversions.length; subversionIndex++) {
      const serverSubversion = parseInt(serverSubversions[subversionIndex], 10);
      const clientSubversion = parseInt(clientSubversions[subversionIndex], 10);
      if (serverSubversion !== clientSubversion) {
        return serverSubversion - clientSubversion;
      }
    }
    return 0;
  }

  @autobind
  handleLogout(event) {
    event.preventDefault();
    this.props.logout();
  }

  @autobind
  collapseNavbar() {
    document.querySelector('.navbar-toggle').click();
  }

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
              <LinkContainer to="/sheets" onClick={this.collapseNavbar} >
                <NavItem eventKey={1} >Sheets</NavItem>
              </LinkContainer>
              <LinkContainer to="/campaigns" onClick={this.collapseNavbar} >
                <NavItem eventKey={2} >Campaigns</NavItem>
              </LinkContainer>
              <LinkContainer to="/views" onClick={this.collapseNavbar} >
                <NavItem eventKey={3} >Views</NavItem>
              </LinkContainer>
              {user ?
                <LinkContainer to="/logout" onClick={this.collapseNavbar} >
                  <NavItem eventKey={8} onClick={this.handleLogout}>Logout</NavItem>
                </LinkContainer>
                :
                <LinkContainer to="/login" onClick={this.collapseNavbar} >
                  <NavItem eventKey={8}>Login</NavItem>
                </LinkContainer>
              }
              {user ? <LinkContainer to={'/user'} onClick={this.collapseNavbar} >
                <NavItem eventKey={9} >
                  {user.get('photoURL') ? <img src={user.get('photoURL')} className={styles.User_image} /> : null} {user.get('displayName') || user.get('email')}
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

      {modal && modal.isOpen ? <Modal closeModal={this.props.closeModal} {...modal} /> : null }
      </div>
    );
  }
}
