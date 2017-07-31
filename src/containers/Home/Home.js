import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Button } from 'components';
import { Link } from 'react-router';

export default class Home extends Component {

  render() {
    const styles = require('./Home.scss');

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">

          <h1>Welcome to Fate Manager</h1>
          <p><em>Your toolbox for running and playing FATE CORE RPG.</em></p>

          <p>So far, You can manage your <Link to="/sheets" ><Button link>sheets</Button></Link>, <Link to="/campaigns" ><Button link>campaigns</Button></Link> and <Link to="/views" ><Button link>views</Button></Link>.</p>
        </div>

      </div>
    );
  }
}
