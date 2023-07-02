// src/mocks/handlers.js
import { rest } from "msw";

export const handlers = [
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e/hex",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text(
          "0100000002c65ca8878b5b3bdca3b20af0f08340add501bd6e8819b1e43d9fdc7134946c58030000006b483045022100ce9d8b38f7c501fc627828c6b5187fd781e6b43f6201138e5b1f338ef9ef5bc60220713ff859bae2ec82b08aa8581b7baa12a80b4bc0110ae460a3d704233aa41b0641210270b44f5d3caa386b4379b8918e62c4274c12ff65790d0f87b153eed9227d7905ffffffffe47fb44c2017e1d45ba935292d5d5c7bdffaa5f91900e41cd8e1a8fb31c0c884010000006a473044022066d758b410d85f2ae88c102d216d21cc5c17d6add257f040d6e27f180dc8ff3b022007c1a8a81d144fb4403f8b0d4803f00628aeca7a119cdd5b1e34782375575d53412102dce5271a8e68dedbf42e4d41a5a291c8174985b6c6e5d7fd1e1ecdf617a9d6f5ffffffff03d007000000000000e108626f6f7374706f7775044200000020c5ce5f360d436208cd622f42275c1283edc7dc84b478129014e26bcd33cbb38c04ffff001d1467736f240000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac2d180000000000001976a91452afc3f5deafafe8afeddc8bf7f4c704373416fb88acc5180000000000001976a9147a0634e323a6332f06afd0f00a7c22554f7aead688ac00000000"
        )
      );
    }
  ),
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/d1d26fa621f87dfc82ed1d8aa765b35172d04b32297025e5fa4df8044a829f92/hex",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text(
          "020000000124384e1cc69eaca7a21ecb049c040abab484c269646c187d2055ae5513c83e1000000000974730440220529f08b9f7041cab863b956e59b644494b1e81728bb475e93b7696b672e6ace502202d0435e7b17aee4f87535e31e372b11d4d57b020500e0d5a55897a585cef6f49412102f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906e047b79000004539cd06208cb76e7d19efb9cbd04a136e8a514e8ee1688b47895f0e485ea0167c4eada12f6c579ffffffff019a260000000000001976a914e8ee1688b47895f0e485ea0167c4eada12f6c57988ac00000000"
        )
        //ctx.text('0100000002c65ca8878b5b3bdca3b20af0f08340add501bd6e8819b1e43d9fdc7134946c58030000006b483045022100ce9d8b38f7c501fc627828c6b5187fd781e6b43f6201138e5b1f338ef9ef5bc60220713ff859bae2ec82b08aa8581b7baa12a80b4bc0110ae460a3d704233aa41b0641210270b44f5d3caa386b4379b8918e62c4274c12ff65790d0f87b153eed9227d7905ffffffffe47fb44c2017e1d45ba935292d5d5c7bdffaa5f91900e41cd8e1a8fb31c0c884010000006a473044022066d758b410d85f2ae88c102d216d21cc5c17d6add257f040d6e27f180dc8ff3b022007c1a8a81d144fb4403f8b0d4803f00628aeca7a119cdd5b1e34782375575d53412102dce5271a8e68dedbf42e4d41a5a291c8174985b6c6e5d7fd1e1ecdf617a9d6f5ffffffff03d007000000000000e108626f6f7374706f7775044200000020c5ce5f360d436208cd622f42275c1283edc7dc84b478129014e26bcd33cbb38c04ffff001d1467736f240000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac2d180000000000001976a91452afc3f5deafafe8afeddc8bf7f4c704373416fb88acc5180000000000001976a9147a0634e323a6332f06afd0f00a7c22554f7aead688ac00000000')
      );
    }
  ),
  //https://api.whatsonchain.com/v1/bsv/main/tx/b740679666126027ca342d1fa180e22a5487b55932b05eb5c921214729169862/hex
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/b740679666126027ca342d1fa180e22a5487b55932b05eb5c921214729169862/hex",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text(
          "0200000001569f69727234ca691e9f929e96f860f7fe172cf255eff179918b3fd27417d5d70000000097473044022018ea57cccfef8d88e19bb25267beca9f09937c3bc3f7fcfcb41ccb9beeebcbff02204a9f95a5578b8c92860c6e2d3f1c3dc11de9e8e728a16bdf12fffc5230f4d033412102f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906e0475fa040004c7b4d06208ee78dff5c41a41a3048610ecc514e8ee1688b47895f0e485ea0167c4eada12f6c579ffffffff019a260000000000001976a914e8ee1688b47895f0e485ea0167c4eada12f6c57988ac00000000"
        )
      );
    }
  ),
  //
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/103ec81355ae55207d186c6469c284b4ba0a049c04cb1ea2a7ac9ec61c4e3824/hex",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text(
          "0100000001681f8ae7f18c590657a0631a60839ace28c234ca2367612c9e428d7f52051055010000006b48304502210087f8023351879978cec71e1544ddedbd2853ac3d88f51991850fbdaa67610ce702207900a443dc089b3bb33ab75ba260269fd0d406b27749d46abe99bef1be8b4aef412102f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906effffffff031027000000000000ad08626f6f7374706f7775040000000020eac688537c65efefdec27bda82a0e693e4a0bfa7b79dcf8e0eb45afa775db650049e86011f0004bb48d8e5007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac00000000000000003d006a076f6e636861696e223138705051696775376a3639696f4463554739644143453169414e396e43666f7772036a6f620b7b22696e646578223a307d7ab60c00000000001976a914e8ee1688b47895f0e485ea0167c4eada12f6c57988ac00000000"
        )
      );
    }
  ),
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/hash/103ec81355ae55207d186c6469c284b4ba0a049c04cb1ea2a7ac9ec61c4e3824",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          txid: "103ec81355ae55207d186c6469c284b4ba0a049c04cb1ea2a7ac9ec61c4e3824",
          hash: "103ec81355ae55207d186c6469c284b4ba0a049c04cb1ea2a7ac9ec61c4e3824",
          version: 1,
          size: 444,
          locktime: 0,
          vin: [
            {
              coinbase: "",
              txid: "551005527f8d429e2c616723ca34c228ce9a83601a63a05706598cf1e78a1f68",
              vout: 1,
              scriptSig: {
                asm: "304502210087f8023351879978cec71e1544ddedbd2853ac3d88f51991850fbdaa67610ce702207900a443dc089b3bb33ab75ba260269fd0d406b27749d46abe99bef1be8b4aef[ALL|FORKID] 02f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906e",
                hex: "48304502210087f8023351879978cec71e1544ddedbd2853ac3d88f51991850fbdaa67610ce702207900a443dc089b3bb33ab75ba260269fd0d406b27749d46abe99bef1be8b4aef412102f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906e",
              },
              sequence: 4294967295,
            },
          ],
          vout: [
            {
              value: 0.0001,
              n: 0,
              scriptPubKey: {
                asm: "626f6f7374706f77 OP_DROP 0 eac688537c65efefdec27bda82a0e693e4a0bfa7b79dcf8e0eb45afa775db650 520193694 0 -1708673211 0 OP_CAT OP_SWAP 5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT 2 OP_PICK OP_TOALTSTACK 5 OP_ROLL OP_SIZE 4 OP_EQUALVERIFY OP_CAT 5 OP_ROLL OP_SIZE 8 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE 4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE 4 OP_EQUALVERIFY OP_CAT OP_HASH256 0 OP_CAT OP_BIN2NUM OP_FROMALTSTACK OP_SIZE 4 OP_EQUALVERIFY 3 OP_SPLIT OP_DUP OP_BIN2NUM 3 33 OP_WITHIN OP_VERIFY OP_TOALTSTACK OP_DUP OP_BIN2NUM 0 OP_GREATERTHAN OP_VERIFY 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK 3 OP_SUB 8 OP_MUL OP_RSHIFT 0 OP_CAT OP_BIN2NUM OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH160 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG",
                hex: "08626f6f7374706f7775040000000020eac688537c65efefdec27bda82a0e693e4a0bfa7b79dcf8e0eb45afa775db650049e86011f0004bb48d8e5007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac",
                type: "nonstandard",
                tag: {
                  type: "nonstandard",
                  action: "",
                },
                isTruncated: false,
              },
            },
            {
              value: 0,
              n: 1,
              scriptPubKey: {
                asm: "0 OP_RETURN 6f6e636861696e 3138705051696775376a3639696f4463554739644143453169414e396e43666f7772 6451050 7b22696e646578223a307d",
                hex: "006a076f6e636861696e223138705051696775376a3639696f4463554739644143453169414e396e43666f7772036a6f620b7b22696e646578223a307d",
                type: "nulldata",
                opReturn: {
                  type: "OP_RETURN",
                  action: "",
                  text: "",
                  parts: [
                    "onchain",
                    "18pPQigu7j69ioDcUG9dACE1iAN9nCfowr",
                    "job",
                    '{"index":0}',
                  ],
                },
                isTruncated: false,
              },
            },
            {
              value: 0.00833146,
              n: 2,
              scriptPubKey: {
                asm: "OP_DUP OP_HASH160 e8ee1688b47895f0e485ea0167c4eada12f6c579 OP_EQUALVERIFY OP_CHECKSIG",
                hex: "76a914e8ee1688b47895f0e485ea0167c4eada12f6c57988ac",
                reqSigs: 1,
                type: "pubkeyhash",
                addresses: ["1NEcz9jQwdTi19qup2tKkeYjYd4HGZGb4W"],
                isTruncated: false,
              },
            },
          ],
          blockhash:
            "00000000000000000aa8c2b13e8edfbafba492998da3eee2f77e3d7e9f852dbf",
          confirmations: 50681,
          time: 1657839067,
          blocktime: 1657839067,
          blockheight: 748259,
        })
      );
    }
  ),
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/hash/6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.json({
          txid: "6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e",
          hash: "6468fccbee68f5a3ddf92a5ad0f3d540c87edcbdc0206c4d7cb3799c2bd91b2e",
          version: 1,
          size: 607,
          locktime: 0,
          vin: [
            {
              coinbase: "",
              txid: "586c943471dc9f3de4b119886ebd01d5ad4083f0f00ab2a3dc3b5b8b87a85cc6",
              vout: 3,
              scriptSig: {
                asm: "3045022100ce9d8b38f7c501fc627828c6b5187fd781e6b43f6201138e5b1f338ef9ef5bc60220713ff859bae2ec82b08aa8581b7baa12a80b4bc0110ae460a3d704233aa41b06[ALL|FORKID] 0270b44f5d3caa386b4379b8918e62c4274c12ff65790d0f87b153eed9227d7905",
                hex: "483045022100ce9d8b38f7c501fc627828c6b5187fd781e6b43f6201138e5b1f338ef9ef5bc60220713ff859bae2ec82b08aa8581b7baa12a80b4bc0110ae460a3d704233aa41b0641210270b44f5d3caa386b4379b8918e62c4274c12ff65790d0f87b153eed9227d7905",
              },
              sequence: 4294967295,
            },
            {
              coinbase: "",
              txid: "84c8c031fba8e1d81ce40019f9a5fadf7b5c5d2d2935a95bd4e117204cb47fe4",
              vout: 1,
              scriptSig: {
                asm: "3044022066d758b410d85f2ae88c102d216d21cc5c17d6add257f040d6e27f180dc8ff3b022007c1a8a81d144fb4403f8b0d4803f00628aeca7a119cdd5b1e34782375575d53[ALL|FORKID] 02dce5271a8e68dedbf42e4d41a5a291c8174985b6c6e5d7fd1e1ecdf617a9d6f5",
                hex: "473044022066d758b410d85f2ae88c102d216d21cc5c17d6add257f040d6e27f180dc8ff3b022007c1a8a81d144fb4403f8b0d4803f00628aeca7a119cdd5b1e34782375575d53412102dce5271a8e68dedbf42e4d41a5a291c8174985b6c6e5d7fd1e1ecdf617a9d6f5",
              },
              sequence: 4294967295,
            },
          ],
          vout: [
            {
              value: 0.00002,
              n: 0,
              scriptPubKey: {
                asm: "626f6f7374706f77 OP_DROP 66 c5ce5f360d436208cd622f42275c1283edc7dc84b478129014e26bcd33cbb38c 486604799 67736f2400000000000000000000000000000000 0 0000000000000000000000000000000000000000000000000000000000000000 OP_CAT OP_SWAP 5 OP_ROLL OP_DUP OP_TOALTSTACK OP_CAT 2 OP_PICK OP_TOALTSTACK 5 OP_ROLL OP_SIZE 4 OP_EQUALVERIFY OP_CAT 5 OP_ROLL OP_SIZE 8 OP_EQUALVERIFY OP_CAT OP_SWAP OP_CAT OP_HASH256 OP_SWAP OP_TOALTSTACK OP_CAT OP_CAT OP_SWAP OP_SIZE 4 OP_EQUALVERIFY OP_CAT OP_FROMALTSTACK OP_CAT OP_SWAP OP_SIZE 4 OP_EQUALVERIFY OP_CAT OP_HASH256 0 OP_CAT OP_BIN2NUM OP_FROMALTSTACK OP_SIZE 4 OP_EQUALVERIFY 3 OP_SPLIT OP_DUP OP_BIN2NUM 3 33 OP_WITHIN OP_VERIFY OP_TOALTSTACK OP_DUP OP_BIN2NUM 0 OP_GREATERTHAN OP_VERIFY 0000000000000000000000000000000000000000000000000000000000 OP_CAT OP_FROMALTSTACK 3 OP_SUB 8 OP_MUL OP_RSHIFT 0 OP_CAT OP_BIN2NUM OP_LESSTHAN OP_VERIFY OP_DUP OP_HASH160 OP_FROMALTSTACK OP_EQUALVERIFY OP_CHECKSIG",
                hex: "08626f6f7374706f7775044200000020c5ce5f360d436208cd622f42275c1283edc7dc84b478129014e26bcd33cbb38c04ffff001d1467736f240000000000000000000000000000000004000000002000000000000000000000000000000000000000000000000000000000000000007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac",
                type: "nonstandard",
                tag: {
                  type: "nonstandard",
                  action: "",
                },
                isTruncated: false,
              },
            },
            {
              value: 0.00006189,
              n: 1,
              scriptPubKey: {
                asm: "OP_DUP OP_HASH160 52afc3f5deafafe8afeddc8bf7f4c704373416fb OP_EQUALVERIFY OP_CHECKSIG",
                hex: "76a91452afc3f5deafafe8afeddc8bf7f4c704373416fb88ac",
                reqSigs: 1,
                type: "pubkeyhash",
                addresses: ["18YCy8VDYcXGnekHC4g3vphnJveTskhCLf"],
                isTruncated: false,
              },
            },
            {
              value: 0.00006341,
              n: 2,
              scriptPubKey: {
                asm: "OP_DUP OP_HASH160 7a0634e323a6332f06afd0f00a7c22554f7aead6 OP_EQUALVERIFY OP_CHECKSIG",
                hex: "76a9147a0634e323a6332f06afd0f00a7c22554f7aead688ac",
                reqSigs: 1,
                type: "pubkeyhash",
                addresses: ["1C8CseQ8CM9gZDPQ8ufvWA7BxKgWqBPmRr"],
                isTruncated: false,
              },
            },
          ],
          blockhash:
            "0000000000000000040875de76374884f7333b5e3951a90522d65db3ae5c3754",
          confirmations: 143365,
          time: 1601931851,
          blocktime: 1601931851,
          blockheight: 655575,
        })
      );
    }
  ),
  rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/45f1ec3bab92324d9703ff165a0b9b42b38e55122c52a06037267f015844c5d4/hex",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text(
          "0200000001569f69727234ca691e9f929e96f860f7fe172cf255eff179918b3fd27417d5d70000000097473044022018ea57cccfef8d88e19bb25267beca9f09937c3bc3f7fcfcb41ccb9beeebcbff02204a9f95a5578b8c92860c6e2d3f1c3dc11de9e8e728a16bdf12fffc5230f4d033412102f70cba8dfa2f23705c012c50a520ac0ac0fe61d2aec04a8c0b804f613348906e0475fa040004c7b4d06208ee78dff5c41a41a3048610ecc514e8ee1688b47895f0e485ea0167c4eada12f6c579ffffffff019a260000000000001976a914e8ee1688b47895f0e485ea0167c4eada12f6c57988ac00000000"
        )
      );
    }
  ),
];
