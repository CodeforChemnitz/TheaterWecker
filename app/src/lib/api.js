import React, { Component } from 'react'
import { Platform } from 'react-native'
import push from './push'

// Network fetch: https://facebook.github.io/react-native/releases/next/docs/network.html

// -- Theaterwecker Backend --
// Django Systemverwaltung: https://theaterwecker.de/admin/
// local self documented API: http://127.0.0.1:8000/api/

const url = 'http://127.0.0.1:8000/api'

const api = {
  // getInstitutions: () => {
  //   return getAsJson('institutions')
  // },

  // curl https://theaterwecker.de/api/categories/
  getCategories(success, error) {
    let cat = get('categories')
    if (cat !== false) {
      success(cat)
    } else {
      error('getCategories')
    }
  },

  // curl -X POST -d 'c732c64a-9409-4af3-b0dc-1ff93e084b5b' https://theaterwecker.de/api/device/
  registerDevice(success, error) {
    const uuid = push.getDeviceId();
    if (post('device', uuid)) {
      success(true)
    } else {
      error('registerDevice')
    }
  },

  verifyDevice(urlWithHash, success, error) {
    fetch(urlWithHash, {
      method: 'GET',
    }).then(() => {
      success()
    }).catch((msg) => {
      error(msg)
    })
  },

  subscribe(categories, success, error) {
    const uuid = push.getDeviceId();
    let ok = post('subscribe', JSON.stringify({
        deviceId: uuid,
        categories
    }))
    if (ok) {
      success()
    } else {
      error('subscribe')
    }
  }
}


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

export default api
