const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const dotenv = require('dotenv')
const colors = require('colors')
const connectDb = require('./config/connectDB')
const path = require('path')

//config env file
dotenv.config()

//database call
connectDb()

//rest object
const app = express()

//middlewares
app.use(express.json())
app.use(morgan('dev'))
app.use(cors())

//routesddd
//user routes
app.use('/users', require('./routes/userRoute'))

//transaction routes
app.use('/transactions', require('./routes/transactionRoutes'))

//static files
app.use(express.static(path.join(__dirname, './client/build')))



//port
const PORT = 8080 || process.env.PORT

//listening on port
app.listen(PORT, () =>{
    console.log(`Server running on port ${PORT}`)
})