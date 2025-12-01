import type { IBlock, ITransaction } from "../types";

// Helper: Real SHA-256 Hashing using Browser API
export async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest("SHA-256", msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hashHex;
}

// Standalone helper to calculate hash for ANY block object
export async function calculateBlockHash(block: IBlock): Promise<string> {
    const data =
      block.previousHash +
      block.timestamp +
      JSON.stringify(block.transactions) +
      block.nonce +
      (block.miner || "System");
    return await sha256(data);
}

export class Block implements IBlock {
  public timestamp: number;
  public transactions: ITransaction[];
  public previousHash: string;
  public hash: string;
  public nonce: number;
  public miner: string;

  constructor(timestamp: number, transactions: ITransaction[], previousHash = "", miner = "System") {
    this.timestamp = timestamp;
    this.transactions = transactions;
    this.previousHash = previousHash;
    this.hash = "";
    this.nonce = 0;
    this.miner = miner;
  }

  async calculateHash(): Promise<string> {
    return calculateBlockHash(this);
  }

  async mineBlock(difficulty: number): Promise<void> {
    const target = Array(difficulty + 1).join("0");
    while (true) {
      this.hash = await this.calculateHash();
      if (this.hash.substring(0, difficulty) === target) {
        break;
      }
      this.nonce++;
    }
  }
}