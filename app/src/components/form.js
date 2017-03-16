import React, { Component } from 'react'
import { View, Text, TextInput, Button, AsyncStorage, TouchableOpacity } from 'react-native'
import { Actions } from 'react-native-router-flux'
import styles from '../styles'
import api from '../lib/api'

// Button: https://facebook.github.io/react-native/docs/button.html

class Selection extends Component {
  render() {
    return (
      <View>
      <TouchableOpacity onPress={this.props.onPress}>
        <View style={[styles.radioButtonGroupItem, this.props.checked && styles.radioButtonGroupItemActive]}>
          <Text style={[styles.radioButtonGroupItemText, this.props.checked && styles.radioButtonGroupItemTextActive]}>
            {this.props.title}
          </Text>
        </View>
      </TouchableOpacity>
      </View>
      )
  }
}

class RadioButtonGroup extends Component {
  constructor(props) {
    console.log("RadioButtonGroup props", props)
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
  async uncheck(id) {
    const index = this.state.active.indexOf(id)
    await this.setState({active: [
        ...this.state.active.slice(0, index),
        ...this.state.active.slice(index + 1)
    ]})
    this.props.onChange(this.state.active)
  }
  async check(id) {
    await this.setState({active: [ ...this.state.active, id ]})
    this.props.onChange(this.state.active)
  }
  render() {
    if (typeof this.props.options == 'undefined') {
      return null
    }
    return (
      <View style={styles.radioButtonGroup}>
      { !!this.props.options && typeof this.props.options.map == 'function' ? this.props.options.map((itm) => {
          // console.log("Cat itm", itm)
          const checked = typeof this.state.active == "object" && this.state.active.indexOf(itm.id) !== -1
          return <Selection
            key={"k"+itm.id}
            title={itm.name}
            checked={checked} 
            onPress={checked ? () => this.uncheck(itm.id) : () => this.check(itm.id)}
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
    Promise.all([AsyncStorage.getItem('@TW:categories'), AsyncStorage.getItem('@TW:subscriptions')])
      .then(([cats, subs]) => {
        try {
          console.log("Categories!", cats)
          console.log("Subscriptions!", subs)
          this.setState({categoriesPossible: JSON.parse(cats)})
          this.setState({categoryIdsSelected: JSON.parse(subs)})
        } catch(error) {
          console.error(error)
        }
      })
  }

  onSubscribe() {
    console.log("Abonnieren..", this.state)
    new Promise((resolve, reject) =>  {
        return api.subscribe(this.state.categoryIdsSelected, resolve, reject)
      }).then(() => {
        Actions.success({text: 'Wir werden dich bei der nächsten Gelegenheit benachrichtigen.'})
      }).catch((error) => {
        console.error("onSubscribe", error)
        Actions.error()
      })
  }

  render() {
    return (
        <View style={styles.form}>
            <View style={styles.p}>
                <Text style={[styles.formTextTop, styles.center]}>Benachrichtige mich für</Text>
            </View>
            <View style={styles.buttonGroup}>
              <RadioButtonGroup 
                  options={this.state.categoriesPossible} 
                  value={this.state.categoryIdsSelected} 
                  onChange={(categoryIdsSelected) => this.setState({categoryIdsSelected})} />
            </View>
            <View style={styles.p}>
                <Text style={[styles.formText, styles.center]}>via Push-Benachrichtigung</Text>
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
