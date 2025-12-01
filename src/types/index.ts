export interface ITransaction {
  id: string;
  fromAddress: string | null;
  toAddress: string;
  amount: number;
  timestamp: number;
  signature?: string;
}

export interface IBlock {
  timestamp: number;
  transactions: ITransaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  miner: string;
}

export interface IQuestion {
  text: string;
  options: string[];
  correctIndex?: number;
  explanation: string;
}

export interface ISlide {
  id: string;
  title: string;
  content: React.ReactNode;
  question?: IQuestion;
}