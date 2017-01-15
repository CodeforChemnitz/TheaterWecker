import React, { Component } from 'react'
import { Router, Scene, Modal, ActionConst } from 'react-native-router-flux';
import InitScene from '../scenes/init'
import MainScene from '../scenes/app'
import ErrorScene from '../scenes/error'
import SuccessScene from '../scenes/thanks'

// Router Tuorial: https://github.com/aksonov/react-native-router-flux/blob/master/docs/MINI_TUTORIAL.md

export default class App extends Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <Router>
        <Scene key="init" component={InitScene} title="Init" initial={true} type={ActionConst.REPLACE} />
        <Scene key="main" component={MainScene} title="Main" type={ActionConst.REPLACE} />
        <Scene key="error" component={ErrorScene} title="Error" type={ActionConst.REPLACE} />
        <Scene key="success" component={ThanksScene} title="Success" type={ActionConst.REPLACE} />
      </Router>
    )
  }
}
