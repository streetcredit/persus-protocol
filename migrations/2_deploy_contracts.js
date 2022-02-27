const StreetCreditToken = artifacts.require('StreetCreditToken')
const DaiToken = artifacts.require('DaiToken')
const PersusProtocol = artifacts.require('PersusProtocol')

module.exports = async function (deployer, network, accounts) {
  
    await deployer.deploy(StreetCreditToken)
    const streetCreditToken = await StreetCreditToken.deployed()

    await deployer.deploy(DaiToken)
    const daiToken = await DaiToken.deployed()

    await deployer.deploy(PersusProtocol, streetCreditToken.address, daiToken.address)
    const persusProtocol = await PersusProtocol.deployed()

    await streetCreditToken.transfer(persusProtocol.address, '1000000000000000000000000')
    await daiToken.transfer(accounts[1], '100000000000000000000')
}
