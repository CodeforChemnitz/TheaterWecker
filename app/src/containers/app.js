import React, { Component } from 'react'
import { Router, Scene, Modal, ActionConst, Reducer } from 'react-native-router-flux';
import Init from '../scenes/init'
import Main from '../scenes/main'
import Fehler from '../scenes/error'
import Success from '../scenes/success'
import MustVerify from '../scenes/mustVerify'
import EventNotification from '../scenes/eventNotification'
import Webview from '../scenes/webview'


// Router Tuorial: https://github.com/aksonov/react-native-router-flux/blob/master/docs/MINI_TUTORIAL.md
// Ext. Tutorial: https://github.com/aksonov/react-native-router-flux/blob/master/docs/DETAILED_EXAMPLE.md
//     Code dazu: https://github.com/aksonov/react-native-router-flux/blob/master/Example/Example.js

export default class App extends Component {
    constructor(props) {
        super(props);
    }

  render() {
    return (
      <Router>
        <Scene key="root" hideNavBar={true}>
          <Scene key="init" component={Init} initial={true} type={ActionConst.REPLACE} />
          <Scene key="main" component={Main} type={ActionConst.REPLACE} />
          <Scene key="error" component={Fehler} title="Fehler" />
          <Scene key="success" component={Success} title="Success" />
          <Scene key="mustVerify" component={MustVerify}  type={ActionConst.REPLACE} />
          <Scene key="eventNotification" component={EventNotification} type={ActionConst.REPLACE} />
          <Scene key="webview" hideNavBar={false} component={Webview} />
        </Scene>
      </Router>
    )
  }
}
