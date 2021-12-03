import { DateTime } from 'luxon'
import { BaseModel, column, HasMany, hasMany } from '@ioc:Adonis/Lucid/Orm'
import Client from './Client'

export default class Transaction extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public sender_id: string

  @column()
  public receiver_id: string 
  
  @column()
  public amount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  @hasMany(() => Client)
  public lientSender: HasMany<typeof Client>

  @hasMany(() => Client)
  public clientReceiver: HasMany<typeof Client>
}
