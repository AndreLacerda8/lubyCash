import { HttpContextContract } from '@ioc:Adonis/Core/HttpContext'
import Client from 'App/Models/Client'
import Transaction from 'App/Models/Transaction'
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
          permissions: data.permissions
        }
      })

    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async logout({ auth, response }: HttpContextContract){
    try{
      await auth.use('api').revoke()
      return response.status(200).json({ message: 'Logout successfully' })
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async getAllTransactions({ request, response }: HttpContextContract){
    try{
      const { from, to } = request.qs()
      let transactions: Transaction[]

      if(from){
        transactions = await Transaction.query().preload('clientReceiver').preload('clientSender')
          .where('created_at', '>=', new Date(`${from}T00:00:00`))
        if(to){
          transactions = transactions.filter(transaction => {
            return new Date(`${transaction.createdAt}`).setHours(0,0,0,0) <= new Date(`${to}`).getTime()
          })
        }
      } else {
        transactions = await Transaction.query().preload('clientReceiver').preload('clientSender')
      }

      const formatedTransactions = transactions.map(transaction => {
        return{
          from: transaction.clientSender.full_name,
          to: transaction.clientReceiver.full_name,
          amount: transaction.amount,
          date: transaction.createdAt
        }
      })
      return response.json({
        formatedTransactions
      })
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  private async getTransactions(id: string, from?: string, to?: string){
    let transactionsSend: Transaction[]
    let transactionsReceive: Transaction[]
    if(from){
      transactionsSend = await Transaction.query().where('sender_id', id).preload('clientReceiver')
        .where('created_at', '>=', from)
      transactionsReceive = await Transaction.query().where('receiver_id', id).preload('clientSender')
        .where('created_at', '>=', from)
      if(to){
        transactionsSend = transactionsSend.filter(transaction => {
          return new Date(`${transaction.createdAt}`).setHours(0,0,0,0) <= new Date(`${to}`).getTime()
        })
        transactionsReceive = transactionsReceive.filter(transaction => {
          return new Date(`${transaction.createdAt}`).setHours(0,0,0,0) <= new Date(`${to}`).getTime()
        })
      }
    } else{
      transactionsSend = await Transaction.query().where('sender_id', id).preload('clientReceiver')
      transactionsReceive = await Transaction.query().where('receiver_id', id).preload('clientSender')
    }

    const formatedTransactionsSend = transactionsSend.map(transaction => {
      return {
        to: transaction.clientReceiver.full_name,
        amount: transaction.amount,
        date: transaction.createdAt
      }
    })

    const formatedTransactionsReceive = transactionsReceive.map(transaction => {
      return {
        from: transaction.clientSender.full_name,
        amount: transaction.amount,
        date: transaction.createdAt
      }
    })

    return { formatedTransactionsSend, formatedTransactionsReceive }
  }

  public async showMyExtract({ auth, response }: HttpContextContract){
    try{
      if(!auth.user?.id){
        return response.json({ message: 'Error' })
      }
      
      const { formatedTransactionsSend, formatedTransactionsReceive } = await this.getTransactions(auth.user.id)

      const { data } = await axiosReq(`/clients/${auth.user?.id}`)

      return response.status(200).json({
        pix_sent: formatedTransactionsSend,
        pix_received: formatedTransactionsReceive,
        current_balance: data.current_balance
      })
    } catch(err){
      return response.status(err.status).json({
        message: 'An unexpected error has occurred',
        originalError: err.message
      })
    }
  }

  public async showExtract({ request, response }: HttpContextContract){
    try{
      const client = await Client.findBy('cpf_number', request.param('cpf'))
      if(!client){
        return response.status(404).json({ message: 'Client not found' })
      }

      const from = request.qs().from
      const to = request.qs().to

      const { formatedTransactionsSend, formatedTransactionsReceive } = await this.getTransactions(client.id, from, to)

      const { data } = await axiosReq(`/clients/${client.id}`)

      return response.json({
        pix_sent: formatedTransactionsSend,
        pix_received: formatedTransactionsReceive,
        current_balance: data.current_balance
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
