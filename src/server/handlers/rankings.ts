
import { rankContent, rankTags } from '../../rankings'

export async function index(req, h) {

    const { start_date, end_date, tag } = req.params

    const rankings = await rankContent({
        start_date,
        end_date,
        tag
    })

    return { rankings }

}

export async function tags(req, h) {

    const { start_date, end_date } = req.params

    const rankings = await rankTags({
        start_date,
        end_date
    })

    return { rankings }
    
}
