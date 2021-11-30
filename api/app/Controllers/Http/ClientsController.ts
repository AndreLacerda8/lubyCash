import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import { Producer } from '../../../kafkaService/Producer'

export default class ClientsController {
  public async index({}: HttpContextContract) {}

  public async store({ request, response }: HttpContextContract) {
    try{
      //VERIFICAR SE USUÁRIO JÁ FOI REPROVADO ANTES
      console.log(request.body())
      Producer({
        topic: 'new-user',
        messages: [
          { value: JSON.stringify(request.body()) }
        ]
      })
  
      return response.status(200).json({
        message: 'Your data will be analyzed and you will receive an email informing you of the approval status'
      })
    } catch (err){
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
