import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import axios from 'axios'

export default class IsAdmin {
  public async handle({ auth, response }: HttpContextContract, next: () => Promise<void>) {
    
    const { data } = await axios(`http://microservice:3001/admin/${auth.user?.id}`)

    if(data.length >= 1){
      const isAdmin = data.filter(permission => {
        return permission.name === 'admin'
      })[0]
      if(!isAdmin){
        return response.status(403).json({ message: 'Unauthorized' })
      }
      await next()
    } else {
      return response.status(403).json({ message: 'Unauthorized' })
    }
  }
}
