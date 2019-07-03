#An instance of this contract is deployed for each user. It stores all ether and interacts
#with uniswap to preform trades. Trades are initalized by relayers who are sent back the gass
#used in executing the trades.
contract Exchange():
    def getEthToTokenInputPrice(eth_sold: uint256) -> uint256(wei): constant
    def ethToTokenTransferInput(min_tokens: uint256, deadline: timestamp, recipient: address) -> uint256: modifying

owner: public(address)
factory: public(address)
uniswapExchange: Exchange

sellAmount: public(uint256[20])
sellPrices: public(uint256[20])
numberOfSells: uint256
lastSell: uint256

@public
def __init__(_owner: address):
    self.owner = _owner
    self.factory = msg.sender
    self.lastSell = -1

@public
@payable
def setupFund(_uniswapExchange: address, _sellAmount: uint256[20], _sellPrices: uint256[20]):
    assert msg.sender == self.owner
    self.uniswapExchange = Exchange(_uniswapExchange)
    self.sellAmount = _sellAmount
    self.sellPrices = _sellPrices


# @public
# def executeSell(_sellIndex: uint256):
#     Exchange.getEthToTokenInputPrice(1)
