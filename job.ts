
import axios from 'axios'

import {BoostPowJob} from 'boostpow'

export async  function main() {

    const newJob = BoostPowJob.fromObject({
        content: process.argv[2],
        diff: 1,
        tag: Buffer.from(process.argv[3], 'utf8').toString('hex'),
        category: Buffer.from(process.argv[4] || '1234', 'utf8').toString('hex')
    })

    var { tag, category } = newJob.toObject()

    tag = Buffer.from(tag, 'hex').toString("utf8")

    category = Buffer.from(category, 'hex').toString("utf8")


    console.log('job from sdk', newJob.toObject())

    console.log({ tag, category })

    const content = process.argv[2]

    const { data } = await axios.post(`https://pow.co/api/v1/boost/scripts`, {
        tag,
        difficulty: 1,
        content,
        category
    })

    console.log(data)
    
    const job = BoostPowJob.fromHex(data.script.hex)

    const jobJson = job.toObject()

    console.log(Object.assign(jobJson, {
        tag: Buffer.from(jobJson.tag).toString('utf8'),
        category: Buffer.from(jobJson.category).toString('utf8')
    }))

    const { data: thirdWay } = await axios.get(`https://pow.co/api/v1/boostpow/${content}/new?difficulty=1&tag=${tag}&category=${category}`)

    const thirdJob = BoostPowJob.fromHex(data.script.hex)

    const thirdJobJson = job.toObject()

    console.log(Object.assign(thirdJobJson, {
        tag: Buffer.from(thirdJobJson.tag).toString('utf8'),
        category: Buffer.from(thirdJobJson.category).toString('utf8')
    }))

}

if (require.main === module) {

    main()

}
