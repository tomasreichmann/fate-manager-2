import React, { Component } from 'react';
import { injectProps } from 'relpers';

export default class Image extends Component {
  @injectProps
  render({imageUrl, modeCover, modeContain, mode1to1, rotate90, rotate180, rotate270, fullscreen}) {
    const styles = require('./Image.scss');
    const clsMap = {
      modeCover, modeContain, mode1to1, rotate90, rotate180, rotate270, fullscreen
    };

    const processedClassNames = [styles.Image].concat( Object.keys(clsMap).reduce( (clsList, cls) => (
      clsMap[cls] ? clsList.concat([styles['Image--' + cls]]) : clsList
    ), [] ) ).join(' ');

    return <div className={processedClassNames} style={{ backgroundImage: 'url(' + imageUrl + ')' }} ></div>;
  }
}
