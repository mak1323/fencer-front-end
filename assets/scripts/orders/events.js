'use strict'

const getFormFields = require(`../../../lib/get-form-fields`)

const api = require('./api')
const ui = require('./ui')

// creates your shopping cart, this will always be automatic
const onAddOrder = function (event) {
  event.preventDefault()
  const data = getFormFields(event.target)
  api.addOrder(data)
    .then(ui.addOrderSuccess)
    .catch(ui.addOrderFailure)
}

const onShowAllOrders = function (event) {
  event.preventDefault()
  // api.showAllOrders()
  //   .then(ui.showAllOrdersSuccess)
  //   .catch(ui.showAllOrdersFailure)
}

const addHandlers = () => {
  // $('#orderHistoryButton').on('click', onShowPreviousOrders)
  // $('#shoppingCartButton').on('click', onShowCart)
  // $('#signup').on('click', onAddOrder)
  // $('#updateCart').on('submit', onUpdateOrder)
}
module.exports = {
  onShowAllOrders,
  addHandlers
}
