import React, { Component, PropTypes } from 'react';
import { Image, FormGroup, Input } from 'components';
import { injectProps } from 'relpers';

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
      imageUrl, modeCover, modeContain, mode1to1, rotate90, rotate180, rotate270, fullscreen
    } = props;
    const styles = require('./ImageContent.scss');
    return preview ? <Image {...props} admin={admin} /> : (<div className={styles.ImageContent} {...props} admin={admin} >
      <FormGroup childTypes={['full']}>
        <Input label="URL" type="text" name="imageUrl" value={imageUrl} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/imageUrl' }} />
        <Input inline label="ModeCover" type="checkbox" name="modeCover" value={modeCover} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/modeCover' }} />
        <Input inline label="ModeContain" type="checkbox" name="modeContain" value={modeContain} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/modeContain' }} />
        <Input inline label="Mode1to1" type="checkbox" name="mode1to1" value={mode1to1} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/mode1to1' }} />
        <Input inline label="Rotate90" type="checkbox" name="rotate90" value={rotate90} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/rotate90' }} />
        <Input inline label="Rotate180" type="checkbox" name="rotate180" value={rotate180} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/rotate180' }} />
        <Input inline label="Rotate270" type="checkbox" name="rotate270" value={rotate270} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/rotate270' }} />
        <Input inline label="Fullscreen" type="checkbox" name="fullscreen" value={fullscreen} handleChange={handleChange} handleChangeParams={{...handleChangeParams, path: 'componentProps/fullscreen' }} />
      </FormGroup>
    </div>);
  }
}
