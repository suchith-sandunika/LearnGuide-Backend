const paypal = require('@paypal/checkout-server-sdk');
require('dotenv').config();

const CLIENT_ID = process.env.PAYMENT_CLIENT_ID;
const CLIENT_SECRET = process.env.PAYMENT_SECRET;

const environment = new paypal.core.SandboxEnvironment(
    CLIENT_ID, 
    CLIENT_SECRET
);

const client = new paypal.core.PayPalHttpClient(environment);

module.exports = { client };