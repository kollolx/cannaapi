'use strict'
const Cannadrive = use('App/Models/Cannadrive');
const DriverReview = use('App/Models/DriverReview');
const Noti = use('App/Models/Noti');
const Cannagrow = use('App/Models/Cannagrow');
const Order = use('App/Models/Order');
const Database = use('Database')
class CannaDriveController {
  async edit({ request, response, auth }) {
    //  try {
    let data = request.all()
    let user = await auth.getUser()
    //  data.userId = user.id
    let cannadrive = await Cannadrive.query().where('id', data.id).update(data)
    return response.status(200).json({
      'success': true,
      'message': 'response Updated successfully !',
      'data': data
    })
    //   } catch (error) {
    //     return response.status(401).json({
    //         'success': false,
    //         'message': 'You first need to login first!'
    //     })
    //   }

  }
  async indexSingleDriver({ params, response, auth }) {
    //  try {
    //  let user =  await auth.getUser()
    let allItems = await Cannadrive.query().where('id', params.id).with('user').fetch()

    return response.status(200).json({
      'success': true,
      "driver": allItems
    })
    //   } catch (error) {
    //     return response.status(401).json({
    //         'success': false,
    //         'message': 'You first need to login first!'
    //     })
    //   }

  }
  //   async driverHome ({request,response,auth,params}){
  //     //  try {
  //         let user =  await auth.getUser()
  //           let totalsales = await User.query().where('id' , user.id).with('drivertotalsales').first()

  //           let grower = await Cannagrow.query().where('userId',params.id).first()
  //           const mostPopular = await Database.raw('SELECT items.* , cast(AVG(item_reviews.rating) as decimal(10,2)) AS averageRating FROM items LEFT JOIN item_reviews ON items.id = item_reviews.itemId WHERE items.growId = ? GROUP BY items.id ORDER by averageRating desc limit 3 ', [grower.id])
  //           const leastPopular = await Database.raw('SELECT items.* , cast(AVG(item_reviews.rating) as decimal(10,2)) AS averageRating FROM items LEFT JOIN item_reviews ON items.id = item_reviews.itemId WHERE items.growId = ? GROUP BY items.id ORDER by averageRating ASC limit 3 ', [grower.id])
  //           return response.status(200).json({
  //               'success': true,
  //               'message': 'request data recived successfully !', 
  //               "item": totalsales,
  //               "mostPopular": mostPopular[0],
  //               "leastPopular": leastPopular[0]
  //             })
  //       //   } catch (error) {
  //       //     return response.status(401).json({
  //       //         'success': false,
  //       //         'message': 'You first need to login first!'
  //       //     })
  //       //   }

  // }

  async showDriverReview({ request, response, auth, params }) {
    //  try {
    let driverreview = await Cannadrive.query().where('id', params.id).with('reviews.user').with('avgRating').first()

    return response.status(200).json({
      'success': true,
      "driverreview": driverreview
    })
    //   } catch (error) {
    //     return response.status(401).json({
    //         'success': false,
    //         'message': 'You first need to login first!'
    //     })
    //   }

  }
  async storeDriverReview({ request, response, auth }) {
    //  try {
    let data = request.all()
    let user = await auth.getUser()
    data.userId = user.id


    let driverreview = await DriverReview.create(data)

    let driverId = await Cannadrive.query().select('userId').where('id', driverreview.driverId).first()

    await Noti.create({
      'user_id': driverId.userId,
      'title': 'New Review Created!',
      'msg': `You got a new review'! `,
    })

    return response.status(200).json({
      'success': true,
      'message': 'response stored successfully !',
      "driverreview": driverreview
    })
    //   } catch (error) {
    //     return response.status(401).json({
    //         'success': false,
    //         'message': 'You first need to login first!'
    //     })
    //   }

  }
  async editDriverReview({ request, response, auth }) {
    //  try {
    let data = request.all()
    let user = await auth.getUser()
    if (data.userId == user.id) {
      return response.status(401).json({
        'success': false,
        'message': 'You are not authenticated user'
      })
    }
    let driverreview = await DriverReview.query().where('id', data.id).update(data)

    return response.status(200).json({
      'success': true,
      'message': 'response updated successfully !',
      "driverreview": driverreview
    })
    //   } catch (error) {
    //     return response.status(401).json({
    //         'success': false,
    //         'message': 'You first need to login first!'
    //     })
    //   }

  }
  async destroyDriverReview({ request, response, auth }) {
    //  try {
    let data = request.all()
    let user = await auth.getUser()

    if (data.userId == user.id) {
      return response.status(401).json({
        'success': false,
        'message': 'You are not authenticated user'
      })
    }
    await DriverReview.query().where('id', data.id).delete()

    return response.status(200).json({
      'success': true,
      'message': 'response deleted successfully !',
    })
    //   } catch (error) {
    //     return response.status(401).json({
    //         'success': false,
    //         'message': 'You first need to login first!'
    //     })
    //   }

  }

