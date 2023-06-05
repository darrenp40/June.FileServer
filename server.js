//if (process.env !== 'production'){
//require('dotenv').config()
//}
    
const express = require ('express')
const app = express()
const expressLayouts = require ('express-ejs-layouts')
const bodyParser = require('body-parser')

const indexRouter = require('./routes/index')
const creatorRouter = require('./routes/creators')

app.set('view engine', 'ejs')
app.set('views', __dirname + '/views')
app.set('layout','layouts/layout')
app.use(expressLayouts)
app.use(express.static('public'))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: false }))

const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://darrenp40:jWepCbfmQYNiIKXZ@cluster0.nbjdvoy.mongodb.net/documentServer', {useNewUrlParser: true })
const db = mongoose.connection
db.on('error', error => console.error(error))
db.once('open', error => console.log('Connected to Mongoose'))

app.use('/', indexRouter) 
app.use('/creators', creatorRouter) 

app.listen(process.env.PORT || 3000)