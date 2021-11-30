import { Router } from 'express'
import { getRepository } from 'typeorm'
import { Client } from './entities/Client'

const router = Router()

// router.get('/create', async (req, res) => {
//     const clientRepository = getRepository(Client)
//     const client = new Client()
//     client.full_name = 'André Lacerda'
//     client.email = 'andr@mail.com'
//     client.password = 'senhaboa'
//     client.phone = '37999999999'
//     client.cpf_number = '11122233345'
//     client.address = 'Rua principal 111 Bairro'
//     client.city = 'Nova Serrana'
//     client.state = 'MG'
//     client.zipcode = '35520000'
//     client.current_balance = '1000'
//     client.average_salary = '1000'
//     client.status = 'approved'
//     client.status_date = new Date()
//     await clientRepository.save(client)
// })

router.get('/clients/:cpf', async (req, res) => {
    try{
        const client = await getRepository(Client).findOne({ where: {cpf_number: req.params.cpf} })
        if(!client){
            return res.status(404).json({ message: 'Client not found' })
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
            status_date: client.status_date
        })
    } catch(error: any){
        return res.status(error.status).json({
            message: 'An unexpected error has occurred',
            originalError: error.message
        })
    }
})

export { router }