import React, { Component, PropTypes } from 'react';
// import { killEvent } from 'relpers';
import { partial } from 'lodash';
import { Map, List } from 'immutable';
import autobind from 'autobind-decorator';
import { RadioButtonGroup, FormGroup, User, Input, Button } from 'components';
import classnames from 'classnames';
import { sortByKey } from 'utils/utils';
import { FaTrash, FaKey } from 'react-icons/lib/fa';

export default class AccessControls extends Component {
  static propTypes = {
    className: PropTypes.string,
    onChange: PropTypes.func.isRequired,
    onChangeParams: PropTypes.object,
    users: PropTypes.object.isRequired,
    access: PropTypes.object.isRequired,
  };

  static defaultProps = {
    className: '',
    users: new Map(),
    access: new Map({
      isPublic: true,
      exceptions: new Map(),
    }),
    onChangeParams: undefined,
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  @autobind
  onChange(value, {path}) {
    const selectedUid = this.exceptionsSelect.value;
    const pathFragments = path.split('/');
    console.log('onChange value', value);

    let { access } = this.props;
    // if path === 'exceptions' > add selectedUid to exceptions
    if (path === 'exceptions') {
      access = access.setIn([...pathFragments, selectedUid], true);
    } else {
      // else modify path with value
      access = access.setIn(pathFragments, value);
    }
    console.log('onChange access', access.toJS());
    this.props.onChange(access.toJSON(), this.props.onChangeParams);
  }

  render() {
    const styles = require('./AccessControls.scss');
    const {
      className,
      users,
      access = new Map()
    } = this.props;

    const cls = classnames([
      styles.AccessControls,
      className
    ]);

    const options = new List([
      {
        label: 'Everyone',
        value: true
      },
      {
        label: 'Just me',
        value: false
      }
    ]);

    const isPublic = access.get('isPublic');
    const exceptions = access.get('exceptions') || new Map();
    console.log('Render access', access.toJS());

    const exceptionUsers = exceptions.map( (selected, uid) => {
      console.log('Render uid', uid);
      return (<span className={styles.AccessControls_userItem}>
        <User key={uid} uid={uid} className={styles.AccessControls_user} />
        <Button danger onClick={this.onChange.bind(this, null)} onClickParams={{ path: 'exceptions/' + uid }} ><FaTrash /></Button>
      </span>);
    } ).sortBy(
      (_selected, uid) => ({ displayName: users.getIn([uid, 'displayName']) || uid }),
      sortByKey('displayName')
    );

    const unselectedUsers = users.filter( (user) => {
      return !exceptions.get( user.get('uid') );
    } ).map( (user, uid) => {
      return {
        label: user.get('displayName') || uid,
        value: uid
      };
    } ).sort( sortByKey('label') );
    console.log('unselectedUsers', unselectedUsers.toJS());

    return (<div className={cls} >
      <FormGroup>
        <h2 className={styles.AccessControls_label}><FaKey />&emsp;Access rights</h2>
        <RadioButtonGroup value={isPublic} options={options} onChange={this.onChange} onChangeParams={{ path: 'isPublic' }} />
        {exceptionUsers.size ? <span className={styles.AccessControls_exceptions}>
          Exceptions:
          {exceptionUsers}
        </span> : null}
        <div>
          <Input inputRef={ (select) => ( this.exceptionsSelect = select ) } type="select" options={unselectedUsers} inline />
          {' '}
          <Button primary onClick={partial(this.onChange, isPublic)} onClickParams={{ path: 'exceptions' }} >Add exception</Button>
        </div>
      </FormGroup>
    </div>);
  }
}
