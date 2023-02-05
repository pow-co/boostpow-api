import {Sequelize} from "sequelize";
import models from "./models";
import { Op } from "sequelize";
import * as moment from 'moment'

export interface ListMiners {
    startDate?: Date;
    endDate?: Date;
}

export async function listMiners(params: ListMiners = {}): Promise<any> {

    let { startDate, endDate } = params

    if (startDate) {

        startDate = moment(startDate).toDate()

    } else {

        startDate = new Date(0)

    }

    if (endDate) {

        endDate = moment(endDate).toDate()

    } else {

        endDate = new Date()
    }

    const where = {
        minerPubKey: {
            [Op.ne]: null           
        }
    }

    if (params?.startDate) {
        where["timestamp"] = {
            [Op.gte]: params.startDate
        }
    }

    if (params?.endDate) {
        where["timestamp"] = {
            [Op.lte]: params.endDate
        }
    }

    var miners = await models.BoostWork.findAll({
        where,
        attributes: [
            "minerPubKey",
            [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
            [Sequelize.fn("SUM", Sequelize.col("difficulty")), "sum"],
        ],
        group: "minerPubKey",
        order: [['sum', 'desc']]
    })

    miners = miners.map(miner => {

        return {
            minerPubKey: miner.get('minerPubKey'),
            count: parseInt(miner.get('count')),
            sum: parseFloat(miner.get('sum'))
        }

    })

    return {miners, startDate, endDate}

}

export interface ListMinerWork {

}

export async function listMinerWork(params?: ListMinerWork): Promise<any> {


}
