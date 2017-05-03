import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
// import { Link } from 'react-router';
import config from '../../config';
import Helmet from 'react-helmet';
import { Input, SheetList } from 'components';

@connect(
  state => ({sheets: state.firebase.getIn(['sheets', 'list'])})
)
export default class Home extends Component {
  static propTypes = {
    sheets: PropTypes.object
  };
  static contextTypes = {
    store: PropTypes.object.isRequired
  };
  render() {
    const styles = require('./Home.scss');
    const {sheets} = this.props;
    // require the logo image both from client and server

    console.log('render sheets', sheets );

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">
          <h1>{config.app.title}</h1>

          Input2: <Input type="textarea" val="xxxxxxxx" />

          <SheetList sheets={sheets} />

        </div>

      </div>
    );
  }
}
