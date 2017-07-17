import React, { Component, PropTypes } from 'react';
import ReactCSSTransitionGroup from 'react-addons-css-transition-group';
import { seq } from 'utils/utils';

export default class Loading extends Component {

  static propTypes = {
    children: PropTypes.any,
    show: PropTypes.bool,
  };

  constructor(props) {
    super(props);
    this.rollValues = {
      0: 'minus',
      1: 'null',
      2: 'plus'
    };
  }

  componentWillMount() {
    const seq4 = seq(4);
    this.state = {
      roll: seq4.map( () => (
        ~~(Math.random() * 3)
      ) ),
      randomRotate: seq4.map( () => (
        ~~(Math.random() * 30) + 'deg'
      ) ),
      randomTranslateX: seq4.map( () => (
        ~~(Math.random() * 10) + 'px'
      ) ),
      randomTranslateY: seq4.map( () => (
        ~~(Math.random() * 10) + 'px'
      ) )
    };
  }

  render() {
    const styles = require('./Loading.scss');

    return (<ReactCSSTransitionGroup
        transitionName="Loading-"
        transitionEnterTimeout={500}
        transitionLeaveTimeout={500}
        {...this.props}
      >
      { this.props.show ? <div className={styles.Loading} >
        <div className={styles['Loading-dice']} key="dice" >
          {this.state.roll.map( (rollItem, index) => (
            <div className={styles['Loading--randomize']} key={'randomize-' + index} style={{
              transform: 'rotateZ(' + this.state.randomRotate[index] + ') translateX(' + this.state.randomTranslateX[index] + ') translateY(' + this.state.randomTranslateY[index] + ')'
            }} >
              <div className={styles['Loading-die'] + ' ' + styles['Loading-die-' + this.rollValues[rollItem]]} key={'die-' + index} >
                <div className={styles['Loading-die-face'] + ' ' + styles['Loading-die-face-z']}></div>
                <div className={styles['Loading-die-face'] + ' ' + styles['Loading-die-face-x']}></div>
                <div className={styles['Loading-die-face'] + ' ' + styles['Loading-die-face-y']}></div>
              </div>
            </div>
          ) )}
          </div>
          { this.props.children ? <div className={styles['Loading-message']} key="message" >{this.props.children}</div> : null }
        </div> : null
      }
    </ReactCSSTransitionGroup>);
  }

}
