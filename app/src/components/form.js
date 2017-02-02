import React, { Component } from 'react'
import { View, Text, TextInput, Button, AsyncStorage } from 'react-native'
import { CheckBox } from 'react-native-elements'
import styles from '../styles'
import api from '../lib/api'

// Button: https://facebook.github.io/react-native/docs/button.html

class RadioButtonGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      active: this.props.value
    }
  }
  componentWillReceiveProps(nextProps) {
    if (this.state.active != nextProps.value) {
      this.setState({active: nextProps.value})
    }
  }
  render() {
    if (typeof this.props.options == 'undefined') {
      return null
    }
    return (
      <View style={styles.radioButtonGroup}>
      { !!this.props.options ? this.props.options.map((itm) => {
          // console.log("Cat itm", itm)
          return <CheckBox
            center
            title={itm.name}
            checkedIcon='dot-circle-o'
            uncheckedIcon='circle-o'
            checked={typeof this.state.active == "array" && this.state.active.indexOf(itm.id) !== -1} 
            onPress={() => this.props.onChange(itm.id)}
          />
      } ) : null }
      </View>
    )
  }
}

export default class Form extends Component {
  
  constructor(props) {
    super(props)
    this.state = {
      categoriesPossible: [],
      categoryIdsSelected: []
    }
    AsyncStorage.getItem('@TW:categories')
      .then((data) => {
        try {
          // console.log("Categories!", data)
          this.setState({categoriesPossible: JSON.parse(data)})
        } catch(error) {
          console.error(error)
        }
      })
  }

  onSubscribe() {
    console.log("Abonnieren..", this.state)
    new Promise((resolve, reject) =>  {
        api.subscribe(this.state.categoryIdsSelected, resolve, reject)
      }).then(() => {
        Actions.success()
      }).catch((error) => {
        console.error("onSubscribe", error)
        Actions.error()
      })
  }

  render() {
    return (
        <View style={styles.form}>
            <View style={styles.p}>
                <Text style={styles.center}>Benachrichtige mich</Text>
            </View>
            <View style={styles.p}>
                <Text style={styles.center}>vor Beginn der Veranstaltung - sofern noch Plätze frei sind - für</Text>
            </View>
            <View style={styles.buttonGroup}>
              <RadioButtonGroup 
                  options={this.state.categoriesPossible} 
                  value={this.state.categoryIdsSelected} 
                  onChange={(categoryIdsSelected) => this.setState({categoryIdsSelected})} />
            </View>
            <View style={styles.p}>
                <Text style={styles.center}>via Push-Benachrichtigung</Text>
            </View>
            <View style={styles.buttonGroup}>
                <Button 
                    title="Abonnieren" 
                    style={styles.buttonPrimary} 
                    onPress={() => this.onSubscribe()} />
            </View>
        </View>
    )
  }
}
