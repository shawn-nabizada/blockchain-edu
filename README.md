# 🔗 Blockchain Edu Simulator

An interactive, educational web application designed to demystify blockchain technology. This tool takes users from zero knowledge to a deep, practical understanding through interactive theory, a fully functional network sandbox, and critical thinking scenarios.

[Currently deployed on Vercel](https://blockchain-edu-git-main-shawn-nabizadas-projects.vercel.app/)

## ✨ Features

### 1. Interactive Theory Stage
* **Visual Learning:** Guided slides explaining Hashing, Proof of Work, and Distributed Trust.
* **Interactive Widgets:** Real-time SHA-256 hash calculators, Nonce mining mini-games, and gossip protocol visualizations.
* **Whiteboard Mode:** A persistent drawing canvas alongside slides for diagramming concepts.
* **Progressive Complexity:** Concepts are broken down into digestible steps.

### 2. "God Mode" Sandbox
* **Full Network Control:** Orchestrate a 4-node network (Alice, Bob, Clayton, Dave).
* **Live Mining:** Adjust mining difficulty and individual node speed to see how hashrate affects the network.
* **Propagation Visuals:** Watch blocks and transactions fly across the network in real-time.
* **Tamper & Hack:** Intentionally edit a block's history to break the hash chain and watch the network reject the invalid chain (The "Domino Effect").
* **Consensus Simulation:** Experience the "Longest Chain Rule" firsthand.

### 3. Critical Thinking Wrap-Up
* **Reality Checks:** Compare the simulation to real-world networks like Bitcoin and Ethereum.
* **CEO Simulator:** A text-based scenario testing your ability to choose between a Database and a Blockchain for business use cases.

## 🛠️ Tech Stack

* **Framework:** React 19 + TypeScript
* **Build Tool:** Vite
* **Styling:** Tailwind CSS
* **Animations:** Framer Motion
* **Icons:** Lucide React
* **State Management:** React Context API (Simulation Engine)

## 🚀 Getting Started

### Prerequisites
* Node.js (v18 or higher)
* npm or yarn

### Installation

1.  **Clone the repository**
    ```bash
    git clone [https://github.com/shawn-nabizada/blockchain-edu.git](https://github.com/shawn-nabizada/blockchain-edu.git)
    cd blockchain-edu
    ```

2.  **Install dependencies**
    ```bash
    npm install
    ```

3.  **Run the development server**
    ```bash
    npm run dev
    ```

4.  Open [http://localhost:5173](http://localhost:5173) in your browser.

## 🧪 How to use the Sandbox

1.  **Send Money:** Use the Sidebar control panel to broadcast transactions between nodes.
2.  **Mine a Block:** Click "Mine" on any node. Watch the block propagate to peers.
3.  **Break the Chain:** Click on a mined block, edit a transaction amount, and save. The block will turn RED.
4.  **Watch Rejection:** Try to mine on top of that red block. The network will reject your invalid history.

## 📄 License

This project is open source and available under the MIT License.
