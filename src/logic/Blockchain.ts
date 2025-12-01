import { Block } from "./Block";
import { Transaction } from "./Transaction";

export class Blockchain {
  public chain: Block[];
  public difficulty: number;
  public pendingTransactions: Transaction[];
  public miningReward: number;

  constructor() {
    this.chain = []; // We will initialize Genesis block explicitly later if needed, or in the constructor
    this.difficulty = 2; // Keep it low for the simulation so it's fast
    this.pendingTransactions = [];
    this.miningReward = 10;
    
    // Create Genesis block immediately
    this.createGenesisBlock();
  }

  // The first block cannot point to a previous one, so we manually create it
  private async createGenesisBlock() {
    const genesisBlock = new Block(Date.now(), [], "0");
    await genesisBlock.mineBlock(this.difficulty);
    this.chain.push(genesisBlock);
  }

  getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  // Add a new transaction to the mempool
  createTransaction(transaction: Transaction) {
    this.pendingTransactions.push(transaction);
  }

  // Mine the pending transactions and add block to chain
  async minePendingTransactions(minerAddress: string) {
    // 1. Create the reward transaction for the miner
    const rewardTx = new Transaction(null, minerAddress, this.miningReward);
    this.pendingTransactions.push(rewardTx);

    // 2. Create the block
    const block = new Block(
      Date.now(),
      this.pendingTransactions,
      this.getLatestBlock().hash
    );

    // 3. Mine it (Spend energy/time)
    await block.mineBlock(this.difficulty);

    // 4. Add to chain
    console.log("Block successfully mined!");
    this.chain.push(block);

    // 5. Reset mempool
    this.pendingTransactions = [];
  }

  // Verification: Did someone tamper with the chain?
  async isChainValid(): Promise<boolean> {
    for (let i = 1; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      const previousBlock = this.chain[i - 1];

      // Check 1: Has the data inside the block changed? (Hash mismatch)
      if (currentBlock.hash !== (await currentBlock.calculateHash())) {
        return false;
      }

      // Check 2: is the link broken? (Previous hash doesn't match)
      if (currentBlock.previousHash !== previousBlock.hash) {
        return false;
      }
    }
    return true;
  }
}