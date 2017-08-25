'use strict'
const api = require('./api')
const ui = require('./ui')
const store = require('../store')
const ordersApi = require('../orders/api')
const ordersUi = require('../orders/ui')

// this is the token retriever.
// It takes the CC data in the form, sends it to the third
// party Stripe API which then sends back a token which doesn't
// contain any information that is sensitive.
const handler = StripeCheckout.configure({
  key: 'pk_test_7fQwskkIwuWNEkWfcIyJZJKS',
  locale: 'auto'
  // Right here is where you want to be able to trouble shoot
  // as needed. To start use the following :
  // token: function (){
  // then we started with console.log(token) to learn what is
  // being sent back. The token.id is the component used
  // for any sort of troubleshooting.
// }
})
// closes the window when everything is complete
window.addEventListener('popstate', function () {
  handler.close()
})

const onFinalizeOrder = function () {
  const date = new Date()
  const id = store.currentOrder.id
  const proof = store.proofOfSale
  const data = {
    'order': {
      'salesProof': {
        'id': proof.id,
        'amount': proof.amount,
        'currency': proof.currency,
        'status': proof.status
      },
      'date_placed': date,
      'products': store.cart,
      'isOpen': 'false'
    }
  }
  api.finalizeOrder(data, id)
    .then(ui.onFinalizePaymentSuccess)
    .then(ordersApi.showAllOrders)
    .then(ordersUi.showAllOrdersSuccess)
    .catch(ui.onFinalizePaymentFailure)
}

const createNewCart = function () {
  const data = {
    'order': {
      'date_placed': '1969-01-01',
      'products': [{}],
      'isOpen': 'true',
      '_owner': store.user.id
    }
  }
  api.createNewCart(data)
    .then(ui.onCreateNewCartSuccess)
    .catch(ui.onCreateNewCartFailure)
}

const handleToken = function (token) {
  // pull amount here from store.amount
  token.amount = store.total * 100
  // token.amount = store.amount
  // takes token and sends it out to the API
  api.makeCharge(token)
  // on success
    .then(ui.onStripeAPISuccess)
    .then(onFinalizeOrder)
    .then(createNewCart)
    .catch(ui.onStripeAPIFail)
}

const shutUpAndTakeMyMoney = function (event) {
  // if (store.amount === undefined || store.amount === 0) {
  //   $('.purchaseConfirm').text('Please put something in the cart before making a purchase.').fadeIn('fast').delay(3000).fadeOut('slow')
  //   return
  // } else {
  handler.open({
    name: 'Fencer.com',
    description: 'Presentation Test Sales',
    token: handleToken
    // first, get a token from card on stripe api
    // Then send api and pay data to the stripe api, full payment
    // Wait for confirmation
    // Cool send confirmation data to mongodb
    // make a record of the purchase.
    // send confirmation
    // CATCHCATCHCATCH-drop token and warn the user.
  })
}

const addHandlers = () => {
  $('#buttonCheckout').on('click', shutUpAndTakeMyMoney)
}

module.exports = {
  addHandlers,
  createNewCart
}
