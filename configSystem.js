require('dotenv').config();

module.exports = {
  mongoURI: process.env.MONGO_URI,
  savingsData: {
    goal: 15000,
    current: 0,
    transactions: []
  }
};