import express from 'express'
import "reflect-metadata"
import { getRepository } from 'typeorm'
import { Consumer } from '../kafkaService/Consumer'
import './database'
import { Client } from './entities/Client'

const app = express()
app.use(express.json())

Consumer({
    groupId: 'test',
    topic: 'test'
})

app.get('/', (req, res) => {
    return res.json({ message: 'Hello World' })
})

app.get('/create', async (req, res) => {
    const clientRepository = getRepository(Client)
    const client = new Client()
    client.full_name = 'André Lacerda'
    client.email = 'andr@mail.com'
    client.password = 'senhaboa'
    client.phone = '37999999999'
    client.cpf_number = '11122233345'
    await clientRepository.save(client)
})

app.listen(8080, () => {
    console.log('Running')
})