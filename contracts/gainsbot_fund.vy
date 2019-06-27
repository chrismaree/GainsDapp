contract Exchange():
    def getEthToTokenInputPrice(eth_sold: uint256) -> uint256(wei): constant
    def ethToTokenTransferInput(min_tokens: uint256, deadline: timestamp, recipient: address) -> uint256: modifying

owner: public(address)
factory: public(address)
uniswapExchange: Exchange

sellPercentages: uint256[100]
sellPrices: uint256[100]
numberOfSells: uint256


@public
def __init__(_uniswapExchange: address, _owner: address):
    self.owner = _owner
    self.factory = msg.sender
    self.uniswapExchange = Exchange(_uniswapExchange)


# def executeSell():

