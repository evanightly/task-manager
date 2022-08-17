module.exports = (app, redisClient) => {
    app.get('/call', async (req, res) => {
        res.send("Call")
    })

    app.post('/call', async (req, res) => {
        const { id, ...data } = req.body
        console.log(data)
        await redisClient.lPush('callsTotal', id)
        await redisClient.hSet(`call:${id}`, data)
        res.redirect('back')
    })

    app.post('/call/delete', async (req, res) => {
        const { id } = req.body
        await redisClient.lRem('callsTotal', 0, id)
        await redisClient.del(`call:${id}`)
        res.redirect('back')
    })
}