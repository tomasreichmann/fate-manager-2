import React, { Component, PropTypes } from 'react';
import { Image, FormGroup, Input, RadioButtonGroup } from 'components';
import { injectProps } from 'relpers';

const AlignIcon = ({vertical, horizontal, size = 30, squareSize = 20, strokeWidth = 4, color = 'white'}) => {
  const alignmentMap = {
    top: 0,
    middle: (size - squareSize) / 2,
    bottom: (size - squareSize),
    left: 0,
    center: (size - squareSize) / 2,
    right: (size - squareSize),
  };
  const xCor = alignmentMap[horizontal];
  const yCor = alignmentMap[vertical];

  return (<svg width={size} height={size} viewBox={'0 0 ' + size + ' ' + size} xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width={ size } height={ size } stroke={color} strokeWidth={strokeWidth} fill="transparent" />
    <rect x={xCor} y={yCor} width={ squareSize } height={ squareSize } fill={color} strokeWidth="0" />
  </svg>);
};

export default class ImageContent extends Component {
  static propTypes = {
    preview: PropTypes.bool,
    admin: PropTypes.bool,
    handleChange: PropTypes.func,
    handleChangeParams: PropTypes.any,
  }

  @injectProps
  render({
    preview = false,
    admin = false,
    handleChange,
    handleChangeParams,
    ...props,
  } = {}) {
    const {
      imageUrl,
      rotate = 0,
      fullscreen = false,
      clipMode = 'middle|center',
      resizeMode = 'relativeContainerWidth',
      resizeValue = 100,
      horizontalShift = 0,
      verticalShift = 0,
    } = props;

    const resizeOptionsMap = {
      cover: {
        label: 'Cover',
        inputFormat: '%',
      },
      contain: {
        label: 'Contain',
        inputFormat: '%',
      },
      relativeContainerWidth: {
        label: 'Relative to container width',
        inputFormat: '%',
      },
      relativeContainerHeight: {
        label: 'Relative to container height',
        inputFormat: '%',
      },
      relativeImageSize: {
        label: 'Relative size to original image',
        inputFormat: '%',
      },
      absoluteWidth: {
        label: 'Absolute width',
        inputFormat: 'px',
      },
      absoluteHeight: {
        label: 'Absolute height',
        inputFormat: 'px',
      },
    };

    const currentResizeOptions = resizeOptionsMap[resizeMode];

    const resizeOptions = Object.keys(resizeOptionsMap).map(resizeModeKey => ({
      value: resizeModeKey,
      label: resizeOptionsMap[resizeModeKey].label
    }));

    const verticalAlign = ['top', 'middle', 'bottom'];
    const horizontalAlign = ['left', 'center', 'right'];

    const clipModes = verticalAlign.map((verticalMode) => (
      horizontalAlign.map((horizontalMode) => (
        {
          label: <div><AlignIcon vertical={verticalMode} horizontal={horizontalMode} /></div>,
          value: verticalMode + '|' + horizontalMode,
          buttonProps: { noClip: true, appIcon: true, primary: true, title: verticalMode + ' ' + horizontalMode }
        }
      ))
    ));

    const styles = require('./ImageContent.scss');
    return preview ? <Image {...props} admin={admin} /> : (<div className={styles.ImageContent} {...props} admin={admin} >
      <FormGroup childTypes={['full', null, null, null, null, 'full']}>
        <Input label="URL" type="text" name="imageUrl" placeholder="//example.com/image.jpg" value={imageUrl} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/imageUrl' }} />
        <Input label="Horizontal shift" type="number" name="horizontalShift" step={10} value={horizontalShift} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/horizontalShift' }} />
        <Input label="Vertical shift" type="number" name="verticalShift" step={10} value={verticalShift} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/verticalShift' }} />
        <Input label="Rotate" type="number" name="rotate" step={45} value={rotate} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/rotate' }} />
        <FormGroup>
          <Input label="Sizing" type="select" value={resizeMode} options={resizeOptions} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/resizeMode' }} />
          <Input inline labelAfter={currentResizeOptions.inputFormat} type="number" name="resizeValue" value={resizeValue} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/resizeValue' }} />
          <Input inline labelAfter="Fullscreen" type="checkbox" name="fullscreen" value={fullscreen} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/fullscreen' }} />
        </FormGroup>
        <div>
          <h5>Clipping</h5>
          { clipModes.map(clipVerticalMode => <div>
            <RadioButtonGroup block value={clipMode} options={clipVerticalMode}
              onChange={handleChange} onChangeParams={{...handleChangeParams, path: 'componentProps/clipMode' }}/>
          </div>) }
        </div>
      </FormGroup>
      <Image {...props} admin={admin} />
    </div>);
  }
}
