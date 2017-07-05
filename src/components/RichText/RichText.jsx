import React, { Component } from 'react';
import { injectProps } from 'relpers';

export default class RichText extends Component {
  @injectProps
  render({htmlContent, className = ''}) {
    const styles = require('./RichText.scss');
    const clsMap = {

    };

    const processedClassNames = className.split(' ').concat([styles.RichText], Object.keys(clsMap).reduce( (clsList, cls) => (
      clsMap[cls] ? clsList.concat([styles['RichText__' + cls]]) : clsList
    ), [] ) ).join(' ');

    return <div className={processedClassNames} dangerouslySetInnerHTML={{__html: htmlContent || '<p>-no content-</p>'}} />;
  }
}
