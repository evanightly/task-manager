module.exports = (app, redisClient) => {
    app.get('/task', async (req, res) => {
        res.send("Appended")
    })

    app.post('/task', async (req, res) => {
        await redisClient.lPush('tasks', req.body.task)
        res.redirect('back')
    })

    app.post('/task/delete', async (req, res) => {
        const selectedTask = req.body.tasks
        const tasks = await redisClient.lRange('tasks', 0, -1)
        tasks.forEach(async (v, i) => {
            if (selectedTask.indexOf(v) > -1) {
                await redisClient.lRem('tasks', 0, tasks[i])
            }
        })
        res.redirect('back')
    })

}