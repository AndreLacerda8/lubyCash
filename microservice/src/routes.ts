import { Router } from 'express'
import { GetAdmins } from './services/GetAdmins'
import { GetAllClients } from './services/GetAllClients'
import { GetClient } from './services/GetClient'

const router = Router()

router.get('/clients/:id', GetClient)

router.get('/clients', GetAllClients)

router.get('/admin/:id', GetAdmins)

export { router }