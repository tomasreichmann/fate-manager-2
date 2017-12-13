import React, { Component } from 'react';
import autobind from 'autobind-decorator';
import { isEqual } from 'lodash';

export default function firebaseConnect2(db, getConnectors) {
  return (WrappedComponent) => {
    return class extends Component {

      constructor(props) {
        super(props);

        this.connectors = [];
        this.listeners = [];
        this.state = {
          done: false,
          props: {},
        };
      }

      updateConnectors(props) {
        const newConnectors = typeof getConnectors === 'function' ? getConnectors(props) : getConnectors;
        if (!isEqual(newConnectors, this.connectors)) {
          // unsubscribe old listeners
          this.connectors.forEach( (connector) => {
            this.unsubscribeListener(connector);
          } );

          // save new connectors
          this.connectors = newConnectors;

          // subscribe new listeners
          this.connectors.forEach( (connector) => {
            this.subscribeListener(connector, props);
          } );
        }
      }

      unsubscribeListener(connector) {
        if (connector.ref) {
          connector.ref.off(connector.event || 'value', connector.callback);
        }
      }

      componentWillReceiveProps(nextProps) {
        if (!isEqual(nextProps, this.props) ) {
          this.updateConnectors(nextProps);
        }
      }

      componentWillMount() {
        this.updateConnectors(this.props);
      }

      componentWillUnmount() {
        this.connectors.forEach( (connector) => {
          this.unsubscribeListener(connector);
        } );
      }

      subscribeListener(connector, props) {
        const { once = false, event = 'value', path } = connector;
        connector.ref = db.ref(path);
        connector.callback = snapshot => this.onUpdate(connector, snapshot, props);
        const method = once ? 'once' : 'on';
        let subscriber = connector.ref;

        if (connector.orderByChild) {
          subscriber = subscriber.orderByChild(connector.orderByChild);
        } else if (connector.orderByKey) {
          subscriber = subscriber.orderByKey(connector.orderByKey);
        } else if (connector.orderByValue) {
          subscriber = subscriber.orderByValue(connector.orderByValue);
        }

        if (connector.limitToFirst) {
          subscriber = subscriber.limitToFirst(connector.limitToFirst);
        } else if (connector.limitToLast) {
          subscriber = subscriber.limitToLast(connector.limitToLast);
        } else if (connector.equalTo) {
          subscriber = subscriber.equalTo(connector.equalTo);
        } else {
          if (connector.startAt) {
            subscriber = subscriber.startAt(connector.startAt);
          }
          if (connector.endAt) {
            subscriber = subscriber.endAt(connector.endAt);
          }
        }

        subscriber[method](event, connector.callback);
      }

      @autobind
      checkDone() {
        return !this.connectors.some( (connector) => !connector.snapshot );
      }

      @autobind
      onUpdate(updatedConnector, snapshot) {
        updatedConnector.snapshot = snapshot;
        updatedConnector.props = updatedConnector.getProps(updatedConnector.snapshot);
        const allConnectorProps = this.connectors.reduce( (allProps, connector) => {
          const props = connector.props || {};
          return {
            ...allProps,
            ...props
          };
        }, {} );

        this.setState({
          done: this.checkDone(),
          props: allConnectorProps,
        });
      }

      render() {
        const { ...props } = this.props;
        return <WrappedComponent firebaseConnectDone={this.state.done} {...props} {...this.state.props} />;
      }
    };
  };
}
