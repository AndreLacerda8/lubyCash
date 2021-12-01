import { Request, Response } from "express"

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
        return res.status(200).json(client)
    } catch(error: any){
        return res.status(error.status).json({
            message: 'An unexpected error has occurred',
            originalError: error.message
        })
    }
}