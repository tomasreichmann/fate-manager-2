import React, { Component, PropTypes } from 'react';
import { Button, FormGroup } from 'components';

export default class Modal extends Component {
  static propTypes = {
    closeModal: PropTypes.func,
    noCloseButton: PropTypes.bool,
    actions: PropTypes.array,
    danger: PropTypes.bool,
    success: PropTypes.bool,
    primary: PropTypes.bool,
    children: PropTypes.any,
  };

  constructor(props) {
    super(props);
  }

  render() {
    const styles = require('./Modal.scss');
    const {
      closeModal,
      noCloseButton,
      actions,
      danger,
      success,
      primary,
      children,
    } = this.props;
    const cls = [styles.Modal];

    if (danger) {
      cls.push(styles['Modal--danger']);
    }
    if (success) {
      cls.push(styles['Modal--success']);
    }
    if (primary) {
      cls.push(styles['Modal--primary']);
    }

    return (<div className={cls.join(' ')} >
      { noCloseButton ? null : <Button className={styles['Modal-close']} danger onClick={closeModal}>&times;</Button>}
      <div className={styles['Modal-content']} >
        {children || 'empty'}
      </div>
      <FormGroup alignRight className={styles['Modal-actions']} >
        { actions ? actions : <Button className={styles['Modal-ok']} primary onClick={closeModal}>OK</Button>}
      </FormGroup>
    </div>);
  }
}
