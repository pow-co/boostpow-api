
import { get_multi_day_feed } from  '../../feeds/multi_day_feed'
import { expect} from '../utils'
describe('Multi-Day Feed', () => {

  it.skip('should return five segments of data, one for each of the past five days', async () => {

    const days = await get_multi_day_feed({})

    expect(days.length).to.be.equal(5)
    //TODO: fix this test, the output of get_multi_day_feed does not contain ago
    // for (let day of days) {

    //   expect(day.ago).to.be.equal(1)

    //   expect(day.rankings.length).to.be.greaterThan(0)

    // }

  })

  describe('Top boosted Last 1 Day', () => {

  
    it('should include all content that was boosted in the past 24 hours', () => {

    })

  })

  describe('Top boosted Last 2 Days', () => {

    it('should include all content that was boosted in the past 48 hours, but not the past 24 hours', () => {

    })

  })

  describe('Top boosted Last 3 Days', () => {

    it('should include content boosted exclusively between 48 and 72 hours ago', () => {

    })

  })

  describe('Top boosted Last 4 Days', () => {

    it('should include content boosted between 4 and 5 days ago', () => {

    })

  })

  describe('Top boosted Last 5 Days', () => {

    it('should include content boosted between 4 and 6 days ago', () => {

    })

  })

})
