import { getRepository } from "typeorm";
import { Client } from "../entities/Client";
import { ClientI } from "./CreateClient";


export async function UpdateClient(client: ClientI){
    try{
        await getRepository(Client)
            .update({ api_id: client.api_id }, { 
                full_name: client.full_name,
                email: client.email,
                phone: client.phone,
                cpf_number: client.cpf_number,
                address: client.address,
                city: client.city,
                state: client.state,
                zipcode: client.zipcode,
                average_salary: client.average_salary,
            })
    } catch(err){
        console.error(err)
    }
}