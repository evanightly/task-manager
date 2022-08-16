module.exports = (app, redisClient) => {
    app.get('/call', async (req, res) => {
        res.send("Call")
    })

    app.post('/call', async (req, res) => {
        await redisClient.
            res.send(result)
    })
}