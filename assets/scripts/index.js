'use strict'

const setAPIOrigin = require('../../lib/set-api-origin')
const config = require('./config')
const authEvents = require('./auth/events')
const orderEvents = require('./orders/events')
const productEvents = require('./products/events')
const stripeEvents = require('./stripe/events')

$(() => {
  setAPIOrigin(location, config)
  // when page loads cart table hides
  // adds event handlers for sign in, sign up, sign out, chng pwd
  authEvents.addAuthHandlers()
  orderEvents.addHandlers()
  productEvents.addHandlers()
  stripeEvents.addHandlers()
  $('#cartPage').hide()
  $('#checkoutPage').hide()
})

// use require with a reference to bundle the file and use it in this file
// const example = require('./example')

// use require without a reference to ensure a file is bundled
require('./example')
