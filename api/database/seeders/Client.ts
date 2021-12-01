import BaseSeeder from '@ioc:Adonis/Lucid/Seeder'
import Client from 'App/Models/Client'

export default class ClientSeeder extends BaseSeeder {
  public async run () {
    await Client.create({
      cpf_number: '11122233345',
      email: 'andr@mail.com',
      password: 'senhaboa'
    })
  }
}
