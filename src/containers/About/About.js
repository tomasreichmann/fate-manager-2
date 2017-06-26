import React, {Component} from 'react';
import Helmet from 'react-helmet';

export default class About extends Component {

  render() {
    return (
      <div className="container">
        <h1>About</h1>
        <Helmet title="About"/>

        <div>
          This is a sheet manager for FATE CORE 4e.
        </div>
      </div>
    );
  }
}
