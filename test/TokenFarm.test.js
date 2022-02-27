const { default: Web3 } = require('web3')

const StreetCreditToken = artifacts.require('StreetCreditToken')
const DaiToken = artifacts.require('DaiToken')
const PersusProtocol = artifacts.require('PersusProtocol')

require('chai')
    .use(require('chai-as-promised'))
    .should()

function tokens(n) {
    return web3.utils.toWei(n, 'ether');
}

contract ('Persus Protocol', async ([deployer, user]) => {
    let streetCreditToken, daiToken, persusProtocol, result

    before(async () => {
        streetCreditToken = await StreetCreditToken.new()
        daiToken = await DaiToken.new()
        persusProtocol = await PersusProtocol.new(streetCreditToken.address, daiToken.address)

        await daiToken.transfer(user, tokens('100'))
        await streetCreditToken.transfer(persusProtocol.address, tokens('1000000'))
    })

    // describe('Token Farm', async () => {
    //     it ('has a million tokens', async () => {
    //         result = await streetCreditToken.balanceOf(persusProtocol.address)
    //         assert.equal(result.toString(), tokens('1000000'))
    //     } )

    //     // it ('allows staking', async () => {
    //     //     await daiToken.approve(persusProtocol.address, tokens('100'), {from: user})
    //     //     await persusProtocol.stakeTokens(tokens('100'), {from: user})
    //     //     result = await persusProtocol.stakingBalance(user)
    //     //     assert .equal(result.toString(), tokens('100'))

    //     //     await persusProtocol.issueTokens({from: deployer})
    //     //     result = await streetCreditToken.balanceOf(user)
    //     //     assert .equal(result.toString(), tokens('100'))

    //     //     await persusProtocol.unstakeTokens(tokens('101'), {from: user1}).should.be.rejected
    //     // })
    // })

    before(async () => {
        result = await persusProtocol.buyTokens({from: deployer, value: web3.utils.toWei('1', 'Ether')})
        result = await persusProtocol.buyTokens({from: deployer, value: web3.utils.toWei('10', 'Ether')})
    })

    describe('Buy Tokens', async () => {
        it ('allows buy of tokens', async () => {
            
            // result = await streetCreditToken.balanceOf(user)
            // assert.equal(result.toString(), tokens('1000'))

            // let result = await streetCreditToken.balanceOf(persusProtocol.address)
            // assert.equal(result.toString(), tokens('999000'))

            console.log(result.logs)
        })
    })
})