'use strict';

module.exports = {

  up: async (queryInterface, Sequelize) => {

    await queryInterface.addIndex('boost_job_proofs', {
      fields: ['content']
    }, {
      indexName: 'proofs_by_content'
    })

    await queryInterface.addIndex('boost_job_proofs', {
      fields: ['tag']
    }, {
      indexName: 'proofs_by_tag'
    })
    
  },

  down: async (queryInterface, Sequelize) => {

    await queryInterface.removeIndex('boost_job_proofs', 'content', {
      indexName: 'proofs_by_content'
    })

    await queryInterface.removeIndex('boost_job_proofs', 'tag', {
      indexName: 'proofs_by_tag'
    })

  }

};
