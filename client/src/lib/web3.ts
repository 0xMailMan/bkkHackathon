import Web3 from "web3";
import { AbiItem } from "web3-utils";
import { env } from "./env";

const GNOSIS_RPC = "https://rpc.gnosischain.com";
const NFT_CONTRACT_ADDRESS = env.NFT_CONTRACT_ADDRESS;
const NFT_CONTRACT_ABI: AbiItem[] = [
  {
    inputs: [
      { name: "streamId", type: "uint256" },
      { name: "participantId", type: "uint256" }
    ],
    name: "mintParticipationNFT",
    outputs: [{ name: "tokenId", type: "uint256" }],
    stateMutability: "nonpayable",
    type: "function"
  }
];

let web3: Web3;
let contract: any;

export async function initWeb3() {
  if (typeof window.ethereum !== "undefined") {
    web3 = new Web3(window.ethereum);
    await window.ethereum.request({ method: "eth_requestAccounts" });
  } else {
    web3 = new Web3(new Web3.providers.HttpProvider(GNOSIS_RPC));
  }
  
  contract = new web3.eth.Contract(NFT_CONTRACT_ABI, NFT_CONTRACT_ADDRESS);
}

export async function mintNFT(streamId: number, participantId: number) {
  if (!web3 || !contract) {
    await initWeb3();
  }

  if (!NFT_CONTRACT_ADDRESS) {
    throw new Error("NFT contract address not configured");
  }

  const accounts = await web3.eth.getAccounts();
  if (!accounts[0]) {
    throw new Error("No wallet connected");
  }

  const tx = await contract.methods
    .mintParticipationNFT(streamId, participantId)
    .send({ from: accounts[0] });

  return tx;
}

export async function getWalletAddress(): Promise<string | null> {
  if (!web3) {
    await initWeb3();
  }

  const accounts = await web3.eth.getAccounts();
  return accounts[0] || null;
}
