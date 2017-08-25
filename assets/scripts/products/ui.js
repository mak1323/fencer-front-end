'use strict'

const store = require('../store')
// const cart = require('../cart')
const api = require('../stripe/api')
const ui = require('../stripe/ui')
const ordersAPI = require('../orders/api')
const stripeEvents = require('../stripe/events')

const showProductsTemplate = require('../templates/products.handlebars')
const showCartTemplate = require('../templates/cart.handlebars')
const showCheckoutTemplate = require('../templates/checkout-cart.handlebars')
// const orderApi = require('../orders/api')

// This variable represents the array of products that will be patched into the
// active order.
let productData
// When a user adds an item to an order, this will pass the item's id and the
// quanity value the user entered into an array and pushes it to the shopping
// cart array.
const onAddItemToCartArray = function (event) {
  event.preventDefault()
  let duplicate
  const item = {
    'product_id': $(this).closest('form').find("input[name='id']").val(),
    'quantity': $(this).closest('form').find("input[name='quantity']").val()
  }
  for (let i = 0; i < store.cart.length; i++) {
    if (store.cart[i].product_id === item.product_id) {
      store.cart[i].quantity = item.quantity
      duplicate = true
    }
  }
  if (!duplicate) {
    store.cart.push(item)
    updateExistingCart()
  }
}

const removeFromCartArray = function (event) {
  if (store.cart.length === 1) {
    store.cart = []
    const data = store.currentOrder
    ordersAPI.deleteOrder(data)
      .then(stripeEvents.createNewCart)
      .then(pushItemsToCart)
  } else {
    const newCart = store.cart.filter(function (item) {
      if (item.product_id !== $(event.target).data('id')) {
        return item
      }
    })
    store.cart = newCart
    pushItemsToCart()
    updateExistingCart()
  }
}

const populateCheckout = function (event) {
  event.preventDefault()
  $('#totalMoneySuckerPays').empty()
  store.total = 0
  const filteredData = productData.products.filter(function (item) {
    for (let i = 0; i < store.cart.length; i++) {
      if (store.cart[i].product_id === item.id) {
        item.quantity = store.cart[i].quantity
        store.total += item.subtotal
        return item
      }
    }
  })
  const showCheckoutHTML = showCheckoutTemplate({ products: filteredData })
  $('#totalMoneySuckerPays').append('Total: $', store.total)
  $('#checkoutTable tbody').empty()
  $('#checkoutTable tbody').append(showCheckoutHTML)
}

const pushItemsToCart = function () {
  store.total = 0
  const filteredData = productData.products.filter(function (item) {
    for (let i = 0; i < store.cart.length; i++) {
      if (store.cart[i].product_id === item.id) {
        item.quantity = store.cart[i].quantity
        item.subtotal = item.quantity * item.price
        store.total += item.subtotal
        return item
      }
    }
  })

  const showCartHTML = showCartTemplate({ products: filteredData })
  $('#cartTable tbody').empty()
  $('#cartTable tbody').append(showCartHTML)
  $('.removeFromCart').on('click', removeFromCartArray)

  if (!store.cart.length) {
    $('#buttonProceedCheckout').hide()
  } else {
    $('#buttonProceedCheckout').show()
  }
}

const showAllProductsSuccess = function (data) {
  store.products = data.products
  const showProductsHTML = showProductsTemplate({ products: data.products })
  $('#productTable').show()
  $('#productTable tbody').empty()
  $('#productTable tbody').append(showProductsHTML)
  $('.addToCart').on('submit', onAddItemToCartArray)
  productData = data
  $('#shoppingCartButton').on('click', pushItemsToCart)
  $('#buttonProceedCheckout').on('click', populateCheckout)
}

const showAllProductsFailure = function () {
  // $('#UiFailure').text('something went wrong')
}

// create a cart if there isn't one and if there is one then send a patch request to update the existing cart
const carriageBoy = () => {
  if (!store.currentOrder) {
    const data = {
      'order': {
        'date_placed': '2017-08-10',
        'products': [{}],
        'isOpen': 'true',
        '_owner': store.user.id
      }
    }
    api.createNewCart(data)
      .then(ui.onCreateNewCartSuccess)
      .catch(ui.onCreateNewCartFailure)
  }
}

const updateExistingCart = () => {
  const id = store.currentOrder.id
  if (store.cart.length === 0) {
    // api request here delete
    // create api
  }
  // else
  const data = {
    'order': {
      'products': store.cart
    }
  }

  api.finalizeOrder(data, id)
    .then(onUpdateExisitingCartSuccess)
    .catch(onUpdateExisitingCartFailure)
}
const onUpdateExisitingCartSuccess = () => {
  $('#UiSuccess').text('Your cart has been updated').fadeIn('fast').delay(3000).fadeOut('slow')
}
const onUpdateExisitingCartFailure = () => {
  $('#UiFailure').text('Oops! Something went wrong!').fadeIn('fast').delay(3000).fadeOut('slow')
}
module.exports = {
  showAllProductsSuccess,
  showAllProductsFailure,
  carriageBoy,
  pushItemsToCart
}
