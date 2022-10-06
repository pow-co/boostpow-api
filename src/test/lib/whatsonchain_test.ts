import { getTransaction } from '../../whatsonchain'
import { expect } from '../utils'

describe("Whatsonchain API", () => {

    it("#getTransaction should return tx hex given a txid", async () => {

        const result = await getTransaction('8db59c48e77614e7db5c73a95b0705f312dd88aa2c2f83d71bffd931926d29e9')

        console.log(result)

        expect(result)

    })
})