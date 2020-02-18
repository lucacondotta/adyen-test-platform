const allowedPaymentMethods = ['scheme', 'paypal'];
let amount;
let shopperReference;
let reference;
let recurring;
let checkout;
let filterMethods = true;

const handleOnChange = (state, component) => {
  state.isValid // True or false. Specifies if all the information that the shopper provided is valid.
  state.data // Provides the data that you need to pass in the `/payments` call.
  component // Provides the active component instance that called this event.
};

const handleOnAdditionalDetails = (state, component) => {
  state.data // Provides the data that you need to pass in the `/payments/details` call.
  component // Provides the active component instance that called this event.
};

const scrollToElement = (elementId) => {
  $('html, body').animate({
    scrollTop: $(elementId).offset().top - 150
  }, 1000);
};

const validateConfiguration = () => {
  let valid = true;
  let elementsMap = { 'amount-input': amount, 'shopper-id-input': shopperReference, 'order-reference-input': reference };
  let elementsIds = Object.keys(elementsMap);
  let invalidElement;
  let i;

  for (i = 0; i < elementsIds.length; i++) {
    let elementId = `#${elementsIds[i]}`;
    if (elementsMap[elementsIds[i]] === undefined) {
      $(elementId).addClass('is-invalid');
      if (invalidElement === undefined) {
        invalidElement = $(elementId);
        scrollToElement(elementId);
      }
      valid = false;
    } else {
      $(elementId).removeClass('is-invalid');
    }
  }

  return valid;
};

const handleOnSubmit = (state, component) => {
  // state.isValid // True or false. Specifies if all the information that the shopper provided is valid.
  // state.data // Provides the data that you need to pass in the `/payments` call.
  // component // Provides the active component instance that called this event.

  console.log(state);

  if (!validateConfiguration()) {
    return;
  }

  if (state.isValid) {
    $.ajax({
      url: 'http://localhost:3001/checkout/payments',
      data: JSON.stringify(Object.assign({
        amount: {
          value: amount * 100,
          currency: 'EUR'
        },
        shopperReference,
        reference,
        shopperInteraction: recurring ? 'ContAuth' : 'Ecommerce',
      }, state.data)),
      contentType: 'application/json',
      method: 'POST',
      success: handlePaymentsResponse,
    });
  }
};

const handlePaymentsResponse = (res) => {
  if (res.resultCode === 'RedirectShopper') {
    checkout.createFromAction(res.action).mount('#redirect-component');
  }
};

const handlePaymentMethodsResponse = (res) => {
  let i;
  let originKey = res.originKey;
  delete res.originKey;

  const configuration = {
    locale: 'it_IT',
    environment: 'test',
    originKey: originKey, // Your website's Origin Key. To find out how to generate one, see https://docs.adyen.com/user-management/how-to-get-an-origin-key.
    paymentMethodsResponse: res, // The payment methods response returned in step 1.
    showPayButton: true,
    onChange: handleOnChange, // Your function for handling onChange event
    onAdditionalDetails: handleOnAdditionalDetails,
    onSubmit: handleOnSubmit
  };

  checkout = new AdyenCheckout(configuration);

  const paymentMethods = res.paymentMethods;
  for (i = 0; i < paymentMethods.length; i++) {
    if (filterMethods && allowedPaymentMethods.indexOf(paymentMethods[i].type) === -1) {
      continue;
    }
    $('#payment-methods').append($(`<h4>${paymentMethods[i].name}</h4>`));
    const el = $('<div class="payment-method"></div>');
    const elId = `${paymentMethods[i].type}-method`;
    $(el).attr('id', elId);
    // $(el).append($(`<div class="name"><h4>${paymentMethods[i].name}</h4></div>`));
    const details = paymentMethods[i].details;
    if (details) {
      let j;
      for (j = 0; j < details.length; j++) {
        // $(el).append()
      }
    }
    $('#payment-methods').append(el);
    checkout.create(paymentMethods[i].type).mount(`#${elId}`);
  }
};

$(function(){
  $.ajax({
    url: 'http://localhost:3001/checkout/payment-methods',
    method: 'POST',
    success: handlePaymentMethodsResponse,
  });

  $('#amount-input').change((e) => {
    amount = parseFloat($(e.target).val());
  });

  $('#shopper-id-input').change((e) => {
    shopperReference = $(e.target).val();
  });

  $('#order-reference-input').change((e) => {
    reference = $(e.target).val();
  });

  $('#recurring-input').change((e) => {
    recurring = $(e.target).is(':checked');
  });
});
