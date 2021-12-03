import { getRepository } from "typeorm";
import { Client } from "../entities/Client";

interface NewTransactionProps{
    sender_id: string
    receiver_id: string
    amount: number
}

export async function NewTransaction({ sender_id, receiver_id, amount }: NewTransactionProps){
    try{
        const clientRepository = getRepository(Client)
    
        const sender = await clientRepository.findOne({
            where: { api_id: sender_id }
        })
    
        const receiver = await clientRepository.findOne({
            where: { api_id: receiver_id }
        })
    
        if(sender && receiver){
            sender.current_balance = (Number(sender.current_balance.replace(/\D/g, '')) - amount).toString()
            receiver.current_balance = (Number(receiver.current_balance.replace(/\D/g, '')) + amount).toString()

            await clientRepository.save(sender)
            await clientRepository.save(receiver)
        }
    } catch(err){
        console.error(err)
    }
}