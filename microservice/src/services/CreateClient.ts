import { getRepository } from "typeorm";
import { Client } from "../entities/Client";
import { Mailer } from "./Mailer";

export interface ClientI{
    api_id: string
    full_name: string
	email: string
    password: string
	phone: string
	cpf_number: string
	address: string
	city: string
	state: string
	zipcode: string
	current_balance: string
	average_salary: string
}

export async function CreateClient(user: ClientI){
    if(parseFloat(user.average_salary) < 500){
        Mailer({
            to: user.email,
            subject: 'Satus de aprovação',
            text: 'Sentimos informar mas você foi reprovado',
            html: '<p>Sentimos informar mas você foi reprovado</p>'
        })
        await addClientOnDB(user, 'disapproved')
    } else {
        Mailer({
            to: user.email,
            subject: 'Satus de aprovação',
            text: 'Parabéns, você foi aprovado e agora é um cliente do Luby Cash',
            html: '<p>Parabéns, você foi aprovado e agora é um cliente do Luby Cash</p>'
        })
        await addClientOnDB(user, 'approved')
    }
}

async function addClientOnDB(user: ClientI, status: 'disapproved' | 'approved'){
    const clientRepository = getRepository(Client)
    const client = new Client()
    client.api_id = user.api_id
    client.full_name = user.full_name
    client.email = user.email
    client.password = user.password
    client.phone = user.phone
    client.cpf_number = user.cpf_number
    client.address = user.address
    client.city = user.city
    client.state = user.state
    client.zipcode = user.zipcode
    client.current_balance = user.current_balance
    client.average_salary = user.average_salary
    client.status = status
    client.status_date = new Date()
    await clientRepository.save(client)
}