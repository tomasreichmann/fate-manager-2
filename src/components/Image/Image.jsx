import React, { Component } from 'react';
import { injectProps } from 'relpers';

export default class Image extends Component {
  @injectProps
  render({imageUrl, modeCover, modeContain, mode1to1, rotate90, rotate180, rotate270, fullscreen, className = '', admin}) {
    const styles = require('./Image.scss');
    const clsMap = {
      modeCover, modeContain, mode1to1, rotate90, rotate180, rotate270, fullscreen: fullscreen && !admin
    };

    const processedClassNames = className.split(' ').concat([styles.Image], Object.keys(clsMap).reduce( (clsList, cls) => (
      clsMap[cls] ? clsList.concat([styles['Image--' + cls]]) : clsList
    ), [] ) ).join(' ');

    return (modeCover || modeContain) ?
      <div className={processedClassNames} style={{ backgroundImage: 'url(' + imageUrl + ')' }} ></div>
      : <img className={processedClassNames} src={imageUrl} />
    ;
  }
}
