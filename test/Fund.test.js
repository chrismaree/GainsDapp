// //tests helpers

const {
    EVMRevert
} = require('./helpers/EVMRevert');

const {
    assertRevert
} = require('./helpers/assertRevert');
const {
    sendTransaction
} = require('./helpers/sendTransaction');
const advanceBlock = require("./helpers/advanceToBlock");
const _ = require("lodash");
const BigNumber = web3.BigNumber;

//libraries
require("chai")
    .use(require("chai-as-promised"))
    .use(require("chai-bignumber")(BigNumber))
    .should();

//contracts
const Fund = artifacts.require("gainsbot_fund");
const UniSwapExchange = artifacts.require("uniswap_exchange");
const UniSwapFactory = artifacts.require("uniswap_factory");
const ERC20Token = artifacts.require("ERC20")

contract("gainsbot_fund", (accounts) => {
    const factory = accounts[0]
    const owner = accounts[1]
    const randomAddress = accounts[2]
    const uniSwapOwner = accounts[3]
    const tokenOwner = accounts[4]
    const fundFactory = accounts[5]

    const weekDuration = 604800 //one week in seconds
    const monthDuration = 2628000000
    const deadline = 1742680400 //some point in the future

    //for this given reserve ratio the price of 1 dai in eth will be 0.01 eth/dai 
    // giving the value of 100 usd per eth. 
    const ethReserve = web3.utils.toWei("10", 'ether')
    const daiReserve = web3.utils.toWei("1000", 'ether')
    const daiSupply = web3.utils.toWei("10000", 'ether')

    before(async function () {
        //start by creating a template contract
        uniswapExchangeTemplate = await UniSwapExchange.new({
            from: uniSwapOwner
        })
        //then make the factory
        uniswapFactory = await UniSwapFactory.new({
            from: uniSwapOwner
        })
        //and assigne the template to the factory
        await uniswapFactory.initializeFactory(uniswapExchangeTemplate.address, {
            from: uniSwapOwner
        })
        //next, we need a token for our uniswap exchange. make a fake dai contract
        daiTokenContract = await ERC20Token.new(
            web3.utils.toHex("Dai Mock"),
            web3.utils.toHex("DAI"),
            18,
            daiSupply, {
                from: tokenOwner
            })
        //we can now make an exchange for the fake dai contract from the factory
        await uniswapFactory.createExchange(daiTokenContract.address, {
            from: tokenOwner
        })
        //grab the exchange address and make an instance of it so we can add liquidity and trade against it
        daiExchangeAddress = await uniswapFactory.getExchange(daiTokenContract.address)
        uniswapDaiExchange = await UniSwapExchange.at(daiExchangeAddress)

        //approve before we add liquidity
        await daiTokenContract.approve(daiExchangeAddress,
            daiSupply, {
                from: tokenOwner
            })

        amountAproved = await daiTokenContract.allowance(tokenOwner, daiExchangeAddress)

        //add the liquidity. 100000 dai and 1000 ether gives a starting price of 100 usd/eth
        //the min_liquidity param does not matter for initial liquidity addition
        //set the deadline way into the future. 
        await uniswapDaiExchange.addLiquidity(0,
            daiReserve,
            deadline, {
                from: tokenOwner,
                value: ethReserve
            })

        ethBalance = await web3.eth.getBalance(uniswapDaiExchange.address)
        console.log("Dai exchange ETH balance:", ethBalance.toString())

        tokenBalance = await daiTokenContract.balanceOf(uniswapDaiExchange.address)
        console.log("Dai exchange DAI balance:", tokenBalance.toString())

        currentEthPrice = tokenBalance / ethBalance
        console.log("Dai exchange ETH balance price per eth in dai:", currentEthPrice.toString())

        //deploy the fund
        fund = await Fund.new(owner, daiExchangeAddress, daiExchangeAddress, {
            from: fundFactory
        });
    })

    beforeEach(async function () {})
    describe("Fund Sell Contract", function () {
        context("Deployment and Configuration", function () {
            it("should correctly deploy and set owner", async () => {
                let assignedOwner = await fund.owner()
                assert.equal(assignedOwner, owner, "did not correctly assign owner");
            });
            it("should correctly set __init__ settings", async () => {
                let fundFactory = await fund.factory()
                assert.equal(fundFactory, fundFactory, "did not correctly assign factory factory");

                let lastSell = await fund.lastSell()
                assert.equal(lastSell, -1, "did not correctly assign lastSell to -1");

                let _uniswapDaiExchange = await fund.uniswapDaiExchange()
                assert.equal(_uniswapDaiExchange, uniswapDaiExchange.address, "did not correctly assign uniswapDaiExchange");

                let _uniswapcDaiExchange = await fund.uniswapcDaiExchange()
                assert.equal(_uniswapcDaiExchange, uniswapDaiExchange.address, "did not correctly assign uniswapDaiExchange");
            });
        })
        context("Fund setup", function () {
                it("should correctly assign provided parameters to sell contract", async () => {
                    // sell 1000 wei at each step
                    let _sellAmounts = Array(20).fill(null).map((u, i) => web3.utils.toWei("0.1", 'ether'))
                    // make the sell prices 110, 120, 130...210. Ether start price from uniswap is 100
                    let _sellPrices = Array(20).fill(null).map((u, i) => web3.utils.toWei((110 + i * 10).toString(), 'ether'))
                    let _commitmentLock = 0
                    await fund.setupFund(owner, _sellAmounts, _sellPrices, 20, _commitmentLock, false, {
                        from: owner
                    })

                    let sellAmount = await fund.getSellAmounts()
                    sellAmountProcessed = sellAmount.map(x => x.toString())
                    assert.equal(JSON.stringify(sellAmountProcessed), JSON.stringify(_sellAmounts), "did not correctly assign sellAmount");

                    let sellPrice = await fund.getSellPrices()
                    sellPriceProcessed = sellPrice.map(x => x.toString())
                    assert.equal(JSON.stringify(sellPriceProcessed), JSON.stringify(_sellPrices), "did not correctly assign sellPrices");

                    let commitmentLock = await fund.commitmentLock()
                    assert.equal(commitmentLock, 0, "did not correctly set commitment lock")

                    let sellToCDai = await fund.sellToCDai()
                    assert.equal(sellToCDai, false, "did not correctly set sell to cDai to false")
                })
                it("should revert if not called by fund owner", async () => {
                    let sellAmounts = Array(20).fill(null).map((u, i) => 1000)
                    let sellPrices = Array(20).fill(null).map((u, i) => 110 + i * 10)
                    let commitmentLock = 0
                    await assertRevert(fund.setupFund(owner, sellAmounts, sellPrices, 20, commitmentLock, false, {
                        from: randomAddress
                    }), EVMRevert);
                })
                it("should revert if already set up", async () => {
                    let sellAmounts = Array(20).fill(null).map((u, i) => 1000)
                    let sellPrices = Array(20).fill(null).map((u, i) => 110 + i * 10)
                    let commitmentLock = 0
                    await assertRevert(fund.setupFund(owner, sellAmounts, sellPrices, 20, commitmentLock, false, {
                        from: owner
                    }), EVMRevert);
                })
            }),
            context("Fund helpers", function () {
                it("should correctly calculate current Ether price in Uniswap exchange", async () => {
                    let currentPriceInAtto = await fund.getEtherPrice()
                    //starting price in ether should be 100 usd (dai) per ether. This is equal to 100*10^18 atto
                    assert.equal("100000000000000000000", currentPriceInAtto.toString(), "price not set to 10^18 Atto per eth")
                })
            })
        context("Trade Execution", function () {
            it("should revert if price below trade target", async () => {
                //starting sell price is 110 USD per ether as defined when deploying the contract.
                //begining Ether price in uniswap is 100 ether. Should revert as the price is below the defined sell price
                await assertRevert(fund.executeTrade.call(0), EVMRevert)
            })
            it("should correctly exchange Ether for Dai at sell price", async () => {
                //Start by preforming an exchange within the uniswap pool to shift the ether price such that
                //we are in alighment with the first trade amount. To do this we will add 50 dai to the pool.
                //This should be enough to push the price per ether above 110 USD. 

                await uniswapDaiExchange.tokenToEthSwapInput(web3.utils.toWei("50", 'ether'), 1, deadline, {
                    from: tokenOwner
                })
                let ethBalance = await web3.eth.getBalance(uniswapDaiExchange.address)
                let tokenBalance = await daiTokenContract.balanceOf(uniswapDaiExchange.address)
                let currentEthPrice = tokenBalance / ethBalance
                //we want the price per ether to be larger than 110. This trade above makes it ~110.1

                assert.equal(currentEthPrice > 110, true, "price of ether did not change correctly")

                //We should now be able to preform the trade and check that the balances changed correctly.
                await fund.executeTrade.call(0)
            })
        })
    })
});