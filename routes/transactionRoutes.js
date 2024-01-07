const express = require('express')
const { addTransactions, getAllTransactions, editTransactions, deleteTransaction } = require('../controllers/transactionController')

//router object
const router = express.Router()

//routes
//add transaction POST Method
router.post('/add-transaction', addTransactions)

//edit transaction POST Method
router.post('/edit-transaction', editTransactions)

//delete transaction
router.post('/delete-transaction', deleteTransaction)

//get transactions
router.post('/get-transaction', getAllTransactions)

module.exports = router