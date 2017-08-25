import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Button, Image } from 'components';
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

          <h2>This is ALPHA VERSION!</h2>
          <p>Let me know if you are having problems: <a href="https://www.facebook.com/tomasreichmann" target="_blank" >Facebook</a> / Whatsupp</p>
          <p><Image mode1to1 imageUrl="https://vignette3.wikia.nocookie.net/roblox-medieval-warfare-reforged/images/0/08/Resized_courage-wolf-meme-generator-im-gonna-be-alpha-u-got-a-problem-with-that-cf9fdb.jpg/revision/latest?cb=20150311022101" /></p>

          <h2>TO DO</h2>
          <p>Resolve createdBy displayName</p>
          <p>Template editing</p>
          <p>Icons</p>

          <h2>Changelog</h2>

          <h3>25/08/17</h3>
          <p>Textarea autosizing</p>
          <p>Markdown Sheet descriptions</p>

          <h3>24/08/17</h3>
          <p>Sheet images</p>
          <p>Breadcrumbs</p>
          <p>Homepage update</p>
          <p>Campaign, Document created, createdBy</p>

        </div>

      </div>
    );
  }
}
