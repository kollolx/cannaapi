'use strict'
const Noti = use('App/Models/Noti');
class NotificationController {

    async getUnseenNoti({ request, response, auth }) {
        let user = await auth.getUser()

        if (user.userType == 2) {
            let noti = await Noti.query()
            .where('user_id', user.id)
            .where('created_at', '>', user.created_at)
            .where('seen', 0)
            // .orWhere({
            //     'isAll': 1,
            //     'notiType': 'driver',
            //     'seen': 0
            // })
            // .where('created_at', '>', user.created_at)
            .count('id as count')
            .first();
            // let noti = await Noti.query().where('user_id', user.id).orWhere('isAll', 1).where('notiType', 'driver').andWhere('seen', 0).count('id as count').first();
            return response.status(200).json({
                'success': true,
                "notification": noti
            })
        }

        let noti = await Noti.query().where('user_id', user.id).where('seen', 0).count('id as count').first();
        return response.status(200).json({
            'success': true,
            "notification": noti
        })
    }
    async getUnseenNotiDetails({ request, response, auth }) {
        let user = await auth.getUser()
        if (user.userType == 2) {
            let noti = await Noti.query()
                .where('user_id', user.id)
                .where('created_at', '>', user.created_at)
                // .orWhere({
                //     'isAll': 1,
                //     'notiType': 'driver',
                // })
                // .where('created_at', '>', user.created_at)
                .limit(10)
                .orderBy('id', 'desc')
                .fetch();
            return response.status(200).json({
                'success': true,
                "notification": noti
            })
        }

        let noti = await Noti.query().where('user_id', user.id).limit(10).orderBy('id', 'desc').fetch();
        return response.status(200).json({
            'success': true,
            "notification": noti
        })


    }
    async updateNoti({ request, response, auth }) {
        let user = await auth.getUser()

        await Noti.query().where('user_id', user.id).update({
            seen: 1
        });

        return response.status(200).json({
            'success': true,
            "message": 'Notification Updated!'
        })
    }


}

module.exports = NotificationController
