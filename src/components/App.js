import React, { Component } from 'react'
import Web3 from 'web3'
import StreetCreditToken from '../abis/StreetCreditToken.json'
import DaiToken from '../abis/DaiToken.json'
import PersusProtocol from '../abis/PersusProtocol.json'
import Navbar from './Navbar'
import Main from './Main'
import './App.css'

class App extends Component {

  async componentWillMount() {
    await this.loadWeb3()
    await this.loadBlockchainData()
  }

  async loadBlockchainData() {
    const web3 = window.web3 
    const accounts = await web3.eth.getAccounts()
    this.setState({account: accounts[0]})
    const networkId = await web3.eth.net.getId()
    // load the contracts
    const streetCreditTokenData = StreetCreditToken.networks[networkId] 
    if(streetCreditTokenData) {
      const streetCreditToken = new web3.eth.Contract(StreetCreditToken.abi, streetCreditTokenData.address)
      this.setState({streetCreditToken: streetCreditToken})
      const streetCreditTokenBalance = await streetCreditToken.methods.balanceOf(this.state.account).call()
      this.setState({streetCreditTokenBalance: streetCreditTokenBalance.toString()})
    } else {
      window.alert('Street Credit Token not deployed to detected network')
    }
    // dai token contract
    const daiTokenData = DaiToken.networks[networkId]
    if(daiTokenData) {
      const daiToken = new web3.eth.Contract(DaiToken.abi, daiTokenData.address)
      this.setState({daiToken: daiToken})
      const daiTokenBalance = await daiToken.methods.balanceOf(this.state.account).call()
      this.setState({daiTokenBalance: daiTokenBalance.toString()})
    } else {
      window.alert('Dai Token not deployed to detected network')
    }
    // token farm contract
    const persusProtocolData = PersusProtocol.networks[networkId]
    if (persusProtocolData) {
      const persusProtocol = new web3.eth.Contract(PersusProtocol.abi, persusProtocolData.address)
      this.setState({persusProtocol: persusProtocol})
      const stakingBalance = await persusProtocol.methods.stakingBalance(this.state.account).call()
      this.setState({stakingBalance: stakingBalance.toString()})
    } else {
      window.alert('Persus Protocol not deployed to detected network')
    }

    this.setState({loading: false})
  }


  async loadWeb3() {
    if(window.ethereum) {
      window.web3 = new Web3(window.ethereum) 
      window.ethereum.enable()
    }
    else if(window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    }
    else {
      window.alert('Non-Ethereum browser detected. Consider trying MetaMask')
    }
  }

  stakeTokens = (amount) => {
    this.setState({ loading: true })
    this.state.daiToken.methods.approve(this.state.persusProtocol._address, amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
      this.state.persusProtocol.methods.stakeTokens(amount).send({ from: this.state.account }).on('transactionHash', (hash) => {
        this.setState({ loading: false })
      })
    })
  }

  unstakeTokens = (amount) => {
    this.setState({loading: true})
    this.state.persusProtocol.methods.unstakeTokens(amount).send({from: this.state.account}).on('transactionHash', (hash) => {
      this.setState({loading: false})
    })
  }

  constructor(props) {
    super(props)
    this.state = {
      account: '0x0',
      daiToken: {},
      streetCreditToken: {},
      persusProtocol: {},
      daiTokenBalance: '0',
      streetCreditTokenBalance: '0',
      stakingBalance: '0',
      loading: true
    }
  }

  render() {
    let content 
    if(this.state.loading) {
      content = <p id="loader">Loading..</p>
    } else content = <Main 
                        streetCreditTokenBalance={this.state.streetCreditTokenBalance}
                        daiTokenBalance={this.state.daiTokenBalance}
                        stakingBalance={this.state.stakingBalance}
                        stakeTokens={this.stakeTokens}
                        unstakeTokens={this.unstakeTokens}/>
    return (
      <div>
        <Navbar account={this.state.account} />
        <div className="container-fluid mt-5">
          <div className="row">
            <main role="main" className="col-lg-12 ml-auto mr-auto" style={{ maxWidth: '600px' }}>
              <div className="content mr-auto ml-auto">
                <a
                  href="http://street.credit"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                </a>

                {content}

              </div>
            </main>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
