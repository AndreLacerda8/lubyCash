import { Kafka } from 'kafkajs'
import { AddClientPermission } from '../services/AddClientPermission'
import { CreateClient } from '../services/CreateClient'
import { DeleteClient } from '../services/DeleteClient'
import { ForgotPassword, RedefinePassword } from '../services/ForgotPassword'
import { NewTransaction } from '../services/NewTransaction'
import { UpdateClient } from '../services/UpdateClient'

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
            if(message.value){
                switch(topic){
                    case 'new-user':
                        CreateClient(JSON.parse(message.value.toString()))
                        break;
                    case 'update-user':
                        UpdateClient(JSON.parse(message.value.toString()))
                        break;
                    case 'delete-user':
                        DeleteClient(JSON.parse(message.value.toString()))
                        break;
                    case 'add-permission':
                        AddClientPermission(JSON.parse(message.value.toString()))
                        break;
                    case 'forgot-password':
                        ForgotPassword(JSON.parse(message.value.toString()))
                        break;
                    case 'redefine-password':
                        RedefinePassword(JSON.parse(message.value.toString()))
                        break;
                    case 'new-transaction':
                        NewTransaction(JSON.parse(message.value.toString()))
                        break;
                }
            }
        }
    })
}