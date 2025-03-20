import { useState, useEffect } from "react";
import * as XLSX from "xlsx";
import abi from "./contracts/kalpBridge.json";
import giniAbi from "./contracts/giniContract.json";
import { ethers } from "ethers";
import "./App.css";

function PolygonConnect() {
	const [account, setAccount] = useState(null);
	const [balance, setBalance] = useState(null);
	const [error, setError] = useState(null);
	const [claimableTokens, setClaimableTokens] = useState(null);
	const [statusMessage, setStatusMessage] = useState("");

	const [provider, setProvider] = useState(null);
	const [signer, setSigner] = useState(null);
	const [contract, setContract] = useState(null);
	const [giniContract, setGiniContract] = useState(null);
	const [approveAmount, setApproveAmount] = useState("");
	const [bridgeAmount, setBridgeAmount] = useState("");
	const [receiver, setReceiver] = useState("");
	const [whiteListAddress, setWhiteListAddress] = useState("");
	const [blackListAddress, setBlackListAddress] = useState("");

	// stagenet - polygon amoy
	const NETWORK_NAME = "Stagenet";
	const CONTRACT_ADDRESS = "0xA17bd954dCf3B56C47f75146D27Ff30A0afF78F2";
	const GINI_ADDRESS = "0x909F99de524da90959Bf4A42180934e3129815F1";
	const GINI_ABI = giniAbi;
	const CONTRACT_ABI = abi;
	const CHAIN_ID = "0x13882";
	const RPC_URL = "https://polygon-amoy.g.alchemy.com/v2/m8XKrD1n0ZnGfcQMEXXW5Q46qmgGmD7w";
	const CHAIN_NAME = "Amoy";
	const CURRENCY_SYMBOL = "Matic";

	// Mainnet
	// const NETWORK_NAME = "Mainnet"
	// const CONTRACT_ADDRESS = "0xcB0d103fa126C81dA139e6f372886fc5e1e58F9d";
	// const GINI_ADDRESS = "0xA1A39558718d6FA57C699dC45981e5a1b2e25d08";
	// const GINI_ABI = giniAbi;
	// const CONTRACT_ABI = abi;
	// const CHAIN_ID = "0x89";
	// const RPC_URL = "https://polygon-rpc.com";
	// const CHAIN_NAME = "Polygon";
	// const CURRENCY_SYMBOL = "Matic";

	// Check if MetaMask is installed
	useEffect(() => {
		if (!window.ethereum) {
			setError("MetaMask is not installed. Please install it to use this app.");
		}
	}, []);

	// Connect to MetaMask
	const connectWallet = async () => {
		try {
			const { webProvider, webSigner, webContract2 } = await initializeBlockchain();
			const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
			setAccount(accounts[0]);

			const balance = await webContract2.balanceOf(webSigner.address);
			setBalance(ethers.formatEther(balance));
			setError(null);
		} catch (err) {
			setError(err.message);
		}
	};

	// Function to configure the network in MetaMask
	const configureNetwork = async () => {
		try {
			if (!window.ethereum) {
				throw new Error("MetaMask is not installed.");
			}

			const currentChainId = await window.ethereum.request({ method: "eth_chainId" });

			if (currentChainId !== CHAIN_ID) {
				try {
					await window.ethereum.request({
						method: "wallet_switchEthereumChain",
						params: [{ chainId: CHAIN_ID }],
					});
				} catch (switchError) {
					// If the network is not added, add it to MetaMask
					if (switchError.code === 4902) {
						await window.ethereum.request({
							method: "wallet_addEthereumChain",
							params: [
								{
									chainId: CHAIN_ID,
									chainName: CHAIN_NAME,
									nativeCurrency: {
										name: CURRENCY_SYMBOL,
										symbol: CURRENCY_SYMBOL,
										decimals: 18,
									},
									rpcUrls: [RPC_URL],
								},
							],
						});
					} else {
						throw new Error("Failed to switch network: " + switchError.message);
					}
				}
			}
		} catch (err) {
			setError(err.message);
		}
	};

	// Function to initialize provider, signer, and contract
	const initializeBlockchain = async () => {
		try {
			if (!window.ethereum) {
				throw new Error("MetaMask is not installed.");
			}

			await configureNetwork(); // Ensure network is set before proceeding

			const webProvider = new ethers.BrowserProvider(window.ethereum);
			const webSigner = await webProvider.getSigner();
			const webContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, webSigner);
			const webContract2 = new ethers.Contract(GINI_ADDRESS, GINI_ABI, webSigner);

			setProvider(webProvider);
			setSigner(webSigner);
			setContract(webContract);
			setGiniContract(webContract2);

			return { webProvider, webSigner, webContract, webContract2 };
		} catch (err) {
			setError(err.message);
		}
	};

	const whiteListToken = async () => {
		if (!whiteListAddress || isNaN(whiteListAddress)) {
			alert("Enter a valid amount!");
			return;
		}

		try {
			const tx = await giniContract.allow(whiteListAddress);
			await tx.wait();
			console.log(tx.hash);
			alert(`${whiteListAddress} whiteListed! `);
		} catch (error) {
			console.error("whiteListing Error:", error);
			alert("whiteListing Failed!");
		}
	};

	const blackListToken = async () => {
		if (!blackListAddress || isNaN(blackListAddress)) {
			alert("Enter a valid amount!");
			return;
		}

		try {
			const tx = await giniContract.deny(blackListAddress);
			await tx.wait();
			console.log(tx.hash);
			alert(`${blackListAddress} blockListed! `);
		} catch (error) {
			console.error("blockListing Error:", error);
			alert("blockListing Failed!");
		}
	};

	return (
		<div className="card">
			{account ? (
				<div className="wallet-info">
					<p>Network Name : {NETWORK_NAME}</p>
					<p>Gini Address : {GINI_ADDRESS}</p>
					<div className="input-group">
						<input
							type="text"
							placeholder="Enter whitelist address"
							value={whiteListAddress}
							onChange={(e) => setWhiteListAddress(e.target.value)}
							className="input"
						/>
						<button onClick={whiteListToken} className="btn btn-blue">
							WhiteList Address
						</button>
					</div>
					<div className="input-group">
						<input
							type="text"
							placeholder="Enter whitelist address"
							value={blackListAddress}
							onChange={(e) => setBlackListAddress(e.target.value)}
							className="input"
						/>
						<button onClick={blackListToken} className="btn btn-blue">
							BlackList Address
						</button>
					</div>
				</div>
			) : (
				<button onClick={connectWallet} className="btn">
					Connect MetaMask
				</button>
			)}
			{error && <p className="error-message">{error}</p>}
		</div>
	);
}

export { PolygonConnect };
