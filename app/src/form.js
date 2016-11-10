import React, { Component } from 'react'
import { View, Text } from 'react-native';
import styles from 'styles'

class RadioButtonGroup extends Component {
  constructor(props) {
    super(props)
    this.state = {
      text: ''
    }
  }
  render() {
    return (
      <View>
      { this.props.properties.keys.map((key) => {
          let value = this.props.properties[key]
          return <Button 
              title={value} 
              class={[this.props.classButton, this.props.value == value ? this.props.classButtonActive : {}]} 
              onPress={() => this.props.onCheck(key)} />
      })}
      </View>
    )
  }
}

export default class Form extends Component {
  constructor(props) {
    props.categories = {
      'oper': "Oper",
      'figurentheater': "Figurentheater",
      'schauspiel': "Schauspiel",
      'ballett': "Ballett",
      'philharmonie': "Philharmonie",
      'sonstiges' : "Sonstiges"
    }
    props.times = {
      '15': '15 Minuten',
      '30': '30 Minuten',
      '60': '1 Stunde' 
    }
    super(props)
    this.state = {
      email: '',
      category: ''
    }
  }

  onAbonnieren() {}

  onCategorySelected(category) {
    this.setState({category})
  }
  onTimeSelected(time) {
    this.setState({time})
  }

  render() {
    return (
        <View class={styles.form}>
            <View class={styles.p}>
                <Text>Benachrichtige mich</Text>
            </View>
            <View class={styles.buttonGroup}>
                <RadioButtonGroup 
                  options={this.props.times} 
                  value={this.state.time} 
                  classButton={styles.button} 
                  classButtonActive={styles.buttonPrimary}
                  onChange={(time) => this.onTimeSelected(time)} />
            </View>
            <View class={styles.p}>
                <Text>vor Beginn der Veranstaltung - sofern noch Plätze frei sind - für</Text>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <RadioButtonGroup 
                  options={this.props.categories} 
                  value={this.state.category} 
                  classButton={styles.button} 
                  classButtonActive={styles.buttonPrimary}
                  onChange={(category) => this.onCategorySelected(category)} />
            </View>
            <View class={styles.p}>
                <Text>via E-Mail</Text>
            </View>
            <View class={styles.buttonGroup}>
                <TextInput 
                    keyboardType="email"
                    placeholder="max@musterman.de"
                    class={styles.email}
                    onChangeText={(email) => this.setState({email})}
                    value={this.state.email} 
                    />
            </View>
            <View class={styles.buttonGroup}>
                <Button 
                    title="Abonnieren" 
                    class={styles.buttonPrimary} 
                    onPress={() => this.onAbonnieren} />
            </View>
        </View>
    )
  }
}
