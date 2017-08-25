'use strict'

const store = require('../store')
// on successful response of api.
const onStripeAPISuccess = (data) => {
  store.proofOfSale = {
    'id': data.id,
    'amount': data.amount / 100,
    'currency': data.currency,
    'status': data.status
  }
  $('.landingPage').show()
  $('#productTable').show()
  $('#cartPage').hide()
  $('#checkoutPage').hide()
  $('.previousOrderList').hide()
}

// on failed response
const onStripeAPIFail = (data) => {

}
const onFinalizePaymentSuccess = () => {
  $('#UiSuccess').text('Thank you for your purchase!').fadeIn('fast').delay(3000).fadeOut('slow')
}

const onFinalizePaymentFailure = () => {
  // stripe api fail does not reach this function
}

const onCreateNewCartSuccess = function (data) {
  // response data will go here
  store.currentOrder = data.order
  store.cart = []
  store.total = 0
}

const onCreateNewCartFailure = function () {

}

module.exports = {
  onStripeAPISuccess,
  onStripeAPIFail,
  onCreateNewCartSuccess,
  onCreateNewCartFailure,
  onFinalizePaymentSuccess,
  onFinalizePaymentFailure

}
