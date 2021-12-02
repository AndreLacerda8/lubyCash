import { getRepository } from "typeorm"
import { Client } from "../entities/Client"
import { ClientPermission } from "../entities/ClientsPermission"


export async function GetAllClients(req: any, res: any){
    try{
        const allClients = await getRepository(Client).find()

        const admins = await getRepository(ClientPermission).find({
            where: {permission_id: 1},
            relations: ['clientId']
        })

        const idsAdmins = admins.map(admin => {
            return admin.clientId.id
        })

        const clientsNotAdmin = allClients.filter(client => {
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