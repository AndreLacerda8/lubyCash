import { Kafka } from 'kafkajs'

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
            console.log({
                value: message.value?.toString()
            })
        }
    })
}