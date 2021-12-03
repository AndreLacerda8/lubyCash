import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import ClientLoginValidator from 'App/Validators/ClientLoginValidator'
import RegisterAdminValidator from 'App/Validators/RegisterAdminValidator'
import { axiosReq } from '../../../axiosService/axiosReq'
import { Producer } from '../../../kafkaService/Producer'

export default class ClientsController {
  public async login({ auth, request, response }: HttpContextContract) {
    await request.validate(ClientLoginValidator)
    try{
      const email = request.body().email
      const password = request.body().password
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '1day'
      }).catch(() => response.status(400).json({ message: 'Incorrect data' }))

      if(!token){
        return response.status(404).json({ message: 'User not Found' })
      }

      const currentClient = await Client.findBy('email', email)

      const { data } = await axiosReq(`/clients/${currentClient?.id}`)
      
      if(data.status === 'disapproved' || data.statusCode === 404){
        return response.status(404).json({ message: 'Client not found' })
      }

      return response.status(200).json({
        token: token?.token,
        client: {
          full_name: data.full_name,
          email: data.email,
          phone: data.phone,
          cpf_number: data.cpf_number,
          address: data.address,
          city: data.city,
          state: data.state,
          zipcode: data.zipcode,
          current_balance: data.current_balance,
          average_salary: data.average_salary,
        }
      })

    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async registerAdmin({request, response}: HttpContextContract){
    await request.validate(RegisterAdminValidator)
    try{
      const client = await Client.findBy('email', request.body().email)
  
      if(!client){
        return response.status(404).json({ message: 'Client not found' })
      }

      const clientPermission = {
        api_id: client.id,
        permissionName: 'admin'
      }

      Producer({
        topic: 'add-permission',
        messages: [
          { value: JSON.stringify(clientPermission) }
        ]
      })

      return response.status(200).json({ message: 'Client is now admin' })
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }

  }
}
