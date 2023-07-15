import { rest } from "msw";

export const handlers = [
     rest.get(
    "https://api.whatsonchain.com/v1/bsv/main/tx/c3040ff89cf83aeab9fa8628fd2cedd460df98ba6557ef6fa24263d6eab2378d/hex",
    (req, res, ctx) => {
      return res(
        ctx.status(200),
        ctx.text(
          "0100000002e743157d509236ef2db041bb6416e73e6520e723838cdbf70cd424a34964915e000000006a47304402205d73349f32dff826bc9304be0eb40f53d53a5897d789f5afc39d05be10dbdbb20220791838109f4d63ee0defa433d728e346e7b4edd3526fe500b21ff600281a6f69412103a97e0e500e30f03366e17d0e755425064dea87fbc9b21d0ed01b3991c2f8d31affffffffde0a2abe189a16094890d18765bf3141db96a20917f4dfabd2c09a908098a572010000006a47304402202a774071d85fbffde1dc4c5988e9a08fcd4f393eae1a404d7850771dba29205b02202eb029a55adf3733104884c7f76b8e3358fe8bb382d069fa2b0a0771e2fffe4e41210290ee75158bcbb35fa585485e276484101eace4af3ed690e481cf8788deec26a9ffffffff02a086010000000000ad08626f6f7374706f7775044200000020f43b8239984bf22910c7c848e333d445878ed6fef17cc1bda2657ce608b053de04f6ff091d00048ccfbf0d007e7c557a766b7e52796b557a8254887e557a8258887e7c7eaa7c6b7e7e7c8254887e6c7e7c8254887eaa01007e816c825488537f7681530121a5696b768100a0691d00000000000000000000000000000000000000000000000000000000007e6c539458959901007e819f6976a96c88ac38d7ef0b000000001976a9140e235503de092a5a9ecf0b6b6f4e1bdff5e8cbcf88ac00000000"
        )
      );
    }
  ),
];