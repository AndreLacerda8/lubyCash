import { Request } from "express"
import { getRepository } from "typeorm"
import { Client } from "../entities/Client"
import { ClientPermission } from "../entities/ClientsPermission"
import moment from 'moment'

export async function GetAllClients(req: Request, res: any){
    try{
        const allClients = await getRepository(Client).find({
            where: req.query.status ? { status: req.query.status } : {}
        })

        const from = req.query.from
        const to = req.query.to

        let clientsFiltered = allClients

        if(from){
            clientsFiltered = clientsFiltered.filter(client => {
                return new Date(`${client.status_date}`).setHours(0,0,0,0) >= new Date(`${from}`).getTime()
            })

            if(to){
                clientsFiltered = clientsFiltered.filter(client => {
                    return new Date(`${client.status_date}`).setHours(0,0,0,0) <= new Date(`${to}`).getTime()
                })
            }
        }

        const admins = await getRepository(ClientPermission).find({
            where: {permission_id: 1},
            relations: ['clientId']
        })

        const idsAdmins = admins.map(admin => {
            return admin.clientId.id
        })

        const clientsNotAdmin = clientsFiltered.filter(client => {
            return !idsAdmins.includes(client.id)
        })

        const formatedClients = clientsNotAdmin.map(client => {
            return {
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
                status_date: client.status_date
            }
        })

        return res.json(formatedClients)
    } catch(error: any){
        return res.status(error.status).json({
            message: 'An unexpected error has occurred',
            originalError: error.message
        })
    }
}