
require('dotenv').config()

const models = require('./models').default

console.log(models.BoostJob)

export const json = JSON.parse(`{ "event":"api.jobs.report",
  "timestmap":"2022-12-07T16:29:12.517571",
  "message": 
  { "jobs_returned_by_API":25,
    "jobs_already_redeemed":23,
    "jobs_not_already_redeemed":2,
    "jobs_with_multiple_outputs":0,
    "redemptions": [
      { "inpoint":"0x513c8fe186c474ee36324c6261f2b00609f305b94f29fb7542e0af414d042a65:0",
        "outpoint":"0x0a2e4cc1d51c0acc889f94f07dc772aea2297892d37476212ebab5d3e6db3ab3:0",
        "script_hash":"0x19f28bce6a9eccc35dc1aebfab16972481fedb6f8405edd5b624d94a228803b4"},
      { "inpoint":"0x7700535d26875efe1cbef138742a3fb8ae5565f665410b135203b5fd8f9001fb:0",
        "outpoint":"0xba738d90c74509d8704b4ba87ad5b8123e3a258c1a409a64099eae14d901ab83:0",
        "script_hash":"0x7c73aff76ab2264c8134bbf711f901f0955cfd94518789f12bbb9c4315933dc5"},
      { "inpoint":"0xef8aa83e4f6da24a7c8d33ee30d65a383b0a2e02551e0bf85410646b92759dc1:0",
        "outpoint":"0xbe86187d21beabb4e6194ac20cb30e3895fd2403275482ca93427638d2221692:0",
        "script_hash":"0x8ef52db1afe04fdcb4fcc92f7217758b0cffe61c33fb65524a5b2c5c7bf1c643"},
      { "inpoint":"0x1d9513b18baa02b3971e2665c90a5e0fb6badea860c665d7b6c08637472d39d6:0",
        "outpoint":"0x4fe03cb9853d744a4233e9838f8a57fb7ecd2111464a37a04b1331d555cb4288:0",
        "script_hash":"0x9cf9b550203db28107b8a929cda81893a70c631d383c4f7d9083ca7685d23220"},
      { "inpoint":"0xef8aa83e4f6da24a7c8d33ee30d65a383b0a2e02551e0bf85410646b92759dc1:0",
        "outpoint":"0x76576eebe8f12cad78775dd4c277495953419da66a4700aa41e6b9aa8df05fb7:0",
        "script_hash":"0x8ef52db1afe04fdcb4fcc92f7217758b0cffe61c33fb65524a5b2c5c7bf1c643"},
      { "inpoint":"0xef8aa83e4f6da24a7c8d33ee30d65a383b0a2e02551e0bf85410646b92759dc1:0",
        "outpoint":"0x9704af597834b2d2a2ddd70437a3e3cdc45eb4bd13542af571d174437c341322:0",
        "script_hash":"0x8ef52db1afe04fdcb4fcc92f7217758b0cffe61c33fb65524a5b2c5c7bf1c643"},
      { "inpoint":"0x269207c5893dd3caf96e787b6aaf84e9b0cb89dce8dd9dc6907a03f6f136fccf:0",
        "outpoint":"0xbf15f49fe3cb650d3d020a31412592ad21400a4be48eef62dc7b034553a7dfdf:0",
        "script_hash":"0xc1a81dad58b6fb5499f4139f3872f1a36f597c6d4cd24ee539116363887d368b"},
      { "inpoint":"0x02e2260bda14c2a1147c22c22a71cf9f8ca4ecc51f74bf31b88e1fa0cdda8a7a:0",
        "outpoint":"0x4d46fa72f6049264169c2972aea67c3b354c87cebbc9a18b8cbfc16077d37720:0",
        "script_hash":"0x7d6e75f8300f819b9fec271fbd467ad5c47155aa8936a32b8dde437a89330b49"},
      { "inpoint":"0xe4f10c08aa21283e8f8de5e0c99abdbea93ef3d80547531105c9f43fac77a276:0",
        "outpoint":"0x7c6dbb6396d9de73cc9748b9dbb26dfed7e81b1a4a0dfd31ed37967ef858303d:0",
        "script_hash":"0xe397e5fd646231f1a3f1d13f3e80535bd9403aebab79f8de8e4b5c68d59dd0c6"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0xf20ac41ff0bbdaa5d27a09bfccba2835b17a22e7a0ea8cc3830acd65cd9bfcc0:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0x5a28b5c26cf19ec8484f99edc9d3772759a4dc3996d0646738ddd74d6f43b457:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0x1233e8d09e0843e27315f3c0035fc29e741dfc751973806d935011e75bee0346:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0x7dc0592fef135b0c17b796f061335dfa331d86b7db1230ba45beb8a0283f1aa1:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0xa93ef31d156d0f9d245d4438b0c67d2052ac5ab9cfe23e5d76d0bad369dc72da:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0x556b4a817d4508c41f7ba0574d7769ccb14faa036448b86e141f6ab7f4691cc5:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0xa336623bd55985c5ff8728a8ae9ed37df86a974f5c4278f34943252917f89d12:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0xcb5c5e9deb9a007e104fa46ce71641b3316269cd7f8720f58afcab823fcc460d:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0x64e529415b26b77211018708686277d7acb44585d3263b9ed29821366be42ac9:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0x32ed1416d45a28323ebbcdd692be230b67aa6f0489b0433df5b52ab51d57b83a:0",
        "outpoint":"0xef5aa8fd32fe2b253017e6709ad0e801dbc291f6ec70c520e041d04478c13c6c:0",
        "script_hash":"0xcf068af76fe0dd7a840b87b54da3fb1361130ed209bb9fb69b65fa76a4cb9d7c"},
      { "inpoint":"0xc018b2c44e602a64248cc688c4d421e572b330d27361e2c2280420a5bcce913c:0",
        "outpoint":"0x2a013423332f010ad37a47c186f4ff57dc917dcc519b499d442253f6801bd065:1",
        "script_hash":"0x3c7b039ee607b5b0b3591f44d928ee4889efe4d7c2d6a5a463e9d177b42ae7e0"},
      { "inpoint":"0x0b53e54161c41729b5c4b786f2971b597735bed61a3f2f046d1337dd2c5f9e3d:0",
        "outpoint":"0xf5819bed13d1b5a3998beadf5f9f5a5c4ca4ce179c8baac88e6774d32a3e3586:0",
        "script_hash":"0x2e9a34e56d00c1896f5a3115656b6c8ea8d0877aeb4103309a84ae0ad041674c"},
      { "inpoint":"0x0b53e54161c41729b5c4b786f2971b597735bed61a3f2f046d1337dd2c5f9e3d:0",
        "outpoint":"0xb31aa4cbc8847df1e92b46ecf85399a236ab808f085e029256e1f0dd094db27f:0",
        "script_hash":"0x2e9a34e56d00c1896f5a3115656b6c8ea8d0877aeb4103309a84ae0ad041674c"}],
    "valid_jobs":
      { "0x377ef6d2f7e5ee4d2e23fb956707702455bb1387cca3bbacbbe752578800b248":
        { "difficulty":150.0005364519071,
          "prevouts": [
            { "output":"0xef8c671fa2c0464c9ce77d38c3bdd601a8a48c2af477bc0c6a5556e133c5c44f:1",
              "value":10000000}],
          "profitability":66666.42824444953,
          "script":"bitcoin-script:010108626f6f7374706f77750400000000206cfc7ea14ac497f405354f0f6218f22fd04fd324343d7ce8e3d36937f2789cd404e6b4011c066865616c7468048b276090007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88acfa16e0ab","value":10000000},
        "0xbd0a042595ade9c9238611b7c91148d7e88319426d0aa97693e88cf597b42e5d":
        { "difficulty":288.4076257929209,
          "prevouts": [
            { "output":"0x0da4298dbbb28b00ae05b2f1f28ee17014747a052cb395306ff4d3b6f714044a:2",
              "value":901592}],
          "profitability":3126.103193427176,
          "script":"bitcoin-script:010108626f6f7374706f7775040000000020576306008df4fe610189a09a0fbd71a8a9fd857b765d347bd52fe58189381eb6043be3001c14534541420000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88acf6c28c9a","value":901592}}}}`)

async function main() {


  for (let redemption of json.message.redemptions) {

    console.log(redemption)

    const job = await models.BoostJob.findOne({
      where: {
        txid: redemption.output.split(':')[1].substring(2)
      }
    })

    console.log(job.toJSON())

  }

}

main()
