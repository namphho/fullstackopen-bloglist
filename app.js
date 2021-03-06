const config = require('./utils/config')
const logger = require('./utils/logger')
const express = require('express')
require('express-async-errors')
const app = express()
const cors = require('cors')
const mongoose = require('mongoose')
const blogRouters = require('./controllers/blogs')
const userRouters = require('./controllers/users')
const loginRouters = require('./controllers/login')
const middleware = require('./utils/middleware')

//connect to DB
logger.info(config.MONGODB_URI)
mongoose
  .connect(config.MONGODB_URI)
  .then(() => {
    logger.info('connected success')
  })
  .catch((error) => {
    logger.info('error connection to MongoDB', error.message)
  })

app.use(cors())
app.use(express.json())

app.use('/api/users', userRouters)
app.use('/api/login', loginRouters)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}
app.use(middleware.tokenExtractor)
app.use('/api/blogs', middleware.userExtractor, blogRouters)
app.use(middleware.errorHandler)

module.exports = app
