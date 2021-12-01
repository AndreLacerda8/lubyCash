import express from 'express'
// import cors from 'cors'
import "reflect-metadata"
import { Consumer } from './kafkaService/Consumer'
import './database'
import { router } from './routes'

Consumer({
    groupId: 'user',
    topic: 'new-user'
})

const app = express()
// app.use(cors())
app.use(express.json())
app.use(router)

app.listen(3001, () => {
    console.log('Running')
})