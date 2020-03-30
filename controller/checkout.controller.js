const axios = require('axios');
const orderService = require('../service/order.service');

module.exports = (router) => {

  router.post('/checkout/payment-methods', function (req, res) {
    const options = {
      url: `${process.env.ADYEN_API_CHECKOUT_BASE_URL}/checkout/V${process.env.ADYEN_API_CHECKOUT_VERSION}/paymentMethods`,
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': process.env.ADYEN_API_KEY
      },
      data: {
        merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT
      }
    };
    axios(options)
      .then((response) => {
        response.data.originKey = process.env.ADYEN_ORIGIN_KEY;
        res.json(response.data);
      })
      .catch(err => {
        console.log(err);
        res.json({
          error: err.message,
        }, 500);
      });
  });

  router.post('/checkout/payments', function (req, res) {
    const options = {
      url: `${process.env.ADYEN_API_CHECKOUT_BASE_URL}/checkout/V${process.env.ADYEN_API_CHECKOUT_VERSION}/payments`,
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'X-API-Key': process.env.ADYEN_API_KEY
      },
      data: Object.assign({
        merchantAccount: process.env.ADYEN_MERCHANT_ACCOUNT,
        returnUrl: `http://localhost:${process.env.PORT}/checkout/process/return?orderId=${req.body.reference}`,
        channel: 'Web',
        shopperIP: '127.0.0.1',
        origin: `http://localhost:${process.env.PORT}`,
      }, req.body),
    };
    axios(options)
      .then((response) => {
        orderService.save({
          orderId: req.body.reference,
          shopperReference: req.body.shopperReference,
          paymentData: response.data.paymentData,
        });
        res.json(response.data);
      })
      .catch(err => {
        res.status(err.response.data.status).json({
          error: err.response.data,
        });
      });
  });

  router.get('/checkout/process/return', async (req, res) => {
    const { resultCode, payload, orderId } = req.query;

    if (resultCode === 'authorised') {
      const order = await orderService.get(orderId);
      const options = {
        url: `${process.env.ADYEN_API_CHECKOUT_BASE_URL}/checkout/V${process.env.ADYEN_API_CHECKOUT_VERSION}/payments/details`,
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': process.env.ADYEN_API_KEY
        },
        data: {
          paymentData: order.paymentData,
          details: {
            payload
          }
        },
      };
      axios(options)
        .then((response) => {
          res.render('checkout/return', Object.assign(response.data, { pageTitle: 'Payment result' }));
        })
        .catch(err => {
          console.log(err);
        });
    }

    if (resultCode === 'cancelled') {
      res.redirect('/');
    }
  });

  router.post('/checkout/process/return', async (req, res) => {
    const { MD, PaRes } = req.body;
    const { orderId } = req.query;

    if (MD && PaRes && orderId) {
      const order = await orderService.get(orderId);
      if (!order) {
        res.render('checkout/order_not_found', { pageTitle: 'Order not found', message: `The order with ID ${orderId} was not found` });
      }
      const options = {
        url: `${process.env.ADYEN_API_CHECKOUT_BASE_URL}/checkout/V${process.env.ADYEN_API_CHECKOUT_VERSION}/payments/details`,
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'X-API-Key': process.env.ADYEN_API_KEY
        },
        data: {
          paymentData: order.paymentData,
          details: {
            MD,
            PaRes
          }
        },
      };
      axios(options)
        .then((response) => {
          res.render('checkout/return', Object.assign(response.data, { pageTitle: 'Payment result' }));
        })
        .catch(err => {
          console.log(err);
        });
    }
  });

};
