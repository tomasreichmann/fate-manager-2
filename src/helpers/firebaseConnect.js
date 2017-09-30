import React, { Component } from 'react';
import autobind from 'autobind-decorator';

export default function firebaseConnect(db, initialDefinitions) {
  let initialDefinitionsArray = initialDefinitions || [];
  if (!Array.isArray(initialDefinitions)) {
    initialDefinitionsArray = [initialDefinitions];
  }

  const defs = initialDefinitionsArray.map( (def) => (
    {
      once: false,
      event: 'value',
      adapter: (snapshot) => ( { [def.prop]: snapshot.val() } ),
      ...def,
    }
  ) );

  return (WrappedComponent) => {
    return class extends Component {

      constructor(props) {
        super(props);

        this.listeners = defs.reduce( (listenerMap, def, index) => ( {
          ...listenerMap,
          [index + '__' + def.path]: {
            ...def,
            connected: false
          }
        }), {} );

        this.dbRefs = {};

        this.state = {
          done: !defs.length,
          props: {},
        };
      }

      componentWillReceiveProps(nextProps) {
        Object.keys(this.listeners).map( (listenerKey) => {
          const listener = this.listeners[listenerKey];

          // TODO: update all listeners based on new computed values
          const { path, pathResolver = (passPath) => (passPath), event } = listener;
          const newResolvedPath = pathResolver(path, nextProps);
          if ( newResolvedPath !== listener.resolvedPath ) {
            // unsubscribe previous connection
            listener.ref.off(event, listener.callback);
            // subscribe new connection
            this.subscribeListener(listener, newResolvedPath, nextProps);
          }
        } );
      }

      componentWillMount() {
        // subscribe
        Object.keys(this.listeners).map( (listenerKey) => {
          const listener = this.listeners[listenerKey];
          const { path, pathResolver = (passPath) => (passPath) } = listener;
          const resolvedPath = pathResolver(path, this.props);
          this.subscribeListener(listener, resolvedPath, this.props);
        } );
      }

      componentWillUnmount() {
        // unsubscribe
        Object.keys(this.listeners).map( (key)=>{
          const {ref, event, callback} = this.listeners[key];
          ref.off(event, callback);
        });
      }

      getParamValue(param, props) {
        return typeof param === 'function' ? param(props) : param;
      }

      @autobind
      subscribeListener(listener, resolvedPath, props) {
        const { once, event } = listener;
        listener.updated = false;
        listener.resolvedPath = resolvedPath;
        this.dbRefs[listener.resolvedPath] = this.dbRefs[listener.resolvedPath] || db.ref(listener.resolvedPath);
        listener.ref = this.dbRefs[listener.resolvedPath];
        listener.callback = (snapshot) => this.onUpdate(listener, snapshot);
        const method = once ? 'once' : 'on';
        let subscriber = listener.ref;

        if (listener.orderByChild) {
          subscriber = subscriber.orderByChild(this.getParamValue(listener.orderByChild, props));
        } else if (listener.orderByKey) {
          subscriber = subscriber.orderByKey(this.getParamValue(listener.orderByKey, props));
        } else if (listener.orderByValue) {
          subscriber = subscriber.orderByValue(this.getParamValue(listener.orderByValue, props));
        }

        if (listener.limitToFirst) {
          subscriber = subscriber.limitToFirst(listener.limitToFirst);
        } else if (listener.limitToLast) {
          subscriber = subscriber.limitToLast(listener.limitToLast);
        } else if (listener.equalTo) {
          subscriber = subscriber.equalTo(this.getParamValue(listener.equalTo, props));
        } else if (listener.startAt || listener.endAt) {
          if (listener.startAt) {
            subscriber = subscriber.startAt(this.getParamValue(listener.startAt, props));
          }
          if (listener.endAt) {
            subscriber = subscriber.endAt(this.getParamValue(listener.endAt, props));
          }
        }

        subscriber[method](event, listener.callback);
      }

      @autobind
      checkDone() {
        let allDone = true;
        Object.keys(this.listeners).map( (listenerKey) => {
          const listener = this.listeners[listenerKey];
          allDone = allDone ? !!listener.updated : false;
        });
        return allDone;
      }

      @autobind
      onUpdate(listener, snapshot) {
        listener.updated = true;
        listener.adaptedProps = listener.adapter(snapshot, this.props, this.state.props, listener);
        const allListenerProps = Object.keys(this.listeners).reduce( (allProps, listenerKey) => {
          const { adaptedProps = {} } = this.listeners[listenerKey];
          return {
            ...allProps,
            ...adaptedProps
          };
        }, {} );

        this.setState({
          done: this.checkDone(),
          props: allListenerProps,
        });
      }

      render() {
        const { ...props } = this.props;
        return <WrappedComponent firebaseConnectDone={this.state.done} {...props} {...this.state.props} />;
      }
    };
  };
}
