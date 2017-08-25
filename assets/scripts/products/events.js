'use strict'
const api = require('./api')
const ui = require('./ui')
const store = require('../store')
const ordersAPI = require('../orders/api')
const stripeEvents = require('../stripe/events')

// show the product catalog on the landing page, this function is called on
// sign in
const onShowAllProducts = function (event) {
  event.preventDefault()
  api.showAllProducts()
    .then(ui.showAllProductsSuccess)
    .catch(ui.showAllProductsFailure)
}

const onProductsMenuButton = () => {
  $('.landingPage').show()
  $('#productTable').show()
  $('#cartPage').hide()
  $('#checkoutPage').hide()
  $('.previousOrderList').hide()
}
const onOrderHistoryButton = () => {
  $('.landingPage').hide()
  $('#cartPage').hide()
  $('#checkoutPage').hide()
  $('.previousOrderList').show()
}

const onShoppingCartMenuButton = () => {
  $('.landingPage').hide()
  $('#cartPage').show()
  $('#checkoutPage').hide()
  $('.previousOrderList').hide()
}

const onCheckoutMenuButton = () => {
  $('.landingPage').hide()
  $('#cartPage').hide()
  $('#checkoutPage').show()
}

const onBackToCartButton = () => {
  $('.landingPage').hide()
  $('#cartPage').show()
  $('#checkoutPage').hide()
}

const onClearCart = () => {
  store.cart = []
  const data = store.currentOrder
  ordersAPI.deleteOrder(data)
    .then(stripeEvents.createNewCart)
    .then(ui.pushItemsToCart)
}

const onBackToShopping = () => {
  $('.landingPage').show()
  $('#productTable').show()
  $('#cartPage').hide()
  $('#checkoutPage').hide()
  $('.previousOrderList').hide()
}

const addHandlers = () => {
  $('#returnToProducts').on('click', onProductsMenuButton)
  $('#shoppingCartButton').on('click', onShoppingCartMenuButton)
  $('#orderHistoryButton').on('click', onOrderHistoryButton)
  $('#buttonProceedCheckout').on('click', onCheckoutMenuButton)
  $('#buttonBack').on('click', onBackToCartButton)
  $('#buttonClearCart').on('click', onClearCart)
  $('#buttonBackToShopping').on('click', onBackToShopping)
}

module.exports = {
  onShowAllProducts,
  addHandlers
}
