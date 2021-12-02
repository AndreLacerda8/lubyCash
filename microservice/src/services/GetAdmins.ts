import { getRepository } from "typeorm";
import { Client } from "../entities/Client";
import { ClientPermission } from "../entities/ClientsPermission";

export async function GetAdmins(req: any, res: any){
    const id = req.params.id
    const clientRepository = getRepository(Client)
    const currentClient = await clientRepository.findOneOrFail({
        where: {api_id: id}
    })

    const clientsPermissionRepository = getRepository(ClientPermission)
    const allpermissions = await clientsPermissionRepository.find({
        where: {client_id: currentClient?.id},
        relations: ['permissionId']
    })

    const permissionsFormated = allpermissions.map(permission => {
        return permission.permissionId
    })

    return res.json(permissionsFormated)
}