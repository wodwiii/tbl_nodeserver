const express = require('express');
const router = express.Router();
const Journal = require('../models/Journal');
const User = require('../models/User');

router.post('/create', async (req, res) => {
  try {
    const { name, owner } = req.body;
    const user = await User.findById(owner);
    if(!user){
        res.status(404).json({message: 'User not found'});
    }
    const journal = new Journal({ name, owner: user._id });
    await journal.save();
    await User.findByIdAndUpdate(owner, { $push: { journals: journal._id } });
    res.status(201).json({ message: 'Journal created successfully', journal });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

router.get('/:userId', async (req, res) => {
    try {
      const userId = req.params.userId;
      const user = await User.findById(userId).populate('journals');
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      res.status(200).json(user.journals);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});

router.put('/entry/:journalId', async (req, res) => {
    try {
      const journalId = req.params.journalId;
      const { entry } = req.body;
      const { Date, Account_title, Description, Debit_Amount, Credit_Amount } = entry;
      if (!Date || !Account_title) {
        return res.status(400).json({ error: 'Date and Account_title are required fields' });
      }
      const journal = await Journal.findById(journalId);
      if (!journal) {
        return res.status(404).json({ error: 'Journal not found' });
      }
      journal.entries.push({ Date, Account_title, Description, Debit_Amount, Credit_Amount });
      await journal.save();
      res.status(200).json({ message: 'Entry added successfully'});
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

  router.put('/entries/:entryId', async (req, res) => {
    try {
      const { entryId } = req.params;
      const { updatedEntry } = req.body;
      const journal = await Journal.findOne({ 'entries._id': entryId });
      if (!journal) {
        return res.status(404).json({ error: 'Journal containing the entry not found' });
      }
      const entryIndex = journal.entries.findIndex(entry => entry._id.toString() === entryId);
      if (entryIndex === -1) {
        return res.status(404).json({ error: 'Entry not found' });
      }
      journal.entries[entryIndex] = { ...journal.entries[entryIndex], ...updatedEntry };
      await journal.save();
      res.status(200).json({ message: 'Entry updated successfully', journal });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
module.exports = router;
