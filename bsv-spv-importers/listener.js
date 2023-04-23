const { Listener } = require("bsv-spv");

const name = "test-plugin";
const ticker = "BSV";
const blockHeight = -10; // Number. If negative then it's number from the tip.
const dataDir = __dirname;
const port = 8080; // Same as Masters port above
const listener = new Listener({ name, ticker, blockHeight, dataDir });

const onBlock = ({
  header,
  started,
  finished,
  size,
  height,
  txCount,
  transactions,
  startDate,
}) => {
  for (const [index, tx, pos, len] of transactions) {
    console.log(`#${index} tx ${tx.getTxid()} in block ${height}`);
  }
};

listener.on("mempool_tx", ({ transaction, size }) => {
  console.log(
    `new mempool tx ${transaction.getTxid()} ${size.toLocaleString(
      "en-US"
    )} bytes.`
  );
});
listener.on("block_reorg", ({ height, hash }) => {
  // Re-org after height
});
listener.on("block_saved", ({ height, hash }) => {
  listener.syncBlocks(onBlock);
});

listener.syncBlocks(onBlock);
listener.connect({ port });
