const mongoose = require('mongoose');

const journalSchema = new mongoose.Schema({
  name: { type: String, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  date_created: { type: Date, default: Date.now },
  TBL: { type: mongoose.Schema.Types.ObjectId, ref: 'TBL' },
  entries: [{
    Date: { type: Date, required: true },
    Description: { type: String },
    D_Account_title: { type: String, required: true },
    Debit_Amount: { type: Number, default: 0 },
    C_Account_title: { type: String, required: true },
    Credit_Amount: { type: Number, default: 0 },
  }],
});

module.exports = mongoose.model('Journal', journalSchema);
