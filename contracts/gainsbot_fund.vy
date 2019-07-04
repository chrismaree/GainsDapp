#An instance of this contract is deployed for each user. It stores all ether and interacts
#with uniswap to preform trades. Trades are initalized by relayers who are sent back the gass
#used in executing the trades.
contract Exchange():
    def getEthToTokenInputPrice(eth_sold: uint256) -> uint256(wei): constant
    def ethToTokenTransferInput(min_tokens: uint256, deadline: timestamp, recipient: address) -> uint256: modifying

owner: public(address)
factory: public(address)
uniswapDaiExchange: Exchange
uniswapcDaiExchange: Exchange

sellAmounts: public(uint256[20])
sellPrices: public(uint256[20])
numberOfSells: public(uint256)
lastSell: public(int128)
commitmentLock: public(timestamp)
lastExecutedChange: public(timestamp)

@public
def __init__(_owner: address):
    self.owner = _owner
    self.factory = msg.sender
    self.lastSell = -1

@public
@payable
def setupFund(_uniswapDaiExchange: address, _uniswapcDaiExchange: address, _sellAmounts: uint256[20], _sellPrices: uint256[20], _commitmentLock: timestamp):
    assert msg.sender == self.owner
    assert self.lastExecutedChange == 0
    self.uniswapDaiExchange = Exchange(_uniswapDaiExchange)
    self.uniswapcDaiExchange = Exchange(_uniswapcDaiExchange)
    self.sellAmounts = _sellAmounts
    self.sellPrices = _sellPrices
    self.lastExecutedChange = block.timestamp
    self.commitmentLock = _commitmentLock

@constant
@public
def getSellAmounts() -> uint256[20]:
    return self.sellAmounts

@constant
@public
def getSellPrices() -> uint256[20]:
    return self.sellPrices

# @public
# def executeSell(_sellIndex: uint256):
#     Exchange.getEthToTokenInputPrice(1)
