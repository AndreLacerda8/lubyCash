import { Kafka, Message } from 'kafkajs'

interface ProducerProps{
    topic: string
    messages: Message[]
}

const kafka = new Kafka({
    clientId: 'backend',
    brokers: ['kafka:9092']
})

export async function Producer({topic, messages}: ProducerProps){
    const producer = kafka.producer()

    await producer.connect()
    await producer.send({
        topic, 
        messages
    })

    await producer.disconnect()
}