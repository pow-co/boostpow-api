import {Sequelize} from "sequelize";
import models from "./models";
import { Op } from "sequelize";
import moment from 'moment'

export interface ListMiners {
    start_date?: Date;
    end_date?: Date;
}

export async function listMiners(params: ListMiners = {}): Promise<any> {

    let { start_date, end_date } = params

    if (start_date) {

        start_date = moment(start_date).toDate()

    } else {

        start_date = new Date(0)

    }

    if (end_date) {

        end_date = moment(end_date).toDate()

    } else {

        end_date = new Date()
    }

    const where = {
        minerPubKey: {
            [Op.ne]: null           
        }
    }

    if (params?.start_date) {
        where["timestamp"] = {
            [Op.gte]: params.start_date
        }
    }

    if (params?.end_date) {
        where["timestamp"] = {
            [Op.lte]: params.end_date
        }
    }

    var miners = await models.BoostWork.findAll({
        where,
        attributes: [
            "minerPubKey",
            [Sequelize.fn("COUNT", Sequelize.col("id")), "count"],
            [Sequelize.fn("SUM", Sequelize.col("difficulty")), "difficulty"],
            [Sequelize.fn("SUM", Sequelize.col("value")), "satoshis"],
        ],
        group: "minerPubKey",
        order: [['difficulty', 'desc']]
    })

    miners = miners.map(miner => {

        return {
            minerPubKey: miner.get('minerPubKey'),
            count: parseInt(miner.get('count')),
            difficulty: parseFloat(miner.get('difficulty')),
            satoshis: parseFloat(miner.get('satoshis'))
        }

    })

    return {miners, start_date, end_date}

}

export interface ListMinerWork {

}

export async function listMinerWork(params?: ListMinerWork): Promise<any> {


}
