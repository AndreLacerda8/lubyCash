import { Router } from 'express'
import { getRepository } from 'typeorm'
import { Client } from './entities/Client'
import { ClientPermission } from './entities/ClientsPermission'
import { Permission } from './entities/Permission'
import { GetClient } from './services/ClientServices'

const router = Router()

router.get('/initializedb', async (req, res) => {
    const clientRepository = getRepository(Client)
    const client = new Client()
    client.api_id = 'd163b3fb-eb4d-488a-8a7b-23d730c5894c'
    client.full_name = 'André Lacerda'
    client.email = 'andr@mail.com'
    client.password = 'senhaboa'
    client.phone = '37999999999'
    client.cpf_number = '11122233345'
    client.address = 'Rua principal 111 Bairro'
    client.city = 'Nova Serrana'
    client.state = 'MG'
    client.zipcode = '35520000'
    client.current_balance = '1000'
    client.average_salary = '1000'
    client.status = 'approved'
    client.status_date = new Date()
    await clientRepository.save(client)

    const permissionRepository = getRepository(Permission)
    const permission = new Permission()
    permission.name = 'admin'
    await permissionRepository.save(permission)

    const clientsPermissionRepository = getRepository(ClientPermission)
    const clientsPermission = new ClientPermission()
    clientsPermission.client_id = client.id
    clientsPermission.permission_id = permission.id
    clientsPermissionRepository.save(clientsPermission)
})

router.get('/clients/:cpf', GetClient)

export { router }