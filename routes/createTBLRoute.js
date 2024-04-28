const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const TBL = require('../models/TBL');

router.post('/create-tbl', async (req, res) => {
    try {
      const {journalId} = req.body; // Assuming you pass the journal ID in the request body
      const journal = await Journal.findById(journalId).populate('TBL');
      if (!journal) {
        return res.status(404).json({ message: 'Journal not found' });
      }
      const trialBalance = {};
      for (const entry of journal.entries) {
        const accountTitle = entry.Account_title;
        const debitAmount = entry.Debit_Amount;
        const creditAmount = entry.Credit_Amount;
        trialBalance[accountTitle] = (trialBalance[accountTitle] || 0) + debitAmount;
        trialBalance[accountTitle] = (trialBalance[accountTitle] || 0) - creditAmount;
      }
  
      let tbl = journal.TBL;
      if (!tbl) {
        tbl = new TBL({ name: `TBL of ${journal.name}`, owner: journal.owner });
        journal.TBL = tbl._id;
        await journal.save();
      }
      tbl.entries = Object.entries(trialBalance).map(([accountTitle, balance]) => ({
        Account_Title: accountTitle,
        Debit_amount: balance > 0 ? balance : 0,
        Credit_Amount: balance < 0 ? -balance : 0,
      }));
      tbl.Total_debit = Object.values(trialBalance).reduce((acc, balance) => acc + (balance > 0 ? balance : 0), 0);
      tbl.Total_credit = Object.values(trialBalance).reduce((acc, balance) => acc + (balance < 0 ? -balance : 0), 0);
      await tbl.save();
      res.status(200).json({ message: 'Trial balance created successfully', tbl });
    } catch (error) {
      console.error('Error creating trial balance:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

  router.get('/get-tbl/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const trialBalance = await TBL.find({ owner: userId });
      if (!trialBalance) {
        return res.status(404).json({ message: 'Trial balance not found for the user' });
      }
      res.status(200).json({ trialBalance });
    } catch (error) {
      console.error('Error fetching trial balance:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  });

module.exports = router;
