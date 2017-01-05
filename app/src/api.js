import React, { Component } from 'react'
import { Platform } from 'react-native'
import push from './push'

// Network fetch: https://facebook.github.io/react-native/releases/next/docs/network.html

// -- Theaterwecker Backend --
// Django Systemverwaltung: https://theaterwecker.de/admin/
// local self documented API: http://127.0.0.1:8000/api/

const url = 'http://127.0.0.1:8000/api'

const get = function(route) {
  return fetch(url + '/' + route)
    .then((response) => response.json())
    .then((responseJson) => {
      return responseJson
    })
    .catch((error) => {
      console.log(error)
      return false
    })
}

const post = function(route, body) {
  return fetch(url + 'device', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body
    })
    .then(() => { return true })
    .catch((error) => {
      console.log(error)
      return false
    })
}

const api = {
  // getInstitutions: () => {
  //   return getAsJson('institutions')
  // },
  getCategories() {
    return get('categories')
  },
  createDevice() {
    const uuid = push.getDeviceId();
    post('device', uuid)
  },
  verifyDevice(urlWithHash) {
    fetch(urlWithHash, {
      method: 'GET',
    })
  },
  subscribe (categories) {
    const uuid = push.getDeviceId();
    post('subscribe', JSON.stringify({
        deviceId: uuid,
        categories
      }))
  }
}

export default api
