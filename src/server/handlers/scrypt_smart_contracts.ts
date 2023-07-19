
import { badRequest } from 'boom'

export async function index(req, h) {

  try {

    return {}

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}


export async function show(req, h) {

  try {

    return {}

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

