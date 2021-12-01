import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import axios from 'axios'
import { Producer } from '../../../kafkaService/Producer'

export default class ClientsController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try{
      const cpf = request.body().cpf_number
      const { data } = await axios.get(`http://microservice:3001/clients/${cpf}`)
      if (data.statusCode === 404){
        const hashedPassword = await Hash.make(request.body().password)
        const client = request.body()
        client.password = hashedPassword

        await Client.create({ cpf_number: cpf, email: request.body().email, password: hashedPassword })

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

      return data.status === 'disapproved' ?
        response.status(422).json({ message: 'Have you tried to register but failed' }) :
        response.status(422).json({ message: 'You are already registered' })
      
    } catch (err){
      console.log(err)
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async login({ auth, request, response }: HttpContextContract) {
    try{
      const body = request.body()
      const cpf = body.cpf_number
  
      const { data } = await axios.get(`http://microservice:3001/clients/${cpf}`)
      
      if(data.status === 'disapproved' || data.statusCode === 404){
        return response.status(404).json({ message: 'Client not found' })
      }

      const email = request.body().email
      const password = request.body().password
      const token = await auth.use('api').attempt(email, password, {
        expiresIn: '1day'
      }).catch(() => response.status(404).json({ message: 'Incorrect data' }))

      if(!token){
        return response.status(404).json({ message: 'Incorrect data' })
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

  public async show({ auth, response }: HttpContextContract) {
    try{
      const { data } = await axios.get(`http://microservice:3001/clients/${auth.user?.cpf_number}`)
  
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
        average_salary: data.average_salary
      })
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async update({  }: HttpContextContract) {

  }

  public async destroy({}: HttpContextContract) {}
}
