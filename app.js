const express = require('express')
const app = express()
const cookieParser = require('cookie-parser')
const dotenv = require('dotenv')

const rateLimiter = require('express-rate-limit')
const helmet = require('helmet')
const sanitize = require('express-mongo-sanitize')
const xss = require('xss-clean')
const hpp = require('hpp')

//Controllers
const errorController = require('./controllers/errorController')

//Routers
const userRouter = require('./routes/userRouter')
const reviewRouter = require('./routes/reviewRouter')
const productRouter = require('./routes/productRouter')


//Loading contants and modules

dotenv.config('./.env')
require('./db')()

const limiter = rateLimiter({
    max: 100,
    windowMs: 3600000,
    message: 'Too many requests from this ip adress. Please try again in one hour!'
 });


//Limit number of requests to 100 for certain ip adress 
app.use('/users', limiter);
//Set security headers for additional protection
app.use(helmet());


//Convert request to json data and limit to 10kb
app.use(express.json({ limit: '10kb'}));
app.use(express.urlencoded({
    extended: false
}));
//Parse cookies for later use
app.use(cookieParser())

//Protect mongo from no sql query injection
app.use(sanitize())
//Protect app from xss
app.use(xss())
//Protect from parameter polution
app.use(hpp());

app.use('/api/v1/users', userRouter);
app.use('/api/v1/reviews', reviewRouter);
app.use('/api/v1/products', productRouter);

app.all('*', errorController.wrongRouteHitHandler);
app.use(errorController.rejectedPromiseHandler);

module.exports = app;