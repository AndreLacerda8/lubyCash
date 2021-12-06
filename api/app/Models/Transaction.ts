import { DateTime } from 'luxon'
import { BaseModel, BelongsTo, belongsTo, column } from '@ioc:Adonis/Lucid/Orm'
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

  @belongsTo(() => Client, {
    foreignKey: 'sender_id'
  })
  public clientSender: BelongsTo<typeof Client>

  @belongsTo(() => Client, {
    foreignKey: 'receiver_id'
  })
  public clientReceiver: BelongsTo<typeof Client>
}
