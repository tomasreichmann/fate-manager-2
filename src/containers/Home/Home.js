import React, { Component } from 'react';
import Helmet from 'react-helmet';

export default class Home extends Component {

  render() {
    const styles = require('./Home.scss');

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">

          <h1>Welcome to Fate Manager</h1>
          <p><em>Your toolbox for running and playing FATE CORE RPG.</em></p>

          <p>So far, You can manage your sheets. Later we will add campaign management.</p>

        </div>

      </div>
    );
  }
}
