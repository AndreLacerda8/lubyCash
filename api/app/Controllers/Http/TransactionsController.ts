import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import Transaction from 'App/Models/Transaction'
import { Producer } from '../../../kafkaService/Producer'
import { axiosReq } from '../../../axiosService/axiosReq'
import PixValidator from 'App/Validators/PixValidator'

export default class TransactionsController {
    public async send({ auth, request, response }: HttpContextContract){
        try{
            await request.validate(PixValidator)
            const senderId = auth.user?.id
            const receiverCpf = request.input('receiver')
            const amount = request.input('amount')

            const sender = await axiosReq(`/clients/${senderId}`)
            if(sender.data.current_balance < amount){
                return response.status(422).json({ message: 'You dont have enough balance to make this pix' })
            }

            const receiver = await Client.findBy('cpf_number', receiverCpf)
            if(!receiver){
                return response.status(404).json({ message: 'Receiver not found' })
            }

            const { data } = await axiosReq(`/clients/${receiver.id}`)
            if(data.statusCode === 404 || data.status === 'disapproved'){
                return response.status(404).json({ message: 'Receiver not Found' })
            }

            if(senderId){
                const transaction = new Transaction()
                transaction.sender_id = senderId
                transaction.receiver_id = receiver.id
                transaction.amount = amount
                await transaction.save()
            }

            Producer({
                topic: 'new-transaction',
                messages: [
                    { value: JSON.stringify({
                        sender_id: senderId,
                        receiver_id: receiver.id,
                        amount
                    })}
                ]
            })

            return response.status(200).json({ message: 'Pix sent successfully' })
        } catch(err){
            return response.status(err.status).json({
                message: 'An unexpected error has occurred',
                originalError: err.message
              })
        }
    }
}
