const mongoose = require('mongoose');

const tblSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_created: { type: Date, default: Date.now },
  entries: [{
    Account_Title: { type: String, required: true },
    Description: { type: String },
    Debit_amount: { type: Number, default: 0 },
    Credit_Amount: { type: Number, default: 0 },
  }],
  Total_debit: { type: Number, default: 0 },
  Total_credit: { type: Number, default: 0 },
});

module.exports = mongoose.model('TBL', tblSchema);
