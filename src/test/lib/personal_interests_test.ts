
require('dotenv').config()

import { expect } from 'chai'
import { removeInterest, findOrImportPersonalInterests,  } from '../../personal_interests'

describe('Personal Interests', () => {

  it.skip('should record the state of a newly-minted personal interest', async () => {

  })

  it.skip('#removeInterest should update the location of the interest', async () => {

    let interest;

    const removal_location = ''

    interest = await removeInterest({ current_location: interest.location })

    expect(interest.location).to.be.equal(removal_location)

    expect(interest.active).to.be.equal(true)

  })

  it.skip('#findOrImportPersonalInterests should save the records of interests from a txid', async () => {


  })

  it.skip('#findOrImportPersonalInterests should save multiple interests given a single txid', async () => {

  })

})

