import React, { Component } from 'react';
// import { Link } from 'react-router';
import config from '../../config';
import Helmet from 'react-helmet';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');
    // require the logo image both from client and server
    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">
          <h1>{config.app.title}</h1>
        </div>

      </div>
    );
  }
}
