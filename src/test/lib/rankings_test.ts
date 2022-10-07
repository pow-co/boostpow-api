
import * as rankings from '../../rankings'

import * as moment from 'moment'
import { expect } from '../utils';

describe('Rankings', () => {

    it('should return the top ranked content all time', async () => {

        const result = await rankings.rankContent();

        expect(result).to.be.an('array')
    })

    it('should return the top ranked content with a given tag all time', async () => {

        const result = await rankings.rankContent({ tag: 'baes' });

        expect(result).to.be.an('array')

    })

    it('should return the top tags all time', async () => {

    })


    it('should return the top ranked content with a given tag all time', async () => {

        const result = await rankings.rankTags();

        expect(result).to.be.an('array')

    })

    it('should return the top ranked content for a given time period', async () => {

        const start_date = moment().subtract(1, 'year').toDate()

        const end_date = moment().subtract(1, 'day').toDate()

        const result = await rankings.rankContent({
            start_date,
            end_date
        })

        expect(result).to.be.an('array')

    })

    it('should return the top ranked content with a given tag for a time period', async () => {

        const start_date = moment().subtract(1, 'year').toDate()

        const end_date = moment().subtract(1, 'day').toDate()

        const result = await rankings.rankContent({
            start_date,
            end_date,
            tag: 'askbitcoin'
        })

        expect(result).to.be.an('array')

    })

    it('should return the top tags for a time period', async () => {

        const start_date = moment().subtract(1, 'year').toDate()

        const end_date = moment().subtract(1, 'day').toDate()

        const result = await rankings.rankTags({
            start_date,
            end_date
        })

        expect(result).to.be.an('array')


    })


})