  async driverAcceptOrder({ request, response, auth }) {
    let data = request.all()
    let user = await auth.getUser()


    let firstinfo = await Order.query().where('id', data.id).first()
    if (firstinfo.driverId == null) {
      let order = await Order.query().where('id', data.id).update(data)
      const sellerUserId = await Cannagrow.query().where('id', firstinfo.sellerId).first()

      Noti.create({
        'user_id': sellerUserId.userId,
        'title': 'Driver found',
        'msg': `${user.name} will drive this order! `,
      })
      Noti.create({
        'user_id': firstinfo.userId,
        'title': 'Driver found',
        'msg': `${user.name} will drive this order! `,
      })
      return response.status(200).json({
        'success': true,
        'message': 'Order Accepted !',
      })
    }

    return response.status(200).json({
      'success': false,
      'message': 'Order is accepted by other driver !',
    })

  }
  async getNewOrder({ request, response, auth }) {

    let order = await Order.query().where('status', 'Request for Driver').with('orderdetails.item').with('buyer').with('seller').fetch();
    return response.status(200).json({
      'success': true,
      "orders": order
    })

  }
  async getNewOrder({ request, response, auth }) {

    let order = await Order.query().where('status', 'Request for Driver').with('orderdetails.item').with('buyer').with('seller').fetch();
    return response.status(200).json({
      'success': true,
      "orders": order
    })

  }
  // Driver weekly income 
  async driverWeeklyIncome({ params }) {
    let d = new Date();
    let prev = new Date();
    prev.setDate(d.getDate() - 7);
    let monthNumber = d.getMonth() + 1
    let pmonthNumber = prev.getMonth() + 1
    monthNumber = ("0" + monthNumber).slice(-2);
    pmonthNumber = ("0" + pmonthNumber).slice(-2);
    let dayNumber = d.getDate()
    let pdayNumber = prev.getDate()
    pdayNumber = ("0" + pdayNumber).slice(-2);
    //let today = ${d.getFullYear()}-${monthNumber}-${dayNumber}

    let today = d.getFullYear() + '-' + monthNumber + '-' + dayNumber;
    let laterweek = d.getFullYear() + '-' + pmonthNumber + '-' + pdayNumber;



    // let data =  Order.query().select(Database.raw(' DATE_FORMAT(created_at, "%Y-%m-%d") AS date, DATE_FORMAT(created_at, "%Y") AS year ,  DATE_FORMAT(created_at, "%m") AS month , DATE_FORMAT(created_at, "%d") AS day '), Database.raw(' sum(deliveryFee) AS total')).whereBetween('created_at', ['2019-07-14', today]).where('driverId',params.id).groupBy('date').fetch()
    let data = await Order.query().select(Database.raw('DATE_FORMAT(created_at, "%Y-%m-%d") AS date'), Database.raw(' sum(deliveryFee) AS total')).whereBetween('created_at', [laterweek, today]).where('driverId', params.id).groupBy('date').fetch()


    // data = data.toJSON()
    data = JSON.parse(JSON.stringify(data))
    return data
  }

  // Driver Monthly Income
  async driverMonthlyIncome({ params }) {
    let d = new Date();
    let prev = new Date();
    // prev.setDate(d.getDate() - 30);
    let monthNumber = d.getMonth() + 1
    let pmonthNumber = prev.getMonth() + 1
    monthNumber = ("0" + monthNumber).slice(-2);
    pmonthNumber = ("0" + pmonthNumber).slice(-2);
    let dayNumber = d.getDate()
    let pdayNumber = prev.getDate()
    pdayNumber = ("0" + pdayNumber).slice(-2);
    //let today = ${d.getFullYear()}-${monthNumber}-${dayNumber}

    let today = d.getFullYear() + '-' + monthNumber + '-' + dayNumber
    let previousMonth = d.getFullYear() + '-' + pmonthNumber + '-' + '1'



    let data = await Order.query().select('driverId', Database.raw(' sum(deliveryFee) AS total')).whereBetween('created_at', [previousMonth, today]).where('driverId', params.id).fetch()

    data = JSON.parse(JSON.stringify(data))
    let another = [];

    for (let t in data) {

      let dd = new Date(data[t].date);
      let ob = {
        date: data[t].date,
        total: data[t].total,
        year: dd.getFullYear(),
        month: dd.getMonth() + 1,
        day: dd.getDate()
      }
      another.push(ob)

    }

    return another;
  }

  // Driver Previous Month Income
  async driverPreviousMonthIncome({ params }) {
    let d = new Date();
    let prev = new Date();

    let monthNumber = d.getMonth()
    let pmonthNumber = prev.getMonth()

    monthNumber = ("0" + monthNumber).slice(-2);
    pmonthNumber = ("0" + pmonthNumber).slice(-2);


    let pdayNumber = this.daysInMonth(d.getMonth(), d.getFullYear())

    pdayNumber = ("0" + pdayNumber).slice(-2);

    let today = d.getFullYear() + '-' + monthNumber + '-' + pdayNumber
    let previousMonth = d.getFullYear() + '-' + pmonthNumber + '-' + '1'



    let data = await Order.query().select('driverId', Database.raw(' sum(deliveryFee) AS total')).whereBetween('created_at', [previousMonth, today]).where('driverId', params.id).fetch()

    data = JSON.parse(JSON.stringify(data))
    
    return {
      sellerId: data[0].driverId,
      total: data[0].total,
      month: d.getMonth()
    }
  }

  // Driver Yearly Average Income
  async driverYearlyAverageIncome({ params }) {
    let d = new Date();

    let monthNumber = d.getMonth() + 1


    monthNumber = ("0" + monthNumber).slice(-2);

    let pdayNumber = this.daysInMonth(d.getMonth(), d.getFullYear())


    pdayNumber = ("0" + pdayNumber).slice(-2);
    //let today = ${d.getFullYear()}-${monthNumber}-${dayNumber}

    let today = d.getFullYear() + '-' + monthNumber + '-' + pdayNumber
    let previousMonth = d.getFullYear() + '-' + '1' + '-' + '1'



    let data = await Order.query().select('driverId', Database.raw(' avg(price) AS avg')).whereBetween('created_at', [previousMonth, today]).where('driverId', params.id).fetch()

    data = JSON.parse(JSON.stringify(data))
    let another = [];

    return data

  }

  // total days in a month
  daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
  }




}

module.exports = CannaDriveController
