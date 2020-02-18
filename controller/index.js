const PagesController = require('./pages.controller');
const CheckoutController = require('./checkout.controller');

module.exports = (router) => {
  PagesController(router);
  CheckoutController(router);
};
