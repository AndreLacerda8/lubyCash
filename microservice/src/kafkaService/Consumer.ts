import { Kafka } from 'kafkajs'
import { CreateUser } from '../services/CreateClient'

interface ConsumerProps{
    groupId: string
    topic: string
    fromBeginning?: boolean
}

const kafka = new Kafka({
    clientId: 'microservice',
    brokers: ['kafka:9092']
})

export async function Consumer({ groupId, topic, fromBeginning = false }: ConsumerProps){
    const consumer = kafka.consumer({ groupId })

    await consumer.connect()
    await consumer.subscribe({ topic, fromBeginning })

    await consumer.run({
        eachMessage: async ({ topic, partition, message }) => {
            if(message.value)
                if(topic === 'new-user')
                    CreateUser(JSON.parse(message.value.toString()))
        }
    })
}