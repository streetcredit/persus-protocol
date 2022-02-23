const { default: Web3 } = require('web3')

const DappToken = artifacts.require('DappToken')
const DaiToken = artifacts.require('DaiToken')
const TokenFarm = artifacts.require('TokenFarm')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract ('Token Farm', async (accounts) => {
    let dappToken, daiToken, tokenFarm, result

    before(async () => {
        dappToken = await DappToken.new()
        daiToken = await DaiToken.new()
        tokenFarm = await TokenFarm.new(dappToken.address, daiToken.address)

        await daiToken.transfer(accounts[1], tokens('100'))
        await dappToken.transfer(tokenFarm.address, tokens('1000000'))
    })

    describe('Token Farm', async () => {
        it ('has a million tokens', async () => {
            result = await dappToken.balanceOf(tokenFarm.address)
            assert .equal(result.toString(), tokens('1000000'))
        } )

        it ('allows staking', async () => {
            await daiToken.approve(tokenFarm.address, tokens('100'), {from: accounts[1]})
            await tokenFarm.stakeTokens(tokens('100'), {from: accounts[1]})
            result = await tokenFarm.stakingBalance(accounts[1])
            assert .equal(result.toString(), tokens('100'))

            await tokenFarm.issueTokens({from: accounts[0]})
            result = await dappToken.balanceOf(accounts[1])
            assert .equal(result.toString(), tokens('100'))

            await tokenFarm.unstakeTokens(tokens('101'), {from: accounts[1]}).should.be.rejected
        })
    })
})