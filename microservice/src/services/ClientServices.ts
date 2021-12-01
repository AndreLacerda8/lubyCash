import { Request, response, Response, Errback } from "express"

import { getRepository } from "typeorm"
import { Client } from "../entities/Client"

export async function GetClient(req: Request, res: Response){
    try{
        const client = await getRepository(Client).findOne({
            where: {cpf_number: req.params.cpf}
        })
        if(!client){
            return res.json({ message: 'Client not found', statusCode: 404 })
        }
        return res.status(200).json({
            full_name: client.full_name,
            email: client.email,
            phone: client.phone,
            cpf_number: client.cpf_number,
            address: client.address,
            city: client.city,
            state: client.state,
            zipcode: client.zipcode,
            current_balance: client.current_balance,
            average_salary: client.average_salary,
            status: client.status,
            status_date: client.status_date,
        })
    } catch(error: any){
        return res.status(error.status).json({
            message: 'An unexpected error has occurred',
            originalError: error.message
        })
    }
}

export async function Login(req: Request, res: Response){
    try{
        const client = await getRepository(Client).findOne({
            where: {cpf_number: req.params.cpf}
        })
    
        const correctEmail = client?.email === req.body.email
        const correctPassword = client?.password === req.body.password
        
        if(!client || !correctEmail || !correctPassword){
            return response.json({ message: 'Client not found', statusCode: 404 })
        }
    
        return res.status(200).json({ message: 'isLogged' })
    } catch(err: any){
        return response.status(err.status).json({
            message: 'An unexpected error has occurred',
            originalError: err.message
        })
    }
}