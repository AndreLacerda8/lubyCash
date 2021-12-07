import { Request, Response } from "express"

import { getRepository } from "typeorm"
import { Client } from "../entities/Client"
import { ClientPermission } from "../entities/ClientsPermission"

export async function GetClient(req: Request, res: Response){
    try{
        const client = await getRepository(Client).findOne({
            where: {api_id: req.params.id}
        })
        if(!client){
            return res.json({ message: 'Client not found', statusCode: 404 })
        }

        const clientPermissions = getRepository(ClientPermission)
        const allpermissions = await clientPermissions.find({
            where: {client_id: client?.id},
            relations: ['permissionId']
        })

        const permissionsFormated = allpermissions.map(permission => {
            return permission.permissionId.name
        })

        const formatedClient = {
            ...client,
            permissions: permissionsFormated
        }
        return res.status(200).json(formatedClient)
    } catch(error: any){
        return res.status(error.status).json({
            message: 'An unexpected error has occurred',
            originalError: error.message
        })
    }
}