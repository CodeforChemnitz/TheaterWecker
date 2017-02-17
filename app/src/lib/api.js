import React, { Component } from 'react'
import { Platform } from 'react-native'
import push from './push'
import settings from '../settings'

// Network fetch: https://facebook.github.io/react-native/releases/next/docs/network.html

// -- Theaterwecker Backend --
// Django Systemverwaltung: https://theaterwecker.de/admin/
// local self documented API: http://127.0.0.1:8000/api/

const url = settings.url

const api = {
  // getInstitutions: () => {
  //   return getAsJson('institutions')
  // },

  // curl https://theaterwecker.de/api/categories/
  getCategories(success, error) {
    let cat = getJson('categories')
    if (cat !== false) {
      success(cat)
    } else {
      error('getCategories')
    }
  },

  // curl -X POST -d 'c732c64a-9409-4af3-b0dc-1ff93e084b5b' https://theaterwecker.de/api/device/
  registerDevice(success, error) {
    const uuid = push.getDeviceId();
    const status = postAndGetJson('device', uuid)
      .then((status) => {
        console.log("registerDevice status:", status)
        if (!!status && 'verified' in status) {
          success(status.verified)
        } else {
          error('registerDevice')  
        }
      })
      .catch((errorMsg) => {
        error(errorMsg)
      })    
  },

  verifyDevice(key, success, error) {
    const ok = get('verify/' + key)
    if (ok) {
      success()
    } else {
      error('verifyDevice')
    }
  },

  subscribe(categories, success, error) {
    const uuid = push.getDeviceId();
    let ok = post('subscribe', JSON.stringify({
        deviceId: uuid,
        categories
    }))
    console.log("subscribe ok", ok)
    if (ok) {
      success()
    } else {
      error('subscribe')
    }
  },

  getSubscriptions(success, error) {
    const uuid = push.getDeviceId();
    let subs = getJson('subscriptions/' + uuid)
    if (subs !== false) {
      success(subs)
    } else {
      error('getSubscripions')
    }
  }
}

const get = function(route) {
  console.log("GET " + url + '/' + route)
  return fetch(url + '/' + route)
    .then((data) => {
      return data
    })
    .catch((error) => {
      console.log(error)
      return false
    })
}

const getJson = function(route) {
  console.log("GET " + url + '/' + route)
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
  console.log("POST " + url + '/' + route, body)
  return fetch(url + '/' + route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body
    })
    .then((data) => { return true })
    .catch((error) => {
      console.log(error)
      return false
    })
}

const postAndGetJson = function(route, body) {
  console.log("POST " + url + '/' + route, body)
  return fetch(url + '/' + route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body
    })
    .then((response) => {
      console.log("postAndGetJson response", response)
      return response.json()
    })
    .then((responseJson) => {
      console.log("postAndGetJson responseJson", responseJson)
      return responseJson
    })
    .catch((error) => {
      console.log(error)
      return false
    })
}

export default api
