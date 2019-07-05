
#An instance of this contract is deployed for each user. It stores all ether and interacts
#with uniswap to preform trades. Trades are initalized by relayers who are sent back the gass
#used in executing the trades. Current price of ether is pulled from the uniswap pool

contract Factory():
    def getExchange(token_addr: address) -> address: constant

contract Exchange():
    def getEthToTokenInputPrice(eth_sold: uint256) -> uint256(wei): constant
    def ethToTokenTransferInput(min_tokens: uint256, deadline: timestamp, recipient: address) -> uint256: modifying
    def tokenAddress() -> address: constant

contract Token():
    def balanceOf(_owner : address) -> uint256: constant
    def transfer(_to : address, _value : uint256) -> bool: modifying
    def transferFrom(_from : address, _to : address, _value : uint256) -> bool: modifying

owner: public(address)
factory: public(address)
recipient: public(address)

uniswapDaiExchange: public(Exchange)
uniswapcDaiExchange: public(Exchange)

daiTokenContract: public(Token)

sellAmounts: public(uint256[20])
sellPrices: public(uint256[20])
numberOfSells: public(int128)
lastSell: public(int128)
sellToCDai: public(bool)

commitmentLock: public(timestamp)
lastExecutedChange: public(timestamp)

@public
def __init__(_owner: address, _uniswapDaiExchange: address, _uniswapcDaiExchange: address):
    self.uniswapDaiExchange = Exchange(_uniswapDaiExchange)
    self.daiTokenContract = Token(self.uniswapDaiExchange.tokenAddress())
    self.uniswapcDaiExchange = Exchange(_uniswapcDaiExchange)

    self.owner = _owner
    self.factory = msg.sender
    self.lastSell = -1

@public
@payable
def setupFund(_recipient: address, _sellAmounts: uint256[20], _sellPrices: uint256[20], _numberOfSells: int128, _commitmentLock: timestamp, _sellToCDai: bool):
    assert msg.sender == self.owner
    assert self.lastExecutedChange == 0
    assert _numberOfSells <= 20  
    
    self.recipient = _recipient
    self.sellAmounts = _sellAmounts
    self.sellPrices = _sellPrices
    self.lastExecutedChange = block.timestamp
    self.numberOfSells = _numberOfSells
    self.commitmentLock = _commitmentLock
    self.sellToCDai = _sellToCDai

@constant
@public
def getSellAmounts() -> uint256[20]:
    return self.sellAmounts

@constant
@public
def getSellPrices() -> uint256[20]:
    return self.sellPrices

@constant
@public
def getEtherPrice() -> uint256:
    exchangeTokenBalance: uint256 = self.daiTokenContract.balanceOf(self.uniswapDaiExchange)
    exchangeEtherBalance: uint256(wei) = self.uniswapDaiExchange.balance
    exchangeEtherBalanceUint: uint256 = as_unitless_number(exchangeEtherBalance)
    return (exchangeTokenBalance*10**18) / exchangeEtherBalanceUint

@public
def executeTrade(_tradeIndex: int128) -> uint256:
    assert _tradeIndex < self.numberOfSells - 1
    assert self.getEtherPrice() > self.sellPrices[_tradeIndex]

    return self.uniswapDaiExchange.ethToTokenTransferInput(1, block.timestamp + 10, self.recipient, value = self.sellAmounts[_tradeIndex])
    
    
