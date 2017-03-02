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
   */
  getCategories() {
    const cat = getJson('categories')
    if (cat !== false) {
      return cat
    } else {
      throw "keine Kategorien gefunden"
    }
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
  async registerDevice() {
    const uuid = push.getDeviceId();
    const response = await post('device', uuid)
    const json = await response.json()
    console.log("registerDevice response:", response)
    if (response.status == 200 && 'verified' in json) {
      return json.verified  // Gerät war schon bekannt
    } else if (response.status == 201) {
      return false // Gerät neu
    } else {
      throw 'registerDevice fehlgeschlagen'
    }
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
   */
  verifyDevice(key) {
    const response = get('verify/' + key)
    if (response.status == 200) {
      return true
    } else {
      throw 'verifyDevice fehlgeschlagen'
    }
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
   */
  subscribe(categories) {
    const uuid = push.getDeviceId();
    const response = post('subscribe', JSON.stringify({
        deviceId: uuid,
        categories
    }))
    console.log("subscribe response", response)
    if (response.status === 201) {
      return true
    } else {
      throw 'subscribe fehlgeschlagen'
    }
  },

  /**
   * Abonnierte Kategorien holen
   * 
   * @param {*} success 
   * @param {*} error 
   */
  getSubscriptions(success, error) {
    const uuid = push.getDeviceId();
    return getJson('subscriptions/' + uuid)
  }
}


async function get(route) {
  console.log("GET " + url + '/' + route)
  const response = await fetch(url + '/' + route)
  console.log("get",route,"response", response)
  return response
}

async function getJson(route) {
  const response = await get(route)
  console.log("getJson", route, "response", response)
  return await response.json()
}

async function post(route, body) {
  console.log("POST " + url + '/' + route, body)
  await fetch(url + '/' + route, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body
    })
  return true
}

export default api
