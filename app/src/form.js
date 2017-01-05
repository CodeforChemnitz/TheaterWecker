import React, { Component } from 'react'
import { View, Text, TextInput, Button } from 'react-native'
import styles from './styles'
import _ from 'underscore'

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
      { _.map(_.keys(this.props.options), (key) => {
          let value = this.props.options[key]
          return <Button
              key={key} 
              title={value} 
              color={this.state.active == key ? this.props.colorActive : this.props.color} 
              onPress={() => this.props.onChange(key)} />
      } ) }
      </View>
    )
  }
}

export default class Form extends Component {
  categories = {
    'oper': "Oper",
    'figurentheater': "Figurentheater",
    'schauspiel': "Schauspiel",
    'ballett': "Ballett",
    'philharmonie': "Philharmonie",
    'sonstiges' : "Sonstiges"
  }
  constructor(props) {
    super(props)
    this.state = {
      categories: ''
    }
  }

  onAbonnieren() {
    console.log("Abonnieren an die API", this.state)
    return fetch('https://theaterwecker.de/api/v1')
      .then((response) => response.json())
      .then((responseJson) => {
        return responseJson;
      })
      .catch((error) => {
        console.error(error);
      });
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
                  options={this.categories} 
                  value={this.state.category} 
                  color='#0000ff' 
                  colorActive='#ff0000'
                  onChange={(categories) => this.setState({categories})} />
            </View>
            <View style={styles.p}>
                <Text style={styles.center}>via Push-Benachrichtigung</Text>
            </View>
            <View style={styles.buttonGroup}>
                <Button 
                    title="Abonnieren" 
                    style={styles.buttonPrimary} 
                    onPress={() => this.onAbonnieren()} />
            </View>
        </View>
    )
  }
}
