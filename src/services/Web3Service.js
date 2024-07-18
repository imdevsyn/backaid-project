import Web3 from "web3";
import ABI from "./ABI";

const CONTRACT_ADDRESS = "0x241d0217415C19D2da6Ad90964869dc407E86255";
const TESTNET_CHAIN_ID = "0x14a34";

async function ensureTestnet() {
  if (!window.ethereum) throw new Error("Please install MetaMask first!");

  const currentChainId = await window.ethereum.request({
    method: "eth_chainId",
  });
  if (currentChainId !== TESTNET_CHAIN_ID) {
    try {
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: TESTNET_CHAIN_ID }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        try {
          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: TESTNET_CHAIN_ID,
                chainName: "Base Sepolia Testnet",
                rpcUrls: ["https://sepolia.base.org"],
                nativeCurrency: {
                  name: "Base ETH",
                  symbol: "ETH",
                  decimals: 18,
                },
                blockExplorerUrls: ["https://sepolia.basescan.org"],
              },
            ],
          });
        } catch (addError) {
          throw new Error("Failed to add network. " + addError.message);
        }
      } else {
        throw new Error("Failed to switch network. " + switchError.message);
      }
    }
  }
}

export async function Connect() {
  const web3 = new Web3(window.ethereum);
  const accounts = await web3.eth.requestAccounts();

  if (!accounts || !accounts.length) {
    throw new Error("Wallet not allowed or not found!");
  }

  localStorage.setItem("wallet", accounts[0]);

  await ensureTestnet();

  return accounts[0];
}

function getContract() {
  const web3 = new Web3(window.ethereum);
  const from = localStorage.getItem("wallet");
  return new web3.eth.Contract(ABI, CONTRACT_ADDRESS, { from });
}

export function addCampaign(campaign) {
  const contract = getContract();
  return contract.methods
    .addCampaign(
      campaign.title,
      campaign.description,
      campaign.videoUrl,
      campaign.imageUrl,
      Web3.utils.toWei(campaign.target, "ether")
    )
    .send();
}

export function getLastCampaignId() {
  const contract = getContract();
  return contract.methods.nextId().call();
}

export function getCampaign(id) {
  const contract = getContract();
  return contract.methods.campaigns(id).call();
}

export async function getActiveCampaigns() {
  const contract = getContract();
  const campaigns = [];
  const totalCampaigns = await contract.methods.nextId().call();

  for (let id = 1; id <= totalCampaigns; id++) {
    const campaign = await contract.methods.campaigns(id).call();
    if (campaign.active) {
      campaigns.push({ ...campaign, id });
    }
  }
  return campaigns;
}

export function donate(id, donation) {
  const contract = getContract();
  return contract.methods
    .donate(id)
    .send({ value: Web3.utils.toWei(donation, "ether") });
}

export function withdraw(id) {
  const contract = getContract();
  return contract.methods.withdraw(id).send();
}
