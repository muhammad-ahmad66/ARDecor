import axios from 'axios';
import { showAlert } from './alerts';

const stripe = Stripe(
  'pk_test_51PMc9YSAr4IGzYowgYMK2QU8BNrM503J43nA6DlitbMDUt3lNXkcATxz6rvdxa3pDY4XbHssigBrSvEqIHMSu6bK00AKgZfoiO',
);

export const purchaseProduct = async () => {
  try {
    // 1) GET THE SESSION FROM THE SERVER. using checkout-session route.
    const session = await axios({
      method: 'GET',
      url: '/orders/checkout-session',
    });

    console.log(session);
    await stripe.redirectToCheckout({
      sessionId: session.data.session.id,
    });

    // 2) CREATE CHECKOUT FORM + CHARGE CREDIT CARD.
  } catch (err) {
    showAlert('error', err);
  }
};
