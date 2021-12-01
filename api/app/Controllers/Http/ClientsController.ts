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
        Producer({
          topic: 'new-user',
          messages: [
            { value: JSON.stringify(request.body()) }
          ]
        })
  
        await Client.create({ cpf_number: cpf })
    
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

  public async login({ request, response }: HttpContextContract) {
    try{
      const body = request.body()
      const cpf = body.cpf_number
  
      const client = await Client.findBy('cpf_number', cpf)
      if(!client){
        return response.status(404).json({ message: 'User not found' })
      }
  
      const { data } = await axios.post('http://microservice:3001/login', body)
      if(data.statusCode === 404){
        return response.status(404).json(data.message)
      }

      if(data.message === 'isLogged'){
        return response.status(200).json({ message: data.message })
      }

    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async show({}: HttpContextContract) {}

  public async update({}: HttpContextContract) {}

  public async destroy({}: HttpContextContract) {}
}
