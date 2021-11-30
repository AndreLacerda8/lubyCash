import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import axios from 'axios'
import { Producer } from '../../../kafkaService/Producer'

export default class ClientsController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try{
      const cpf = request.body().cpf_number
      const { data, status } = await axios({
        url: `http://localhost:8080/clients/${cpf}`,
        method: 'GET'
      })
      if(status === 200){
        return data.status === 'disapproved' ? 
          response.status(422).json({ message: 'Have you tried to register and failed' }) :
          response.status(422).json({ message: 'You are already registered' })
      }
      
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
    } catch (err){
      console.log(err)
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
