'use strict'
const User = use('App/Models/User');
const Cannagrow = use('App/Models/Cannagrow');
const Curt = use('App/Models/Curt');
const Item = use('App/Models/Item');
const ItemReview = use('App/Models/ItemReview');
const DriverReview = use('App/Models/DriverReview');
const ItemTag = use('App/Models/ItemTag');
const Order = use('App/Models/Order');
const OrderDetail = use('App/Models/OrderDetail');
const Noti = use('App/Models/Noti');
const Database = use('Database')
var _ = require('lodash')
class BuyerController {
    async updateQuantity({ auth, request }) {
        const uid = await auth.user.id
        const data = request.all()
        console.log('data is', data)
        return Curt.query().where('id', data.id).where('userId', uid).update({
            'quantity': data.quantity
        })
    }
    async getBuyerOrderHistory({ request, response, auth }) {

        let user = await auth.getUser()

        let order = await Order.query()
            .where('userId', user.id)
            .with('orderdetails.item')
            .with('seller.user')
            .with('driver.user')
            .orderBy('id', 'desc')
            .fetch()


        return response.status(200).json({
            'success': true,
            "order": order,
        })
    }
    async updateOrderStatus({ request, response, auth }) {
        let uid = await auth.user.id
        const data = request.all()
        await Order.query()
            .where('id', data.id)
            .update({ 'status': data.status })
        return response.status(200).json({
            'success': true,
            "message": 'Order status has been changed successfully!'
        })
    }
    async updateDeliveryAddress({ request, response, auth }) {
        let uid = await auth.user.id
        console.log('user is id', uid)
        const data = request.all()

        console.log('data is', data)
        return User.query().where('id', uid).update(data)
    }
    async getNotification({ request, response, auth }) {
        let uid = await auth.user.id
        console.log(uid)
        const noti = await Noti.query().where('user_id', uid).fetch()
        return response.status(200).json({
            'success': true,
            "noti": noti
        })
    }

    async getDriverReview({ request, response, params, auth }) {

        let driverId = request.input("driverId")
        let user = await auth.getUser()
        let isDriverReviewd = 0

        let checkDriverReview = await DriverReview.query()
            .where('order_id', params.id)
            .where('userId', user.id)
            .where('driverId', driverId)
            .first()

        if (checkDriverReview) {
            isDriverReviewd = 1
        }

        return response.status(200).json({
            'isDriverReviewGiven': isDriverReviewd
        })

    }

    async getItemReviewPer({ request, response, params, auth }) {

        let itemId = request.input("itemId")
        let user = await auth.getUser()
        let isItemReviewd = 0

        let checkItemReview = await ItemReview.query()
            .where('order_id', params.id)
            .where('userId', user.id)
            .where('itemId', itemId)
            .first()

        if (checkItemReview) {
            isItemReviewd = 1
        }

        return response.status(200).json({
            'isItemReviewGiven': isItemReviewd
        })

    }



}

module.exports = BuyerController
