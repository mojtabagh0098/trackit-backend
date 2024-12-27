const express = require('express');
const jwt = require('jsonwebtoken');
const Expense = require('../models/Expense');
const authMiddleware = require('../middleware/auth');
const router = express.Router();

router.use(authMiddleware);

router.post('/', async (req, res) => {
  try {
    const userId = jwt.decode(req.headers.authorization).id;
    const expense = new Expense({ ...req.body, userId: userId });
    await expense.save();
    res.status(201).json(expense);
  } catch (error) {
    res.status(400).send(error);
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = jwt.decode(req.headers.authorization).id;
    const expenses = await Expense.find({ userId: userId });
    res.json(expenses);
  } catch (error) {
    res.status(500).send(error);
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const userId = jwt.decode(req.headers.authorization).id;
    const expense = await Expense.findOneAndDelete({ _id: req.params.id, userId: userId });
    if (!expense) {
      return res.status(404).send('Expense not found');
    }
    res.send('Expense deleted');
  } catch (error) {
    res.status(500).send(error);
  }
});

module.exports = router;