import Hash from '@ioc:Adonis/Core/Hash'
import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import { Producer } from '../../../kafkaService/Producer'
import crypto from 'crypto'
import { axiosReq } from '../../../axiosService/axiosReq'
import moment from 'moment'
import ForgotPasswordValidator from 'App/Validators/ForgotPasswordValidator'
import RestorePasswordValidator from 'App/Validators/RestorePasswordValidator'

export default class ForgotPasswordsController {
  public async store({ request, response }: HttpContextContract) {
    await request.validate(ForgotPasswordValidator)
    try{
      const email = request.input('email')
      const client = await Client.findBy('email', email)
      if(!client){
        return response.status(404).json({ message: 'Client not Found' })
      }

      const { data } = await axiosReq(`/clients/${client.id}`)

      if(data.status === 'disapproved' || data.statusCode === 404){
        return response.status(404).json({ message: 'Client not found' })
      }

      client.token_forgot_password = crypto.randomBytes(10).toString('hex')
      client.token_forgot_password_created_at = new Date()
      client.save()

      Producer({ topic: 'forgot-password', messages: [
        { value: JSON.stringify({ api_id: client.id, token: client.token_forgot_password }) }
      ] })

      response.status(200).json({ message: 'You will receive an email with instructions to recover your password' })
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async update({ request, response }: HttpContextContract) {
    await request.validate(RestorePasswordValidator)
    try{
      const {token, password} = request.all()

      const client = await Client.findBy('token_forgot_password', token)

      if(!client){
        return response.status(401).json({ message: 'Invalid Token' })
      }

      const tokenExpired = moment().subtract('1', 'days').isAfter(client.token_forgot_password_created_at)
      if(tokenExpired){
        return response.status(401).json({ message: 'Expired token' })
      }

      const hashedPassword = await Hash.make(password)
      
      Producer({
        topic: 'redefine-password',
        messages: [{ value: JSON.stringify({ api_id: client.id, password: hashedPassword }) }]
      })

      client.token_forgot_password = null
      client.token_forgot_password_created_at = null
      client.password = hashedPassword
      await client.save()

      return response.status(200).json({ message: 'Password reset successfully' })

    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

}
