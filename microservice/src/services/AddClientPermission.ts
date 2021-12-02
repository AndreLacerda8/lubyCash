import { getRepository } from "typeorm"
import { Client } from "../entities/Client"
import { ClientPermission } from "../entities/ClientsPermission"
import { Permission } from "../entities/Permission"

interface ClientPermissionI{
    api_id: string
    permissionName: string
}

export async function AddClientPermission(clientPermission: ClientPermissionI){
    try{
        const permission = await getRepository(Permission).findOne({
            where: {name: clientPermission.permissionName}
        })

        const clientId = await getRepository(Client).findOne({
            where: {api_id: clientPermission.api_id}
        })

        if(permission && clientId){
            const clientPermissionRepository = getRepository(ClientPermission)
            const newClientPermission = new ClientPermission()
            newClientPermission.client_id = clientId.id
            newClientPermission.permission_id = permission.id
            await clientPermissionRepository.save(newClientPermission)
        }
    } catch(err){
        console.error(err)
    }
}