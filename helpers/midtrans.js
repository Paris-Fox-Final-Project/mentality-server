const midtransClient = require("midtrans-client");

const snapClient = new midtransClient.Snap({
  isProduction: false,
  serverKey: process.env.MIDTRANS_SERVER_KEY,
  clientKey: process.env.MIDTRANS_CLIENT_KEY,
});

const createMidtransTransaction = (parameter) => {
  return snapClient.createTransaction(parameter);
};

module.exports = createMidtransTransaction;
