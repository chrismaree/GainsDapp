// //tests helpers

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
    const fundOwner = accounts[5]

        const weekDuration = 604800 //one week in seconds
        const monthDuration = 2628000000
        const deadline = 1742680400 //some point in the future

    //for this given reserve ratio the price of 1 dai in eth will be 0.01 eth/dai 
    // giving the value of 100 usd per eth. 
    const ethReserve = web3.utils.toWei("1000", 'ether')
    const daiReserve = web3.utils.toWei("100000", 'ether')
    const daiSupply = web3.utils.toWei("1000000", 'ether')


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
        console.log("Aproved")
        console.log(amountAproved.toString())

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
        console.log("Dai exchange ETH balance")
        console.log(ethBalance.toString())

        tokenBalance = await daiTokenContract.balanceOf(uniswapDaiExchange.address)
        console.log("Dai exchange DAI balance")
        console.log(tokenBalance.toString())

        currentEthPrice = tokenBalance / ethBalance

        console.log("Dai exchange ETH balance price per eth in dai")
        console.log(currentEthPrice.toString())

        //deploy the fund
        Fund = await Fund.new(uniswapFactory.address, {
            from: owner
        });
    })

    beforeEach(async function () {


    })
    describe("SellContract", function () {
        context("Configuration", function () {
            it("should correctly deploy and set owner", async () => {
                let assignedOwner = await rebalancer.owner()
                assert.equal(assignedOwner, owner, "did not correctly assign owner");
            });
            it("should correctly set uniswap factory", async () => {
                let rebalancerFactory = await rebalancer.uniswapFactory()
                assert.equal(rebalancerFactory, uniswapFactory.address, "did not correctly assign uniswap factory");
            });
        })
        context("Evaluation Functions", function () {
            it("should correctly calculate the eth price based on balances of uniswap exchange", async () => {
            })
        })
    })
});