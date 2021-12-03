import { getRepository } from "typeorm";
import { Client } from "../entities/Client";
import { Mailer } from "./Mailer";

interface ForgotPasswordProps{
    api_id: string
    token: string
}

interface RedefinePasswordProps{
    api_id: string
    password: string
}

export async function ForgotPassword({ api_id, token }: ForgotPasswordProps){
    try{
        const client = await getRepository(Client).findOne({
            where: { api_id: api_id }
        })
    
        if(client){
            Mailer({
                to: client.email,
                subject: 'Recuperação de senha',
                text: `Use este token para recuperar sua senha: ${token}`,
                html: `<p>Use este token para recuperar sua senha: ${token}</p>`
            })
        }
    } catch(err){
        console.error(err)
    }
}

export async function RedefinePassword({ api_id, password }: RedefinePasswordProps){
    try{
        await getRepository(Client)
            .update({ api_id: api_id }, { password })
    } catch(err){
        console.error(err)
    }
}