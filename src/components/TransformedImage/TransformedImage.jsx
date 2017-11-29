import React, { Component, PropTypes } from 'react';
import { cloneDeep } from 'lodash';
import Measure from 'react-measure';

export default class TransformedImage extends Component {
  static propTypes = {
    width: PropTypes.any,
    height: PropTypes.any,
    src: PropTypes.string,
    rotate: PropTypes.number,
    className: PropTypes.string,
    clipMode: PropTypes.string,
    resizeMode: PropTypes.string,
    resizeValue: PropTypes.number,
    horizontalShift: PropTypes.number,
    verticalShift: PropTypes.number,
    fullscreen: PropTypes.bool,
  };

  static defaultProps = {
    width: undefined,
    height: undefined,
    src: undefined,
    horizontalShift: 0,
    verticalShift: 0,
    rotate: 0,
    fullscreen: false,
    clipMode: 'middle|center',
    resizeMode: 'relativeContainerWidth',
    resizeValue: 100,
  };

  constructor(props) {
    super(props);
    this.state = {
      imageWidth: null,
      imageHeight: null
    };
  }

  componentWillMount() {
    this.assignImageDimensions(this.props.src);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.src !== nextProps.src ) {
      this.assignImageDimensions(nextProps.src);
    }
  }

  getStyles(props, state) {
    const { rotate, resizeMode, resizeValue, clipMode, width, height, fullscreen, horizontalShift, verticalShift } = props;
    const { imageWidth, imageHeight } = state;
    const { rotatedWidth, rotatedHeight, topOffset, leftOffset } = this.getRotatedDimensions(imageWidth, imageHeight, rotate);
    const rotatedAspectRatio = rotatedHeight / rotatedWidth;
    const rotatedWidthMod = imageWidth / rotatedWidth;

    const imageStyles = {
      position: 'absolute',
      display: 'block',
      transform: 'rotate(' + rotate + 'deg)',
      top: (topOffset / rotatedHeight * 100) + '%',
      left: (leftOffset / rotatedWidth * 100) + '%',
      width: rotatedWidthMod * 100 + '%',
    };

    const [ clipModeVertical, clipModeHorizontal ] = clipMode.split('|');

    const wrapperStyles = {
      display: 'block',
      position: 'relative',
    };

    let wrapperWidth = null;

    let invalidResizeMode = (resizeMode === 'contain' || resizeMode === 'cover')
      && !height && !fullscreen;

    const resizeModes = [
      'relativeContainerWidth',
      'contain',
      'cover',
      'relativeContainerHeight',
      'relativeImageSize',
      'absoluteWidth',
      'absoluteHeight',
    ];

    let containerWidth = parseFloat(width) || this.state.containerWidth;
    let containerHeight = parseFloat(height) || this.state.containerHeight;

    const containerStyles = {
      display: 'block',
      position: 'relative',
    };

    if (fullscreen) {
      containerWidth = Math.max(document ? document.documentElement.clientWidth : 0, window ? window.innerWidth : 0, 0);
      containerHeight = Math.max(document ? document.documentElement.clientHeight : 0, window ? window.innerHeight : 0, 0);
      containerStyles.position = 'fixed';
      containerStyles.top = 0;
      containerStyles.right = 0;
      containerStyles.bottom = 0;
      containerStyles.left = 0;
      containerStyles.backgroundColor = '#000000';
    }

    if (!resizeModes.includes(resizeMode)) {
      invalidResizeMode = true;
    }

    if (invalidResizeMode) {
      console.warn('invalidResizeMode!', resizeMode);
    }

    const resizeMod = parseFloat(resizeValue) / 100;

    if (resizeMode === 'relativeContainerWidth' || invalidResizeMode) {
      wrapperWidth = containerWidth * resizeMod;
    } else if (resizeMode === 'contain') {
      wrapperWidth = containerWidth * resizeMod;
      if (containerWidth * rotatedAspectRatio > containerHeight) {
        wrapperWidth = containerHeight / rotatedAspectRatio * resizeMod;
      }
    } else if (resizeMode === 'cover') {
      wrapperWidth = containerWidth * resizeMod;
      if (containerWidth * rotatedAspectRatio < containerHeight) {
        wrapperWidth = containerHeight / rotatedAspectRatio * resizeMod;
      }
    } else if (resizeMode === 'relativeContainerHeight') {
      wrapperWidth = containerWidth / rotatedAspectRatio * resizeMod;
    } else if (resizeMode === 'relativeImageSize') {
      wrapperWidth = rotatedWidth * resizeMod;
    } else if (resizeMode === 'absoluteWidth') {
      wrapperWidth = parseFloat(resizeValue);
    } else if (resizeMode === 'absoluteHeight') {
      wrapperWidth = parseFloat(resizeValue) / rotatedAspectRatio;
    }
    const wrapperHeight = wrapperWidth * rotatedAspectRatio;

    wrapperStyles.width = wrapperWidth;
    wrapperStyles.height = wrapperHeight;
    containerStyles.overflow = 'hidden';

    if (clipModeHorizontal === 'center') {
      wrapperStyles.left = (containerWidth - wrapperWidth) / 2;
    } else if (clipModeHorizontal === 'right') {
      wrapperStyles.left = containerWidth - wrapperWidth;
    } else {
      wrapperStyles.left = 0;
    }

    if (clipModeVertical === 'middle') {
      wrapperStyles.top = (containerHeight - wrapperHeight) / 2;
    } else if (clipModeVertical === 'bottom') {
      wrapperStyles.top = containerHeight - wrapperHeight;
    } else {
      wrapperStyles.top = 0;
    }

    wrapperStyles.left = wrapperStyles.left + parseFloat(horizontalShift);
    wrapperStyles.top = wrapperStyles.top + parseFloat(verticalShift);

    return {
      imageStyles,
      wrapperStyles,
      containerStyles,
    };
  }

  getRotatedDimensions(imageWidth, imageHeight, rotate) {
    const point1 = { x: 0, y: 0 };
    const point2 = { x: imageWidth, y: 0 };
    const point3 = { x: imageWidth, y: imageHeight };
    const point4 = { x: 0, y: imageHeight };
    const pivot = { x: imageWidth / 2, y: imageHeight / 2 };

    const rotatedPoint1 = this.rotatePoint(point1, pivot, rotate);
    const rotatedPoint2 = this.rotatePoint(point2, pivot, rotate);
    const rotatedPoint3 = this.rotatePoint(point3, pivot, rotate);
    const rotatedPoint4 = this.rotatePoint(point4, pivot, rotate);

    const xMin = Math.min(rotatedPoint1.x, rotatedPoint2.x, rotatedPoint3.x, rotatedPoint4.x);
    const xMax = Math.max(rotatedPoint1.x, rotatedPoint2.x, rotatedPoint3.x, rotatedPoint4.x);

    const yMin = Math.min(rotatedPoint1.y, rotatedPoint2.y, rotatedPoint3.y, rotatedPoint4.y);
    const yMax = Math.max(rotatedPoint1.y, rotatedPoint2.y, rotatedPoint3.y, rotatedPoint4.y);

    return {
      rotatedWidth: xMax - xMin,
      rotatedHeight: yMax - yMin,
      topOffset: -yMin,
      leftOffset: -xMin,
    };
  }

  rotatePoint(point, pivot, angle) {
    const radAngle = Math.radians(angle);
    return {
      x: Math.cos(radAngle) * (point.x - pivot.x) - Math.sin(radAngle) * (point.y - pivot.y) + pivot.x,
      y: Math.sin(radAngle) * (point.x - pivot.x) + Math.cos(radAngle) * (point.y - pivot.y) + pivot.y
    };
  }

  assignImageDimensions(url) {
    this.setState({
      imageWidth: null,
      imageHeight: null,
    });
    if (!url) {
      return;
    }
    const img = new Image();
    img.addEventListener('load', () => {
      this.setState({
        imageWidth: img.naturalWidth,
        imageHeight: img.naturalHeight,
      });
    });
    img.src = url;
  }

  render() {
    const { src, className } = this.props;

    if (!this.state.imageWidth) {
      return <span>loading or could not load image</span>;
    }

    const {
      imageStyles,
      wrapperStyles,
      containerStyles,
    } = this.getStyles(this.props, this.state);

    return (
      <Measure
        bounds
        onResize={(contentRect) => {
          this.setState({
            containerWidth: contentRect.bounds.width,
            containerHeight: contentRect.bounds.height,
          });
        }}
      >
        {({ measureRef }) =>
          <span ref={measureRef} style={cloneDeep(containerStyles)} className={className} >
            <span style={cloneDeep(wrapperStyles)} >
              <img
                src={src}
                style={imageStyles}
              />
            </span>
          </span>
        }
      </Measure>);
  }
}
