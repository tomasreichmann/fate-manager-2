import React, { Component } from 'react';
import Helmet from 'react-helmet';
import { Button, Image, FormGroup } from 'components';
import { Link } from 'react-router';
import { FaDesktop, FaFileText, FaFlag } from 'react-icons/lib/fa';

export default class Home extends Component {
  render() {
    const styles = require('./Home.scss');

    return (
      <div className={styles.home}>
        <Helmet title="Home"/>

        <div className="container">

          <h1>Welcome to Fate Manager</h1>
          <p><em>Your toolbox for running and playing FATE CORE RPG.</em></p>

          <p>So far, You can manage</p>

          <FormGroup>
            <Link to="/sheets" ><Button primary appIcon><FaFileText size="30" /><br />sheets</Button></Link>
            <Link to="/campaigns" ><Button secondary appIcon><FaFlag size="30" /><br />campaigns</Button></Link>
            <Link to="/views" ><Button info appIcon><FaDesktop size="30" /><br />views</Button></Link>
          </FormGroup>

          <h2>This is ALPHA VERSION!</h2>
          <p>Let me know if you are having problems: <a href="https://www.facebook.com/tomasreichmann" target="_blank" >Facebook</a> / Whatsupp</p>
          <p><Image mode1to1 imageUrl="https://vignette3.wikia.nocookie.net/roblox-medieval-warfare-reforged/images/0/08/Resized_courage-wolf-meme-generator-im-gonna-be-alpha-u-got-a-problem-with-that-cf9fdb.jpg/revision/latest?cb=20150311022101" /></p>

          <h2>TO DO</h2>
          <p>Read-only documents</p>
          <p>Template editing</p>
          <p>Sheet list paging and search</p>

          <h2>Changelog</h2>

          <h3>30/09/17</h3>
          <p><strong>Private campaigns, documents<br />(hidden in lists unless created by current user)</strong></p>
          <p>Views, campaigns, documents show CreatedBy user with link to profile</p>
          <p>Profiles list created campaigns</p>

          <h3>2/09/17</h3>
          <p><strong>Private sheets<br />(Private sheets still listed in Sheets but hidden on campaign detail page unless created by current user)</strong></p>
          <p><strong>SheetList shows CreatedBy user with link to profile</strong></p>
          <p>NPC sheets - just a tag with an icon</p>
          <p>SheetBlock style update</p>

          <h3>30/08/17</h3>
          <p><strong>App version checking with autoreload</strong></p>
          <p>SheetBlocks cosmetic update, image, description clipping</p>

          <h3>27/08/17</h3>
          <p>Icons</p>

          <h3>25/08/17</h3>
          <p>Campaign descriptions</p>
          <p>Persistent login</p>
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
