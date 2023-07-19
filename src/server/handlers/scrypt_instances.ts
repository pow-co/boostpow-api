
import * as bsv from 'bsv'

import models from '../../models'

import { Op } from 'sequelize'

import { badRequest } from 'boom'

import { findOrImportInstanceAtLocation }from '../../scrypt'

export async function show(req, h) {

  try {

    const { location } = req.params

    let instance = await findOrImportInstanceAtLocation({ location })

    return { instance }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function unlock(req, h) {

  try {

    const { location } = req.params
    // TODO: Implement

    return { location }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

export async function index(req, h) {

  try {

    const { location } = req.params

    let instance = await findOrImportInstanceAtLocation({ location })

    return { instance }

  } catch(error) {

    console.error(error)

    return badRequest(error)

  }

}

