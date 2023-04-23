
import models from '../models'

export async function ingestBmapTransaction({ bob, bmap }: {bob: any, bmap: any}): Promise<any> {

  //@ts-ignore
  return models.BmapTransaction.findOrCreate({
    where: {
      txid: bmap.tx.h
    },
    defaults: {
      txid: bmap.tx.h,
      bmap,
      bob 
    }
  })

}

