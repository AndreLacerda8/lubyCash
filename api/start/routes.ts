/*
|--------------------------------------------------------------------------
| Routes
|--------------------------------------------------------------------------
|
| This file is dedicated for defining HTTP routes. A single file is enough
| for majority of projects, however you can define routes in different
| files and just make sure to import them inside this file. For example
|
| Define routes in following two files
| ├── start/routes/cart.ts
| ├── start/routes/customer.ts
|
| and then import them inside `start/routes.ts` as follows
|
| import './routes/cart'
| import './routes/customer'
|
*/

import Route from '@ioc:Adonis/Core/Route'

Route.get('/', async () => {
    return({ hello: 'World' })
})

Route.group(() => {
    Route.post('register', 'ClientsControllerResource.store')
    Route.post('login', 'ClientsControllerOtherServices.login')
    Route.post('forgotpassword', 'ForgotPasswordsController.store')
    Route.post('restorepassword', 'ForgotPasswordsController.update')
})

Route.group(() => {
    Route.post('logout', 'ClientsControllerOtherServices.logout')
    Route.get('clients/myextract', 'ClientsControllerOtherServices.showMyExtract')
    Route.get('clients/profile', 'ClientsControllerResource.show')
    Route.put('clients/profile', 'ClientsControllerResource.update')
    Route.delete('clients/profile', 'ClientsControllerResource.destroy')
    Route.post('pix', 'TransactionsController.send')
}).middleware('auth')

Route.group(() => {
    Route.get('clients', 'ClientsControllerResource.index')
    Route.get('clients/extract/:cpf', 'ClientsControllerOtherServices.showExtract')
    Route.post('registeradmin', 'ClientsControllerOtherServices.registerAdmin')
}).middleware(['auth', 'isAdmin'])
