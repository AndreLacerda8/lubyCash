import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import CreateClientValidator from 'App/Validators/CreateClientValidator'
import UpdateClientValidator from 'App/Validators/UpdateClientValidator'
import { axiosReq } from '../../../axiosService/axiosReq'
import { Producer } from '../../../kafkaService/Producer'

export default class ClientsController {
  public async index({ request, response }: HttpContextContract) {
    try{
      const { data } = await axiosReq(`/clients?${request.parsedUrl.query}`)
      return response.status(200).json(data)
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async store({ request, response }: HttpContextContract) {
    await request.validate(CreateClientValidator)
    try{
      const cpf = request.body().cpf_number
      const email = request.body().email

      const cpfAlreadyExists = await Client.findBy('cpf_number', cpf)
      const emailAlreadyExists = await Client.findBy('email', email)

      if(!cpfAlreadyExists && !emailAlreadyExists){
        const hashedPassword = await Hash.make(request.body().password)
        const client = request.body()
        client.password = hashedPassword

        await Client.create({ cpf_number: cpf, email: request.body().email, password: hashedPassword, full_name: request.body().full_name })

        const newClient = await Client.findBy('cpf_number', cpf)

        client.api_id = newClient?.id
        Producer({
          topic: 'new-user',
          messages: [
            { value: JSON.stringify(client) }
          ]
        })
    
        return response.status(200).json({
          message: 'Your data will be analyzed and you will receive an email informing you of the approval status'
        })
      }

      const currentClient = await Client.findBy('email', email) || await Client.findBy('cpf_number', cpf)

      const { data } = await axiosReq(`/clients/${currentClient?.id}`)

      return data.status === 'disapproved' ?
        response.status(422).json({ message: 'Have you tried to register but failed' }) :
        response.status(422).json({ message: 'You are already registered' })
      
    } catch (err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async show({ auth, response }: HttpContextContract) {
    try{
      const { data } = await axiosReq(`/clients/${auth.user?.id}`)
  
      if(data.statusCode === 404){
        return response.status(404).json({ message: 'Client not Found' })
      }

      return response.json({
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
        permissions: data.permissions
      })
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async update({ auth, request, response }: HttpContextContract) {
    await request.validate(UpdateClientValidator)
    try{
      const id = auth.user?.id
      const client = request.body()

      const oldClient = await Client.findOrFail(id)
      oldClient.email = client.email
      oldClient.cpf_number = client.cpf_number
      oldClient.full_name = client.full_name
      oldClient.save()

      client.api_id = id

      Producer({ topic: 'update-user', messages: [{ value: JSON.stringify(client) }] })

      return response.status(200).json({ message: 'Data updated successfully' })

    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async destroy({ auth, response }: HttpContextContract) {
    try{
      const id = auth.user?.id

      const toDelete = await Client.findOrFail(id)
      await toDelete.delete()

      Producer({ topic: 'delete-user', messages: [{ value: JSON.stringify(id) }] })

      return response.status(200).json({ message: 'Data deleted successfully' })

    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }
}
