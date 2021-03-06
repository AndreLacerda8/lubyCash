import { getRepository } from "typeorm";
import { Client } from "../entities/Client";

export async function DeleteClient(id: string){
    try{
        await getRepository(Client).delete({ api_id: id })
    } catch(err){
        console.error(err)
    }
}