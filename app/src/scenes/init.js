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

  initPush() {
    // first init OneSignal
    this.setState({progressText: 'Initialisiere Push Dienst..'})
    return new Promise((resolve, reject) =>  {
      console.log("init push")
      push.init(resolve, reject)
    })    
  }

  registerDevice() {
    // console.log("registerDevice")
    this.setState({progressText: 'Registriere Gerät..'})
    return new Promise((resolve, reject) =>  {
      api.registerDevice(resolve, reject)
    })
  }

  getCategories() {
    // console.log("getCategories")
    this.setState({progressText: 'Hole Kategorien..'})
    return new Promise((resolve, reject) =>  {
      api.getCategories(resolve, reject)
    })
  }

  getSubscriptions() {
    // console.log("getSubscriptions")
    this.setState({progressText: 'Hole Subscriptions..'})
    return new Promise((resolve, reject) =>  {
      api.getSubscriptions(resolve, reject)
    })
  }

  saveCategories(categories) {
    console.log("AsyncStorage.setItem", categories)
    this.setState({progressText: 'Cache Kategorien..'})
    return AsyncStorage.setItem('@TW:categories', JSON.stringify(categories))
  }
  saveSubscriptions(subscriptions) {
    console.log("AsyncStorage.setItem", subscriptions)
    this.setState({progressText: 'Cache Subscriptions..'})
    return AsyncStorage.setItem('@TW:subscriptions', JSON.stringify(subscriptions))
  }

  async componentDidMount() {
    try {
      let done = await this.initPush()
      let verified = await this.registerDevice()
      // verified = true // TEST!!

      if (!verified) {
        // console.log("mustVerify")
        Actions.mustVerify()
        return
      } 

      let categories = await this.getCategories()
      let catStored = await this.saveCategories(categories)

      let subscriptions = await this.getSubscriptions()
      let subsStored = await this.saveSubscriptions(subscriptions)
      
      // then switch to Main scene
      // console.log("Actions.main")
      this.setState({progressText: 'Lade Maske..'})
      Actions.main()
    
    // show errors
    } catch(error) {
      // console.error(error)
      this.setState({
        progressText: `Es ist ein Fehler aufgetreten: ${error}`,
        skipButton: true,
        spinner: false
      })
    }
  }

  render() {
    return (
        <View style={[styles.body, {flex: 1, flexDirection: 'column'}]}>
          <View style={{flex: 1}}>
            <Header/>
          </View>
          <View style={{flex: 5}}>
              <View style={styles.initContainer}>
                <Text style={{marginBottom: 20}}>{this.state.progressText}</Text>
                {this.state.skipButton ? <Button title="Überspringen" onPress={Actions.main} /> : null}
                {this.state.spinner ? <ActivityIndicator size="large" /> : null }
              </View>
          </View>
        </View>
    )
  }
}
