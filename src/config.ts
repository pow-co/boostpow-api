
const nconf = require('nconf')

const os = require('os')

nconf.argv({
  parseValues: true,
  transform
})

nconf.env({
  parseValues: true,
  transform
})

const global_file = `/etc/rabbi/rabbi.json`

const user_file = `${os.homedir()}/.rabbi/rabbi.json`

const project_file = `${process.cwd()}/.rabbi/rabbi.json`

nconf.add('project_file', { type: 'file', file: project_file, transform })

nconf.add('user_file', { type: 'file', file: user_file, transform })

nconf.add('global_file', { type: 'file', file: global_file, transform })

export function loadFromFiles() {

  nconf.use('project_file', { type: 'file', file: project_file, transform })

  nconf.use('user_file', { type: 'file', file: user_file, transform })

  nconf.use('global_file', { type: 'file', file: global_file, transform })

}

loadFromFiles()

nconf.defaults({
  host: '0.0.0.0',
  port: '5200',
  prometheus_enabled: true,
  http_api_enabled: true,
  swagger_enabled: true,
  postgres_enabled: true,
  amqp_enabled: false,
  api_base: 'https://pow.co',
  notify_slack: false,
  node_env: 'development',
  bsv_per_difficulty: 0.1,
  bsv_spv_enabled: false,
  cache_refresh_cron_enabled: false,
  cache_refresh_cron_pattern: '* * * * *'
})

export default nconf

function transform(obj) {
  return {
    key: obj.key.toLowerCase(),
    value: obj.value
  }
}

