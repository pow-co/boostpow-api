
import { badRequest } from 'boom'

import { listMiners } from '../../miners'

export async function index( request , hapi ) {

    try {

        return listMiners(request.query)

    } catch(error) {

        return badRequest(error)

    }

}

export async function show ( request , hapi ) {

}