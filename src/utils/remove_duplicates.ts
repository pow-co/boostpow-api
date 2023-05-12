#!/usr/bin/env ts-node

import models from './src/models'

async function main() {

  let records = await models.Content.findAll({
    group: [['txid']],
    attributes: ['txid', [models.sequelize.fn('COUNT', '*'), 'total']],
    order: [['total', 'desc']]
  })

  for (let record of records) {

    record = record.toJSON()

    const total = parseInt(record.total)

    if (total > 1) {

      console.log('txid', record.txid)

      let contents = await models.Content.findAll({
        where: { txid: record.txid },
        order: [['id', 'asc']]
      })

      console.log('total', contents.length)

      let toRemove = contents.slice(1)

      console.log('total to remove', toRemove.length)

      let result = await models.Content.destroy({
        where: {
          id: toRemove.map(duplicate => duplicate.id)
        }
      })

      console.log(result)

    }

  }
  

}

main()
