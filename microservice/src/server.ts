import express from 'express'
import "reflect-metadata"
import { Consumer } from './kafkaService/Consumer'
import './database'
import { router } from './routes'

Consumer({
    groupId: 'create',
    topic: 'new-user'
})

Consumer({
    groupId: 'update',
    topic: 'update-user'
})

Consumer({
    groupId: 'delete',
    topic: 'delete-user'
})

Consumer({
    groupId: 'permission',
    topic: 'add-permission'
})

const app = express()
app.use(express.json())
app.use(router)

app.listen(3001, () => {
    console.log('Running')
})