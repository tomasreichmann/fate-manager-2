import React, { Component } from 'react';
import { injectProps } from 'relpers';
import { Alert, TransformedImage } from 'components';
import { capitalizeFirstLetter } from '../../utils/utils';
import classnames from 'classnames';

export default class Image extends Component {
  @injectProps
  render({
    imageUrl,
    rotate = 0,
    fullscreen,
    clipMode = 'middle|center',
    resizeMode = 'relativeContainerWidth',
    resizeValue = 100,
    className = '',
    admin,
    ...props
  }) {
    const styles = require('./Image.scss');
    const [ clipModeVertical, clipModeHorizontal ] = clipMode.split('|');
    const isFullscreen = fullscreen && !admin;
    const shouldResetResizeMode = isFullscreen && ['cover', 'contain', 'relativeContainerHeight'].includes(resizeMode);
    const currentResizeMode = shouldResetResizeMode ? 'relativeContainerWidth' : resizeMode;

    const clsMap = classnames(
      styles.Image__clipVertical__ + capitalizeFirstLetter(clipModeVertical),
      styles.Image__clipHorizontal__ + capitalizeFirstLetter(clipModeHorizontal),
      styles.Image__resizeMode__ + capitalizeFirstLetter(currentResizeMode),
      {
        [styles.Image__fullscreen]: isFullscreen
      },
    );

    const processedClassNames = className.split(' ').concat([styles.Image], Object.keys(clsMap).reduce( (clsList, cls) => (
      clsMap[cls] ? clsList.concat([styles['Image--' + cls]]) : clsList
    ), [] ) ).join(' ');

    if (!imageUrl) {
      return <Alert>No image selected</Alert>;
    }

    return (<TransformedImage
      rotate={rotate}
      className={processedClassNames}
      src={imageUrl}
      clipMode={clipMode}
      resizeMode={resizeMode}
      resizeValue={resizeValue}
      fullscreen={isFullscreen}
      admin={admin}
      {...props}
    />);
  }
}
