const express = require('express')
const { loginController, registerController } = require('../controllers/userController')

//router object
const router = express.Router()

//routers
// POST - USER LOGIN
router.post('/login', loginController)

// POST - USER REGISTRATION
router.post('/register', registerController)

module.exports = router