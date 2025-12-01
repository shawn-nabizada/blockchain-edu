import { type ITransaction } from "../types";

export class Transaction implements ITransaction {
  id: string;
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  timestamp: number;

  constructor(fromAddress: string | null, toAddress: string, amount: number) {
    this.id = crypto.randomUUID(); // Generates a unique ID
    this.fromAddress = fromAddress;
    this.toAddress = toAddress;
    this.amount = amount;
    this.timestamp = Date.now();
  }
}