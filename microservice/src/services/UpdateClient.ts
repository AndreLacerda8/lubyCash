import { getRepository } from "typeorm";
import { Client } from "../entities/Client";
import { ClientI } from "./CreateClient";


export async function UpdateClient(client: ClientI){
    try{
        await getRepository(Client)
            .update({ api_id: client.api_id }, { ...client })
    } catch(err){
        console.error(err)
    }
}