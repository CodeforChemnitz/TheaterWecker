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
  /**
   * Test: curl https://theaterwecker.de/api/categories/
   * 
   * @param {*} success
   * @param {*} error
   * @return Promise
   */
  getCategories(success, error) {
    // console.log("getCategories func call")
    return new Promise((successInner, rejectInner) => {
        return getJson('categories', successInner)
      })
      .then((cat) => {
        // console.log("getCategories then", cat)
        if (cat !== false) {
          // console.log("getCategories success", cat)
          success(cat)
        } else {
          error("keine Kategorien gefunden")
        }
      })
  },

  /**
   * Ermittelt den Verifizierungs-Status eines Gerätes
   * 
   * Status 200: Device gibts schon, Verify-Status als JSON-Response
   * Status 201: Device gabs noch nicht, Response ist leer
   * Status 400: UUID falsches Format oder sonstwas kaputt
   * 
   * Test: curl -X POST -d 'c732c64a-9409-4af3-b0dc-1ff93e084b5b' https://theaterwecker.de/api/device/
   * 
   * @param {*} success 
   * @param {*} error 
   */
  registerDevice(success, error) {
    const uuid = push.getDeviceId();
    return post('device', uuid) // Promise
      .then((response) => { 
        console.log("registerDevice response:", response)
        if (!response) {
          error('registerDevice fehlgeschlagen')
        }
        if (response.status == 200) {
          return response.json() // Promise
        } else if (response.status == 201) {
          success(false)  // fulfil, Gerät neu
        } else {
          error('registerDevice fehlgeschlagen')
        }
      })
      .then((json) => { 
        console.log("registerDevice JSON:", json.verified)
        success(json.verified)
      })
      .catch(() => { 
        return false  // error(false)?
      })
  },

  /**
   * Bestätigt ein Gerät zum Backend mit Verify-Code aus Push
   * 
   * Status 200: alles okay
   * Status 400: alles kaputt
   * 
   * @param {*} key 
   * @param {*} success 
   * @param {*} error 
   * @return Promise
   */
  verifyDevice(key, success, error) {
    return get('verify/' + key)
      .then((response) => {
        console.log("verifyDevice response", response)
        if (response.status == 200) {
          success(true)
        } else {
          error('verifyDevice fehlgeschlagen')
        }
      })
  },

  /**
   * Kategorien abonnieren
   * 
   * Status 201: Speichern erfolgreich
   * Status 404: Device unbekannt
   * Status 412: Device nicht verifiziert
   * Status 500: Speichern fehlgeschlagen
   * 
   * @param {*} categories 
   * @return Promise
   */
  subscribe(categories, success, error) {
    const uuid = push.getDeviceId();
    return post('subscribe', JSON.stringify({
          deviceId: uuid,
          categories
      }))
      .then((response) => {
        console.log("subscribe response", response)
        if (response.status === 201) {
          success(true)
        } else {
          error('subscribe fehlgeschlagen')
        }
      })
  },

  /**
   * Abonnierte Kategorien holen
   * 
   * @param {*} success 
   * @param {*} error 
   * @return Promise
   */
  getSubscriptions(success, error) {
    const uuid = push.getDeviceId();
    return new Promise((successInner, rejectInner) => {
        return getJson('subscriptions/' + uuid, successInner)
      })
      .then((json) => {
        success(json)
      })
  }
}


function get(route) {
  console.log("GET " + url + '/' + route)
  return fetch(url + '/' + route)
}

function getJson(route, success) {
  return get(route)
    .then((response) => { 
      console.log("getJson",route,"response",response)
      success(response.json())
    })
}

function post(route, body) {
  console.log("POST " + url + '/' + route, body)
  return fetch(url + '/' + route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body
    })
}

export default api
