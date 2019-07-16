'use strict'

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Model = use('Model')

class Order extends Model { 
    orderdetails () {
        return this.hasMany('App/Models/OrderDetail', 'id', 'orderId') 
    }
    buyer(){
        return this.belongsTo('App/Models/User','userId','id')
    }
    seller(){
        return this.belongsTo('App/Models/User','sellerId','id')
    }

}

module.exports = Order
