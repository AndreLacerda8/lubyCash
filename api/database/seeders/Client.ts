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
// FAZER HASH DA SENHA ANTES DE MANDAR PRO MS (CONTROLLER STORE)
// FAZER A AUTENTICAÇÃO AQUI, COM EMAIL E SENHA, SE TIVER TUDO CERTO LA NO MS (CONTROLLER LOGIN)
// RODAR OS SEEDERS E TESTAR