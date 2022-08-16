const port = process.env.PORT || 6688
const express = require('express')
const dotenv = require('dotenv')
const redis = require('redis')
const path = require('path')
const fs = require('fs')
// Server Configuration
const app = express()
dotenv.config()
app
    .use(express.static(path.join(__dirname, '/frontend/assets')))
    .set('views', `${process.cwd()}/frontend/views/`)
    .use(express.urlencoded({ extended: true }))
    // .use(require('./backend/middleware/auth'))
    .set('view engine', 'pug')
    .use(express.json())

const redisClient = redis.createClient({ url: process.env.REDIS_URL })

redisClient.connect()
    .then(() => console.log('Connected With Redis'))
    .catch((err) => console.log('Redis Client Error', err))

const routes = fs.readdirSync(path.join(__dirname, 'backend', 'routes'))
for (const route of routes) {
    require(`./backend/routes/${route}`)(app, redisClient)
}

app.get('/', async (req, res) => {
    const tasks = await redisClient.lRange('tasks', 0, -1)
    await res.render('index', { tasks })
})
app.get('*', (req, res) => res.send('You have reached the dark zone'))

app.listen(port, () => console.log(`Server connected on port ${port}`))

module.exports = app