import React, { Component } from 'react';
import { injectProps } from 'relpers';
import { Alert } from 'components';

export default class RichText extends Component {
  @injectProps
  render({htmlContent, className = ''}) {
    const styles = require('./RichText.scss');
    const clsMap = {

    };

    const processedClassNames = className.split(' ').concat([styles.RichText], Object.keys(clsMap).reduce( (clsList, cls) => (
      clsMap[cls] ? clsList.concat([styles['RichText__' + cls]]) : clsList
    ), [] ) ).join(' ');

    if (!htmlContent || htmlContent.length === 0) {
      return (<Alert className={processedClassNames} >No content</Alert>);
    }

    return <div className={processedClassNames} dangerouslySetInnerHTML={{__html: htmlContent}} />;
  }
}
