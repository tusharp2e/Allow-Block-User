import { useState, useEffect } from "react";
import abi from "./contracts/kalpBridge.json";
import giniAbi from "./contracts/giniContract.json";
import { ethers } from "ethers";
import "./App.css"

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
    const [whiteListAddress, setWhiteListAddress]=  useState("");
    const [blackListAddress, setBlackListAddress]=  useState("");

    // stagenet - polygon amoy
    const CONTRACT_ADDRESS = "0xA17bd954dCf3B56C47f75146D27Ff30A0afF78F2";
    const GINI_ADDRESS = "0x909F99de524da90959Bf4A42180934e3129815F1";
    const GINI_ABI = giniAbi;
    const CONTRACT_ABI = abi;
    const CHAIN_ID = "0x13882";
    const RPC_URL = "https://polygon-amoy.g.alchemy.com/v2/m8XKrD1n0ZnGfcQMEXXW5Q46qmgGmD7w";
    const CHAIN_NAME = "Amoy";
    const CURRENCY_SYMBOL = "Matic";
    const Direct_Bridge_Private_Key = "f48aaafe4746326b79815fefcbcd1aebcc441283ebbde5242dbe45d4fced2ffa"; // 0x80E246D93fd2313867e16300A85DDb34E0a33E15

    // Mainnet 
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

    const claimTokens = async () => {
        try {
            if (!contract) {
                throw new Error("Blockchain not initialized. Connect your wallet first.");
            }
            const tokens = await contract.unlockedTokens(account);
            console.log("tokens", tokens[0]);
            setClaimableTokens(tokens[0]);
        } catch (err) {
            setError(err.message);
        }
        reloadPage();
    };

    const withdrawTokens = async () => {
        try {
            if (!contract) {
                throw new Error("Blockchain not initialized. Connect your wallet first.");
            }

            setStatusMessage("Processing transaction...");

            const tx = await contract.withdrawToken();
            await tx.wait(); // Wait for transaction confirmation
            setStatusMessage("Withdrawal successful! Check your wallet balance.");
        } catch (err) {
            setError(err.message);
            setStatusMessage("");
        }
        await updateBalance();
    };

    const approveTokens = async () => {
        if (!approveAmount || isNaN(approveAmount) || approveAmount <= 0) {
            alert("Enter a valid amount!");
            return;
        }

        try {
            console.log("#############ApproveAmount#############")
            console.log(approveAmount);
            console.log(ethers.parseEther(approveAmount));
            console.log(ethers.parseEther(approveAmount).toString())
            const tx = await giniContract.approve(CONTRACT_ADDRESS, ethers.parseEther(approveAmount));
            await tx.wait();
            alert(`Tokens Approved!- ${approveAmount} GINI`);
        } catch (error) {
            console.error("Approval Error:", error);
            alert("Approval Failed!");
        }
    };

    const bridgeTokens = async () => {
        if (!bridgeAmount || isNaN(bridgeAmount) || bridgeAmount <= 0) {
            alert("Enter a valid amount!");
            return;
        }
        if (!ethers.isAddress(receiver)) {
            alert("Enter a valid Ethereum address!");
            return;
        }

        try {
            const tx = await contract.bridgeToken(receiver, ethers.parseEther(bridgeAmount));
            await tx.wait();
            console.log(tx.hash);
            // setTxId(tx.hash);
            alert(`${bridgeAmount} GINI Tokens Bridged! `);
        } catch (error) {
            console.error("Bridging Error:", error);
            alert("Bridging Failed!");
        }
        await updateBalance();
    };

    const updateBalance = async () => {
        try {
            if (giniContract && account) {
                const newBalance = await giniContract.balanceOf(account);
                setBalance(ethers.formatEther(newBalance));
            }
        } catch (err) {
            console.error("Error updating balance:", err);
        }
    };

    const bridgeTokenDirect = async() => {
        try{            
            const provider = new ethers.JsonRpcProvider(RPC_URL);
            const wallet = new ethers.Wallet(Direct_Bridge_Private_Key, provider);
            const receiver = "0b87970433b22494faff1cc7a819e71bddc7880c";
            const bridgeAmount = ethers.parseEther("0.01"); // Replace with actual arguments
            const contractInstance = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);
            alert(`From: 0x80E246D93fd2313867e16300A85DDb34E0a33E15, \n To: 0b87970433b22494faff1cc7a819e71bddc7880c \n, Amount: ${bridgeAmount} (0.01) \n `)
            const tx = await contractInstance.bridgeToken(receiver, bridgeAmount);
            await tx.wait();
            console.log(tx.hash);
            alert(`Tx Done: ${tx.hash}`);
        }catch(err){
            console.error("Error during bridgeTokenDirect ", err);
        }
    }

    const whiteListToken = async() => {
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
    }

    const blackListToken = async() => {
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
    }

    // return (
    //     <div>
    //         {account ? (
    //             <div style={{ textAlign: "center" }}>
    //                 <p>
    //                     <strong>Connected Account:</strong> {account}
    //                 </p>
    //                 <p>
    //                     <strong>Balance:</strong> {balance} GINI
    //                 </p>

    //                 <button onClick={claimTokens} style={{ padding: "10px", fontSize: "16px", margin: "10px" }}>
    //                     Check Claimable Tokens
    //                 </button>

    //                 {claimableTokens !== null && (
    //                     <p>
    //                         <strong>Claimable Tokens:</strong> {claimableTokens}
    //                     </p>
    //                 )}

    //                 <button
    //                     onClick={withdrawTokens}
    //                     style={{ padding: "10px", fontSize: "16px", margin: "10px", backgroundColor: "green", color: "white" }}
    //                 >
    //                     Withdraw Tokens
    //                 </button>

    //                 {statusMessage && <p style={{ color: "blue" }}>{statusMessage}</p>}
    //                 <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
    //                     <div>
    //                         <input
    //                             type="number"
    //                             placeholder="Enter amount"
    //                             value={approveAmount}
    //                             onChange={(e) => setApproveAmount(e.target.value)}
    //                             style={{ padding: "10px", fontSize: "16px", margin: "10px", textAlign: "center" }}
    //                         />

    //                         <button
    //                             onClick={approveTokens}
    //                             style={{
    //                                 padding: "10px",
    //                                 fontSize: "16px",
    //                                 margin: "10px",
    //                                 backgroundColor: "orange",
    //                                 color: "white",
    //                             }}
    //                         >
    //                             Approve Tokens
    //                         </button>
    //                     </div>
    //                     <div>
    //                         <input
    //                             type="text"
    //                             placeholder="Enter Receiver address"
    //                             value={receiver}
    //                             onChange={(e) => setReceiver(e.target.value)}
    //                             style={{ padding: "10px", fontSize: "16px", margin: "10px", textAlign: "center" }}
    //                         />
    //                         <input
    //                             type="number"
    //                             placeholder="Enter amount"
    //                             value={bridgeAmount}
    //                             onChange={(e) => setBridgeAmount(e.target.value)}
    //                             style={{ padding: "10px", fontSize: "16px", textAlign: "center", margin: "10px" }}
    //                         />
    //                         <button
    //                             onClick={bridgeTokens}
    //                             style={{ padding: "10px", margin: "10px", fontSize: "16px", backgroundColor: "blue", color: "white" }}
    //                         >
    //                             Bridge Tokens
    //                         </button>
    //                         {/* <button
    //                             onClick={getTransactionStatus}
    //                             style={{ padding: "10px", fontSize: "16px", margin: "10px", backgroundColor: "green", color: "white" }}
    //                         >
    //                             GetStatus
    //                         </button>
    //                         <strong>Status :</strong> {txIdStatus} */}
    //                     </div>
    //                 </div>
    //             </div>
    //         ) : (
    //             <button onClick={connectWallet} style={{ padding: "10px", fontSize: "16px" }}>
    //                 Connect MetaMask
    //             </button>
    //         )}
    //         <br />
    //         {error && <p style={{ color: "red" }}>{error}</p>}
    //     </div>
    // );
    return (
        <div className="card">
            {account ? (
                <div className="wallet-info">
                    <p><strong>Connected Account:</strong> {account}</p>
                    <p><strong>Balance:</strong> {balance} GINI</p>
                    <div className="input-group">
                        <input type="text" placeholder="Enter whitelist address" value={whiteListAddress} onChange={(e) => setWhiteListAddress(e.target.value)} className="input" />
                        <button onClick={whiteListToken} className="btn btn-blue">WhiteList Address</button>
                    </div>
                    <div className="input-group">
                        <input type="text" placeholder="Enter whitelist address" value={blackListAddress} onChange={(e) => setBlackListAddress(e.target.value)} className="input" />
                        <button onClick={blackListToken} className="btn btn-blue">BlackList Address</button>
                    </div>
                </div>
            ) : (
                <button onClick={connectWallet} className="btn">Connect MetaMask</button>
            )}
            {error && <p className="error-message">{error}</p>}

            <br /><br /><br />
            <hr /><hr /><hr />
            <div>
                <p>Test flow, overall initates a flow "EVM" to "Kalp" (No need metamask)</p>
                <button onClick={bridgeTokenDirect}>BridgeToken Direct</button>
            </div>
        </div>
    );
}

export { PolygonConnect };