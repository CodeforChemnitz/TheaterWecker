import React, { Component } from 'react'
import { View, StyleSheet, Text, Button, ActivityIndicator, AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux';
import Header from '../components/header'
import push from '../lib/push'
import api from '../lib/api'
import styles from '../styles'

// AsyncStorage: https://facebook.github.io/react-native/docs/asyncstorage.html
// ActivityIndicator: https://facebook.github.io/react-native/docs/activityindicator.html

export default class InitScene extends Component {
  constructor(props) {
    super(props);
    this.state = {
      progressText: 'Gleich gehts los..',
      skipButton: false,
      spinner: true
    }
  }
  showProgress = true

  initPush(routingStatus) {
    // first init OneSignal
    return new Promise((resolve, reject) => {
      console.log("initPush")
      if (this.showProgress) this.setState({progressText: 'Initialisiere Push Dienst..'})
      return push.init(resolve, reject, routingStatus)
    })
  }

  registerDevice() {
    // console.log("registerDevice")
    return new Promise((resolve, reject) => {
      console.log("registerDevice")
      if (this.showProgress) this.setState({progressText: 'Registriere Gerät..'})
      return api.registerDevice(resolve, reject)
    })
  }

  getCategories() {
    // console.log("getCategories")
    return new Promise((resolve, reject) => {
      console.log("getCategories")
      if (this.showProgress) this.setState({progressText: 'Hole Kategorien..'})
      return api.getCategories(resolve, reject)
    })
  }

  getSubscriptions() {
    return new Promise((resolve, reject) => {
      console.log("getSubscriptions")
      if (this.showProgress) this.setState({progressText: 'Hole Subscriptions..'})
      return api.getSubscriptions(resolve, reject)
    })
  }

  saveCategories(categories, showText) {
    // return new Promise((resolve, reject) => {
      console.log("AsyncStorage.setItem", categories)
      if (this.showProgress) this.setState({progressText: 'Cache Kategorien..'})
      return AsyncStorage.setItem('@TW:categories', JSON.stringify(categories)) //, reject)
    // })
  }

  saveSubscriptions(subscriptions) {
    // return new Promise((resolve, reject) => {
      console.log("AsyncStorage.setItem", subscriptions)
      if (this.showProgress) this.setState({progressText: 'Cache Subscriptions..'})
      return AsyncStorage.setItem('@TW:subscriptions', JSON.stringify(subscriptions)) //, reject)
    // })
  }

  componentDidMount() {
    let routingStatus = {
      routeChanged: false, 
      canRouteToMain: false, 
      disableProgress: () => {
        this.showProgress = false
      }}
    this.initPush(routingStatus) // Promise
      .then(() => { 
        console.log("%c registerDevice geht los", "color: blue")
        return this.registerDevice()
      })

      .then((verified) => {
        console.log("%c registerDevice sollte durch sein", "color: blue")
        // verified = true // TEST!!
        if (!verified) {
          // console.log("mustVerify")
          Actions.mustVerify()
          return Promise.resolve()
        }
        console.log("%c mit getCategories weiter", "color: blue")
        return this.getCategories()
      })

      .then((categories) => {
        console.log("%c getCategories sollte durch sein, mit saveCategories weiter", "color: blue")
        return this.saveCategories(categories)
      })

      .then((catStored) => {
        console.log("%c saveCategories sollte durch sein, mit getSubscriptions weiter", "color: blue")
        return this.getSubscriptions()
      })

      .then((subscriptions) => {
        console.log("%c getSubscriptions sollte durch sein, mit saveSubscriptions weiter", "color: blue")
        this.saveSubscriptions(subscriptions)
      })

      .then((subsStored) => {
        console.log("%c saveSubscriptions sollte durch sein", "color: blue")
        // hier warten ob evtl. Push verarbeitet werden kann
        if (this.showProgress) this.setState({progressText: 'Initialisierung abgeschlossen'})
        // then switch to Main scene
        if (!routingStatus.routeChanged) {
          routingStatus.canRouteToMain = true  // ab hier wieder okay
          console.log("Actions.main")
          if (this.showProgress) this.setState({progressText: 'Lade Maske..'})
          Actions.main()
        }
      })
      
      // show errors
      .catch((error) => {
        console.warn(error)
        if (this.showProgress) this.setState({
          progressText: `Es ist ein Fehler aufgetreten: ${error}`,
          skipButton: true,
          spinner: false
        })
      })
  }

  render() {
    return (
        <View style={[styles.body, {flex: 1, flexDirection: 'column'}]}>
          <View style={{flex: 1}}>
            <Header/>
          </View>
          <View style={{flex: 5}}>
              <View style={styles.initContainer}>
                <Text style={{margin: 20}}>{this.state.progressText}</Text>
                {this.state.skipButton ? <Button title="Überspringen" onPress={Actions.main} /> : null}
                {this.state.spinner ? <ActivityIndicator size="large" /> : null }
              </View>
          </View>
        </View>
    )
  }
}
