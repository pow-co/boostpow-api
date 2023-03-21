
import { badRequest } from 'boom'

import { find, findOrCreate, ScriptShortcode } from '../../script_shortcodes'

export async function create(req, h) {

  try {

    const { payload: { script } } = req

    const shortcode: ScriptShortcode = await findOrCreate({

      script 

    })

    return shortcode

  } catch(error) {

    return badRequest(error)

  }

}

export async function show(req, h) {

  try {

    const { params: { uid } } = req

    const shortcode: ScriptShortcode = await find({

      uid 

    })

    return shortcode

  } catch(error) {

    return badRequest(error)

  }

}
