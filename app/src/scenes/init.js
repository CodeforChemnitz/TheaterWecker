import React, { Component } from 'react'
import { View, StyleSheet, Text, Button, ActivityIndicator, AsyncStorage } from 'react-native'
import { Actions } from 'react-native-router-flux';
import push from '../lib/push'
import api from '../lib/api'

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

  componentDidMount() {
    // first init OneSignal
    this.setState({progressText: 'Initialisiere Push Dienst..'})
    new Promise((resolve, reject) =>  {
      console.log("init push")
      push.init(resolve, reject)
    })
    
    .then((done) => {
      console.log("registerDevice")
      this.setState({progressText: 'Registriere Gerät..'})
      return new Promise((resolve, reject) =>  {
        api.registerDevice(resolve, reject)
      })
    })

    .then((verified) => {
      // if (!verified) {
      //   console.log("mustVerify")
      //   Actions.mustVerify()
      //   // FIXME: trotz mustVerify landet man im then(categories) ?!
      //   return
      // } 
      console.log("getCategories")
      this.setState({progressText: 'Hole Kategorien..'})
      return new Promise((resolve, reject) =>  {
        api.getCategories(resolve, reject)
      })
    })

    .then((categories) =>  {
      console.log("AsyncStorage.setItem", categories)
      this.setState({progressText: 'Cache Kategorien..'})
      return AsyncStorage.setItem('@TW:categories', JSON.stringify(categories))
    })

    // then switch to Main scene
    .then(() =>  {
      console.log("Actions.main")
      this.setState({progressText: 'Lade Maske..'})
      Actions.main()
    })
    
    // show errors
    .catch((error) => {
      console.error(error)
      this.setState({
        progressText: `Es ist ein Fehler aufgetreten: ${error}`,
        skipButton: true,
        spinner: false
      })
    })
  }

  render() {
    return (
        <View style={styles.container}>
            <Text>{this.state.progressText}</Text>
            {this.state.skipButton ? <Button title="Überspringen" onPress={Actions.main} /> : null}
            {this.state.spinner ? <ActivityIndicator size="large" /> : null }
        </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
  }
})
