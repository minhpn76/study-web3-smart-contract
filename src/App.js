import './App.css';
import Web3 from 'web3/dist/web3.min.js'
import { useCallback, useEffect, useState } from 'react';
import ContractFaucetsBuild from 'contracts/Faucets.json'

function App() {
  /**Missing reload app */
  const [web3API, setWeb3API] = useState({
    provider: null,
    web3: null,
    contract: null
  })

  const [account, setAccount] = useState('')

  const [balanceWallet, setBalanceWallet] = useState(null)
  
  useEffect(() => {
    const loadProvider = async () => {
      const provider = await window.ethereum
      const web3 = new Web3(provider)
      const networkId = await web3.eth.net.getId();
      const contractFaucets = new web3.eth.Contract(
        ContractFaucetsBuild.abi,
        ContractFaucetsBuild.networks[networkId].address
      )
      if (provider) {
        setWeb3API({
          web3,
          provider,
          contract: contractFaucets
        })
      } else {
        console.log("Connect metamask, Plz");
      }
    }
    loadProvider()
  }, [])

  useEffect(() => {
    const getAccount = async () => {
      const account = await web3API.web3.eth.getAccounts()
      return setAccount(account[0])
    }
    getAccount()
  }, [web3API.web3])

  useEffect(() => {
    const getBalance = async () => {
      const { web3 } = web3API
      const balance = await web3.eth.getBalance(account)
      const convertBalance = await web3.utils.fromWei(balance, 'ether')
      return setBalanceWallet(convertBalance)
    }
    getBalance()
  }, [web3API.web3, account])

  const handleRequestMetaMask = () => {
    const provider = window.ethereum
    provider.request({ method: 'eth_requestAccounts' }).then(accounts => {
      setAccount(accounts[0])
    })
  }

  const handleDonate = useCallback(async () => {
    const { contract, web3 } = web3API
    // DONATE 1 ETH
    await contract.methods.getPlayersAddress().send({
      from: account,
      value: web3.utils.toWei('1', 'ether')
    });
  }, [web3API, account])

  

  return (
    <div className="App">
      <div>
        <h1>Current Balance: <b>{ balanceWallet ?? 0} ETH</b></h1>
      </div>
      <div className="box-button">
        <button className="btn donate" onClick={handleDonate}>Donate</button>
        {/* <button className="btn withdraw">Withdraw</button> */}
        <button className="btn connect-wallet" onClick={handleRequestMetaMask}>Connect wallet</button>
        <div className='notice-donante'><i>Automatic get 1 ETH from your wallet</i></div>
      </div>
      <div>
        Account address: <b>{ account ?? 'Access denined' }</b>
      </div>
    </div>
  );
}

export default App;
