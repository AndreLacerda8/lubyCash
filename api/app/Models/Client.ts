import { DateTime } from 'luxon'
import { BaseModel, beforeCreate, column } from '@ioc:Adonis/Lucid/Orm'
import { v4 as uuidv4 } from 'uuid'

export default class Client extends BaseModel {
  @column({ isPrimary: true })
  public id: string

  @column()
  public cpf_number: string

  @column()
  public email: string

  @column()
  public password: string

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @beforeCreate()
  public static assignUuid(client: Client){
    client.id = uuidv4()
  }

  // @beforeSave()
  // public static async hashPassword(user: User){
  //   if(user.$dirty.password){
  //     user.password = await Hash.make(user.password)
  //   }
  // }
}
